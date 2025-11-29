import prisma from '../config/database.js';

export const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const report = await prisma.dailyReport.findFirst({
      where: {
        userId: req.user.id,
        date: new Date(date)
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

    if (!report) {
      return res.status(404).json({ error: 'No report found for this date' });
    }

    const summary = {
      date: report.date,
      shiftA: report.shiftData.find(s => s.shiftType === 'A'),
      shiftB: report.shiftData.find(s => s.shiftType === 'B'),
      totals: {
        totalSales: (report.shiftData[0]?.totalScratchSales || 0) + (report.shiftData[1]?.totalScratchSales || 0),
        totalExpectedCash: (report.shiftData[0]?.totalExpectedCash || 0) + (report.shiftData[1]?.totalExpectedCash || 0),
        totalActualCash: (report.shiftData[0]?.actualCash || 0) + (report.shiftData[1]?.actualCash || 0),
        totalDifference: (report.shiftData[0]?.difference || 0) + (report.shiftData[1]?.difference || 0)
      }
    };

    res.json({ summary });
  } catch (error) {
    console.error('Get daily summary error:', error);
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
};

export const getWeeklySummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const reports = await prisma.dailyReport.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
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
      },
      orderBy: { date: 'asc' }
    });

    const summary = calculatePeriodSummary(reports);

    res.json({ 
      period: { startDate, endDate },
      summary 
    });
  } catch (error) {
    console.error('Get weekly summary error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly summary' });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const reports = await prisma.dailyReport.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lte: endDate
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
      },
      orderBy: { date: 'asc' }
    });

    const summary = calculatePeriodSummary(reports);

    res.json({ 
      period: { year, month },
      summary 
    });
  } catch (error) {
    console.error('Get monthly summary error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly summary' });
  }
};

export const getCustomSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const reports = await prisma.dailyReport.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
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
      },
      orderBy: { date: 'asc' }
    });

    const summary = calculatePeriodSummary(reports);

    res.json({ 
      period: { startDate, endDate },
      summary 
    });
  } catch (error) {
    console.error('Get custom summary error:', error);
    res.status(500).json({ error: 'Failed to fetch custom summary' });
  }
};

function calculatePeriodSummary(reports) {
  let totalSales = 0;
  let totalExpectedCash = 0;
  let totalActualCash = 0;
  let totalDifference = 0;
  const ticketPerformance = {};
  const employeePerformance = {};

  reports.forEach(report => {
    report.shiftData.forEach(shift => {
      totalSales += shift.totalScratchSales || 0;
      totalExpectedCash += shift.totalExpectedCash || 0;
      totalActualCash += shift.actualCash || 0;
      totalDifference += shift.difference || 0;

      // Track employee performance
      if (shift.personName) {
        if (!employeePerformance[shift.personName]) {
          employeePerformance[shift.personName] = {
            shifts: 0,
            totalSales: 0,
            totalDifference: 0
          };
        }
        employeePerformance[shift.personName].shifts++;
        employeePerformance[shift.personName].totalSales += shift.totalScratchSales || 0;
        employeePerformance[shift.personName].totalDifference += shift.difference || 0;
      }

      // Track ticket performance
      shift.ticketDetails.forEach(td => {
        const ticketName = td.ticket.name;
        if (!ticketPerformance[ticketName]) {
          ticketPerformance[ticketName] = {
            totalSold: 0,
            totalAmount: 0
          };
        }
        ticketPerformance[ticketName].totalSold += td.soldCount || 0;
        ticketPerformance[ticketName].totalAmount += td.totalAmount || 0;
      });
    });
  });

  return {
    totalReports: reports.length,
    totals: {
      totalSales,
      totalExpectedCash,
      totalActualCash,
      totalDifference
    },
    ticketPerformance,
    employeePerformance
  };
}

