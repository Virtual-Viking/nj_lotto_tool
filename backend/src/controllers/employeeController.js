import prisma from '../config/database.js';

export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' }
    });

    res.json({ employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Employee name is required' });
    }

    // Check if employee already exists
    const existing = await prisma.employee.findUnique({
      where: {
        userId_name: {
          userId: req.user.id,
          name: name.trim()
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Employee already exists' });
    }

    const employee = await prisma.employee.create({
      data: {
        userId: req.user.id,
        name: name.trim()
      }
    });

    res.status(201).json({ 
      message: 'Employee added successfully',
      employee 
    });
  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await prisma.employee.delete({
      where: { id }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

