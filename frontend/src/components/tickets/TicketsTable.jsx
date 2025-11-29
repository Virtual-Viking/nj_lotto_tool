export default function TicketsTable({ tickets }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Scratch-Off Tickets</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th rowSpan="2" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-bottom">#</th>
              <th rowSpan="2" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-bottom">Ticket Name</th>
              <th rowSpan="2" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-bottom">Price</th>
              <th rowSpan="2" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-bottom">Prev. # (P)</th>
              <th colSpan="3" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-l">Shift A</th>
              <th colSpan="3" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-l">Shift B</th>
              <th rowSpan="2" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-bottom" style={{ minWidth: '180px' }}>Actions</th>
            </tr>
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l">End # (A)</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold (C)</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (T)</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l">End # (B)</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold (C)</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (T)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket, index) => (
              <tr key={ticket.id} className="ticket-row">
                <td className="px-2 py-3">{index + 1}</td>
                <td className="px-2 py-3 font-semibold">{ticket.name}</td>
                <td className="px-2 py-3">${ticket.price.toFixed(2)}</td>
                <td className="px-2 py-3">
                  <input
                    type="number"
                    className="w-24 p-1 border rounded prev-number-input"
                    defaultValue={ticket.ticketState?.lastNumber || ticket.bookSize - 1}
                  />
                </td>
                <td className="px-2 py-3 border-l">
                  <input
                    type="number"
                    className="w-24 p-1 border rounded shift-a-input"
                    placeholder={ticket.ticketState?.lastNumber || ticket.bookSize - 1}
                  />
                </td>
                <td className="px-2 py-3 sold-a-count">0</td>
                <td className="px-2 py-3 total-a-amount font-bold">$0.00</td>
                <td className="px-2 py-3 border-l">
                  <input
                    type="number"
                    className="w-24 p-1 border rounded shift-b-input"
                    placeholder=""
                  />
                </td>
                <td className="px-2 py-3 sold-b-count">0</td>
                <td className="px-2 py-3 total-b-amount font-bold">$0.00</td>
                <td className="px-2 py-3 space-x-1 whitespace-nowrap">
                  <button className="nil-p-btn bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600">NIL P</button>
                  <button className="nil-btn bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600" data-shift="A">NIL A</button>
                  <button className="nil-btn bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600" data-shift="B">NIL B</button>
                  <button className="reload-btn bg-gray-500 text-white px-2 py-1 text-xs rounded hover:bg-gray-600">Reload</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

