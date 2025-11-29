import prisma from '../config/database.js';

export const getBackups = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const backups = await prisma.backup.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      select: {
        id: true,
        backupType: true,
        createdAt: true
      }
    });

    res.json({ backups });
  } catch (error) {
    console.error('Get backups error:', error);
    res.status(500).json({ error: 'Failed to fetch backups' });
  }
};

export const createBackup = async (req, res) => {
  try {
    // Fetch all user data
    const [tickets, ticketStates, employees, reports] = await Promise.all([
      prisma.ticket.findMany({
        where: { userId: req.user.id },
        orderBy: { orderIndex: 'asc' }
      }),
      prisma.ticketState.findMany({
        where: { userId: req.user.id },
        include: { ticket: true }
      }),
      prisma.employee.findMany({
        where: { userId: req.user.id }
      }),
      prisma.dailyReport.findMany({
        where: { userId: req.user.id },
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
        orderBy: { date: 'desc' }
      })
    ]);

    const backupData = {
      tickets,
      ticketStates,
      employees,
      reports,
      backupDate: new Date().toISOString()
    };

    const backup = await prisma.backup.create({
      data: {
        userId: req.user.id,
        backupData,
        backupType: 'manual'
      }
    });

    res.status(201).json({ 
      message: 'Backup created successfully',
      backup: {
        id: backup.id,
        backupType: backup.backupType,
        createdAt: backup.createdAt
      }
    });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
};

export const downloadBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const backup = await prisma.backup.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!backup) {
      return res.status(404).json({ error: 'Backup not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="backup_${backup.id}.json"`);
    res.json(backup.backupData);
  } catch (error) {
    console.error('Download backup error:', error);
    res.status(500).json({ error: 'Failed to download backup' });
  }
};

