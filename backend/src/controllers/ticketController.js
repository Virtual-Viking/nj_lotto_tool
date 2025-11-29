import prisma from '../config/database.js';

// Default ticket configuration
const DEFAULT_TICKETS = [
  { name: "Pocket Change", price: 1, bookSize: 200 },
  { name: "Easy As 123", price: 2, bookSize: 150 },
  { name: "Big Money Spectacular", price: 2, bookSize: 150 },
  { name: "Stacks of Green", price: 2, bookSize: 150 },
  { name: "Electric 8's", price: 2, bookSize: 100 },
  { name: "Loteria", price: 3, bookSize: 100 },
  { name: "Win for Life", price: 3, bookSize: 100 },
  { name: "Crossword", price: 3, bookSize: 60 },
  { name: "Wild Poker", price: 5, bookSize: 60 },
  { name: "Bingo Times 10", price: 5, bookSize: 60 },
  { name: "Loteria Grande", price: 5, bookSize: 60 },
  { name: "Super Crossword", price: 5, bookSize: 60 },
  { name: "Money Rush", price: 5, bookSize: 60 },
  { name: "Cash 4-Ever", price: 5, bookSize: 60 },
  { name: "UNO", price: 5, bookSize: 60 },
  { name: "Wild$IDE", price: 5, bookSize: 60 },
  { name: "Neon 9s", price: 10, bookSize: 30 },
  { name: "Shore Things", price: 10, bookSize: 30 },
  { name: "50,000 Jumbo Bucks", price: 10, bookSize: 30 },
  { name: "500.00 Lion's Share", price: 10, bookSize: 30 },
  { name: "Mega Hots 7's", price: 20, bookSize: 20 },
  { name: "Crossword Bonanza", price: 20, bookSize: 20 },
  { name: "Crossword Extreme", price: 30, bookSize: 20 },
  { name: "Millionaire Maker", price: 25, bookSize: 20 },
  { name: "Quarter Million Cash", price: 20, bookSize: 20 },
  { name: "100X Cash Blitz", price: 20, bookSize: 20 },
  { name: "5,000,000 Fortune", price: 30, bookSize: 20 },
  { name: "Colossal Crossword", price: 30, bookSize: 20 }
];

export const getTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      orderBy: { orderIndex: 'asc' },
      include: {
        ticketState: true
      }
    });

    // If no tickets, initialize with defaults
    if (tickets.length === 0) {
      const createdTickets = await prisma.ticket.createMany({
        data: DEFAULT_TICKETS.map((ticket, index) => ({
          userId: req.user.id,
          name: ticket.name,
          price: ticket.price,
          bookSize: ticket.bookSize,
          orderIndex: index
        }))
      });

      // Create initial ticket states
      const ticketRecords = await prisma.ticket.findMany({
        where: { userId: req.user.id }
      });

      await prisma.ticketState.createMany({
        data: ticketRecords.map(ticket => ({
          userId: req.user.id,
          ticketId: ticket.id,
          lastNumber: ticket.bookSize - 1
        }))
      });

      // Fetch again with states
      const newTickets = await prisma.ticket.findMany({
        where: { userId: req.user.id },
        orderBy: { orderIndex: 'asc' },
        include: {
          ticketState: true
        }
      });

      return res.json({ tickets: newTickets });
    }

    res.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

export const updateTickets = async (req, res) => {
  try {
    const { tickets } = req.body;

    if (!Array.isArray(tickets)) {
      return res.status(400).json({ error: 'Tickets must be an array' });
    }

    // Delete existing tickets and states
    await prisma.ticketState.deleteMany({
      where: { userId: req.user.id }
    });
    await prisma.ticket.deleteMany({
      where: { userId: req.user.id }
    });

    // Create new tickets
    const createdTickets = await prisma.ticket.createMany({
      data: tickets.map((ticket, index) => ({
        userId: req.user.id,
        name: ticket.name,
        price: parseFloat(ticket.price),
        bookSize: parseInt(ticket.bookSize),
        orderIndex: index
      }))
    });

    // Create ticket states
    const ticketRecords = await prisma.ticket.findMany({
      where: { userId: req.user.id }
    });

    await prisma.ticketState.createMany({
      data: tickets.map((ticket, index) => {
        const ticketRecord = ticketRecords.find(t => t.orderIndex === index);
        return {
          userId: req.user.id,
          ticketId: ticketRecord.id,
          lastNumber: parseInt(ticket.initial || ticket.bookSize - 1)
        };
      })
    });

    // Fetch updated tickets
    const updatedTickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      orderBy: { orderIndex: 'asc' },
      include: {
        ticketState: true
      }
    });

    res.json({ 
      message: 'Tickets updated successfully',
      tickets: updatedTickets 
    });
  } catch (error) {
    console.error('Update tickets error:', error);
    res.status(500).json({ error: 'Failed to update tickets' });
  }
};

export const getTicketStates = async (req, res) => {
  try {
    const states = await prisma.ticketState.findMany({
      where: { userId: req.user.id },
      include: {
        ticket: true
      }
    });

    res.json({ states });
  } catch (error) {
    console.error('Get ticket states error:', error);
    res.status(500).json({ error: 'Failed to fetch ticket states' });
  }
};

export const updateTicketStates = async (req, res) => {
  try {
    const { states } = req.body;

    if (!Array.isArray(states)) {
      return res.status(400).json({ error: 'States must be an array' });
    }

    // Update or create states
    for (const state of states) {
      await prisma.ticketState.upsert({
        where: {
          userId_ticketId: {
            userId: req.user.id,
            ticketId: state.ticketId
          }
        },
        update: {
          lastNumber: parseInt(state.lastNumber)
        },
        create: {
          userId: req.user.id,
          ticketId: state.ticketId,
          lastNumber: parseInt(state.lastNumber)
        }
      });
    }

    const updatedStates = await prisma.ticketState.findMany({
      where: { userId: req.user.id },
      include: {
        ticket: true
      }
    });

    res.json({ 
      message: 'Ticket states updated successfully',
      states: updatedStates 
    });
  } catch (error) {
    console.error('Update ticket states error:', error);
    res.status(500).json({ error: 'Failed to update ticket states' });
  }
};

