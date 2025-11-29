import prisma from '../config/database.js';

/**
 * Create automatic backup for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Created backup record
 */
export async function createAutomaticBackup(userId) {
  try {
    // Fetch all user data
    const [tickets, ticketStates, employees, reports] = await Promise.all([
      prisma.ticket.findMany({
        where: { userId },
        orderBy: { orderIndex: 'asc' }
      }),
      prisma.ticketState.findMany({
        where: { userId },
        include: { ticket: true }
      }),
      prisma.employee.findMany({
        where: { userId }
      }),
      prisma.dailyReport.findMany({
        where: { userId },
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
        userId,
        backupData,
        backupType: 'auto'
      }
    });

    return backup;
  } catch (error) {
    console.error(`Error creating automatic backup for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Clean up old backups based on retention policy
 * @param {number} retentionDays - Number of days to retain backups
 * @returns {Promise<number>} - Number of backups deleted
 */
export async function cleanupOldBackups(retentionDays = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await prisma.backup.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });

    return result.count;
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
    throw error;
  }
}

/**
 * Create automatic backups for all users
 * Called by scheduled cron job
 */
export async function createBackupsForAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true }
    });

    const results = await Promise.allSettled(
      users.map(user => createAutomaticBackup(user.id))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Automatic backup completed: ${successful} successful, ${failed} failed`);
    
    return { successful, failed };
  } catch (error) {
    console.error('Error creating backups for all users:', error);
    throw error;
  }
}

