import prisma from '../config/database.js';
import { calculateSoldCount, calculateExpectedCash, calculateDifference, formatDifference } from '../utils/calculations.js';

export const getReports = async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;

    const where = {
      userId: req.user.id
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const reports = await prisma.dailyReport.findMany({
      where,
      include: {
        shiftData: {
          include: {
            ticketDetails: {
              include: {
                ticket: true
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' },
      take: parseInt(limit)
    });

    res.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

export const getReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.dailyReport.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: {
        shiftData: {
          include: {
            ticketDetails: {
              include: {
                ticket: true
              }
            }
          },
          orderBy: { shiftType: 'asc' }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

export const createReport = async (req, res) => {
  try {
    const { date, shiftA, shiftB } = req.body;

    // Validate date
    const reportDate = new Date(date);
    if (isNaN(reportDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // Check if report already exists for this date
    const existing = await prisma.dailyReport.findFirst({
      where: {
        userId: req.user.id,
        date: reportDate
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Report already exists for this date' });
    }

    // Create report with shift data
    const report = await prisma.dailyReport.create({
      data: {
        userId: req.user.id,
        date: reportDate,
        shiftData: {
          create: [
            {
              shiftType: 'A',
              personName: shiftA.personName || null,
              onlineSales: parseFloat(shiftA.onlineSales) || 0,
              onlineCashes: parseFloat(shiftA.onlineCashes) || 0,
              instantCashes: parseFloat(shiftA.instantCashes) || 0,
              actualCash: parseFloat(shiftA.actualCash) || 0,
              totalScratchSales: parseFloat(shiftA.totalScratchSales) || 0,
              expectedScratchCash: parseFloat(shiftA.expectedScratchCash) || 0,
              totalExpectedCash: parseFloat(shiftA.totalExpectedCash) || 0,
              difference: parseFloat(shiftA.difference?.replace(/[^0-9.-]+/g, '') || 0),
              dataEntered: shiftA.dataEntered || false,
              ticketDetails: {
                create: shiftA.ticketDetails.map(td => ({
                  ticketId: td.ticketId,
                  prevNum: td.prevNum,
                  currentNum: td.currentNum,
                  soldCount: td.soldCount,
                  totalAmount: td.totalAmount
                }))
              }
            },
            {
              shiftType: 'B',
              personName: shiftB.personName || null,
              onlineSales: parseFloat(shiftB.onlineSales) || 0,
              onlineCashes: parseFloat(shiftB.onlineCashes) || 0,
              instantCashes: parseFloat(shiftB.instantCashes) || 0,
              actualCash: parseFloat(shiftB.actualCash) || 0,
              totalScratchSales: parseFloat(shiftB.totalScratchSales) || 0,
              expectedScratchCash: parseFloat(shiftB.expectedScratchCash) || 0,
              totalExpectedCash: parseFloat(shiftB.totalExpectedCash) || 0,
              difference: parseFloat(shiftB.difference?.replace(/[^0-9.-]+/g, '') || 0),
              dataEntered: shiftB.dataEntered || false,
              ticketDetails: {
                create: shiftB.ticketDetails.map(td => ({
                  ticketId: td.ticketId,
                  prevNum: td.prevNum,
                  currentNum: td.currentNum,
                  soldCount: td.soldCount,
                  totalAmount: td.totalAmount
                }))
              }
            }
          ]
        }
      },
      include: {
        shiftData: {
          include: {
            ticketDetails: {
              include: {
                ticket: true
              }
            }
          }
        }
      }
    });

    // Update ticket states from Shift B
    if (shiftB.ticketDetails && shiftB.ticketDetails.length > 0) {
      for (const ticketDetail of shiftB.ticketDetails) {
        await prisma.ticketState.upsert({
          where: {
            userId_ticketId: {
              userId: req.user.id,
              ticketId: ticketDetail.ticketId
            }
          },
          update: {
            lastNumber: ticketDetail.currentNum
          },
          create: {
            userId: req.user.id,
            ticketId: ticketDetail.ticketId,
            lastNumber: ticketDetail.currentNum
          }
        });
      }
    }

    res.status(201).json({ 
      message: 'Report created successfully',
      report 
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, shiftA, shiftB } = req.body;

    // Check if report exists and belongs to user
    const existing = await prisma.dailyReport.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Delete existing shift data and ticket details
    await prisma.ticketDetail.deleteMany({
      where: {
        shiftData: {
          reportId: id
        }
      }
    });
    await prisma.shiftData.deleteMany({
      where: { reportId: id }
    });

    // Update report date if provided
    if (date) {
      await prisma.dailyReport.update({
        where: { id },
        data: { date: new Date(date) }
      });
    }

    // Recreate shift data
    const report = await prisma.dailyReport.update({
      where: { id },
      data: {
        shiftData: {
          create: [
            {
              shiftType: 'A',
              personName: shiftA.personName || null,
              onlineSales: parseFloat(shiftA.onlineSales) || 0,
              onlineCashes: parseFloat(shiftA.onlineCashes) || 0,
              instantCashes: parseFloat(shiftA.instantCashes) || 0,
              actualCash: parseFloat(shiftA.actualCash) || 0,
              totalScratchSales: parseFloat(shiftA.totalScratchSales) || 0,
              expectedScratchCash: parseFloat(shiftA.expectedScratchCash) || 0,
              totalExpectedCash: parseFloat(shiftA.totalExpectedCash) || 0,
              difference: parseFloat(shiftA.difference?.replace(/[^0-9.-]+/g, '') || 0),
              dataEntered: shiftA.dataEntered || false,
              ticketDetails: {
                create: shiftA.ticketDetails.map(td => ({
                  ticketId: td.ticketId,
                  prevNum: td.prevNum,
                  currentNum: td.currentNum,
                  soldCount: td.soldCount,
                  totalAmount: td.totalAmount
                }))
              }
            },
            {
              shiftType: 'B',
              personName: shiftB.personName || null,
              onlineSales: parseFloat(shiftB.onlineSales) || 0,
              onlineCashes: parseFloat(shiftB.onlineCashes) || 0,
              instantCashes: parseFloat(shiftB.instantCashes) || 0,
              actualCash: parseFloat(shiftB.actualCash) || 0,
              totalScratchSales: parseFloat(shiftB.totalScratchSales) || 0,
              expectedScratchCash: parseFloat(shiftB.expectedScratchCash) || 0,
              totalExpectedCash: parseFloat(shiftB.totalExpectedCash) || 0,
              difference: parseFloat(shiftB.difference?.replace(/[^0-9.-]+/g, '') || 0),
              dataEntered: shiftB.dataEntered || false,
              ticketDetails: {
                create: shiftB.ticketDetails.map(td => ({
                  ticketId: td.ticketId,
                  prevNum: td.prevNum,
                  currentNum: td.currentNum,
                  soldCount: td.soldCount,
                  totalAmount: td.totalAmount
                }))
              }
            }
          ]
        }
      },
      include: {
        shiftData: {
          include: {
            ticketDetails: {
              include: {
                ticket: true
              }
            }
          }
        }
      }
    });

    // Update ticket states from Shift B
    if (shiftB.ticketDetails && shiftB.ticketDetails.length > 0) {
      for (const ticketDetail of shiftB.ticketDetails) {
        await prisma.ticketState.upsert({
          where: {
            userId_ticketId: {
              userId: req.user.id,
              ticketId: ticketDetail.ticketId
            }
          },
          update: {
            lastNumber: ticketDetail.currentNum
          },
          create: {
            userId: req.user.id,
            ticketId: ticketDetail.ticketId,
            lastNumber: ticketDetail.currentNum
          }
        });
      }
    }

    res.json({ 
      message: 'Report updated successfully',
      report 
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.dailyReport.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await prisma.dailyReport.delete({
      where: { id }
    });

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
};

