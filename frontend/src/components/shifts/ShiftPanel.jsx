import { useState } from 'react';

export default function ShiftPanel({ shift, shiftDate, employees, tickets, onCalculate, onSave }) {
  const [personName, setPersonName] = useState('');
  const [onlineSales, setOnlineSales] = useState('');
  const [onlineCashes, setOnlineCashes] = useState('');
  const [instantCashes, setInstantCashes] = useState('');
  const [actualCash, setActualCash] = useState('');
  const [totalScratchSales, setTotalScratchSales] = useState(0);
  const [expectedScratchCash, setExpectedScratchCash] = useState(0);
  const [totalExpectedCash, setTotalExpectedCash] = useState(0);
  const [difference, setDifference] = useState('---');

  // This is a simplified version - full implementation would calculate from tickets
  const handleCalculate = () => {
    // Calculate totals from tickets
    // This would integrate with the tickets table
    onCalculate?.();
  };

  return (
    <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shift {shift} ({shift === 'A' ? 'Morning' : 'Evening'})</h2>
      <div className="grid grid-cols-1 gap-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Person's Name</label>
          <input
            type="text"
            list={`employeeList${shift}`}
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Select or type name..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
          <datalist id={`employeeList${shift}`}>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.name} />
            ))}
          </datalist>
        </div>
        <h3 className="text-lg font-semibold border-t pt-4">Machine Report</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Online Sales ($)</label>
          <input
            type="number"
            value={onlineSales}
            onChange={(e) => setOnlineSales(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Online Cashes (-$)</label>
          <input
            type="number"
            value={onlineCashes}
            onChange={(e) => setOnlineCashes(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Instant Cashes (-$)</label>
          <input
            type="number"
            value={instantCashes}
            onChange={(e) => setInstantCashes(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="0.00"
          />
        </div>
        <h3 className="text-lg font-semibold border-t pt-4">Reckoning Summary</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Scratch-Off Sales</label>
          <p className="font-bold text-lg bg-gray-100 p-2 rounded-md">${totalScratchSales.toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Expected Scratch-Off Cash</label>
          <p className="font-bold text-lg bg-gray-100 p-2 rounded-md">${expectedScratchCash.toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Expected Cash</label>
          <p className="font-bold text-lg bg-gray-100 p-2 rounded-md">${totalExpectedCash.toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Actual Cash Collected ($)</label>
          <input
            type="number"
            value={actualCash}
            onChange={(e) => setActualCash(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Difference</label>
          <p className="text-2xl font-bold text-center p-2 rounded-md">{difference}</p>
        </div>
      </div>
    </div>
  );
}

