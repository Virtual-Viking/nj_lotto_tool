import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ticketsAPI, employeesAPI } from '../../services/api';

export default function SettingsModal({ onClose, tickets, employees }) {
  const queryClient = useQueryClient();
  const [newEmployeeName, setNewEmployeeName] = useState('');

  const addEmployeeMutation = useMutation(employeesAPI.addEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
      setNewEmployeeName('');
    },
  });

  const deleteEmployeeMutation = useMutation(employeesAPI.deleteEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries('employees');
    },
  });

  const handleAddEmployee = () => {
    if (newEmployeeName.trim()) {
      addEmployeeMutation.mutate({ name: newEmployeeName.trim() });
    }
  };

  const handleDeleteEmployee = (id) => {
    if (confirm('Remove this employee?')) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  return (
    <div className="modal show" onClick={(e) => e.target.classList.contains('modal') && onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={onClose} className="text-3xl font-bold">&times;</button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Employee Management</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="New employee name..."
              className="flex-grow p-2 border rounded-md"
              onKeyPress={(e) => e.key === 'Enter' && handleAddEmployee()}
            />
            <button
              onClick={handleAddEmployee}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Add
            </button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto border p-2 rounded-md">
            {employees.length === 0 ? (
              <p className="text-sm text-gray-500">No employees added yet.</p>
            ) : (
              employees.map((emp) => (
                <div key={emp.id} className="flex justify-between items-center bg-gray-100 p-1 rounded">
                  <span>{emp.name}</span>
                  <button
                    onClick={() => handleDeleteEmployee(emp.id)}
                    className="text-red-500 hover:text-red-700 font-bold px-2"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Ticket Configuration</h3>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Book Size:</strong> Total tickets in a book (e.g., 200).<br />
            <strong>Initial #:</strong> Current number for first-time setup.
          </p>
          <div className="overflow-y-auto" style={{ maxHeight: '45vh' }}>
            <table className="min-w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Price ($)</th>
                  <th className="p-2 text-left">Book Size</th>
                  <th className="p-2 text-left">Initial #</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr key={ticket.id} className="border-b">
                    <td className="p-2 font-semibold">{index + 1}</td>
                    <td className="p-2">{ticket.name}</td>
                    <td className="p-2">${ticket.price.toFixed(2)}</td>
                    <td className="p-2">{ticket.bookSize}</td>
                    <td className="p-2">{ticket.ticketState?.lastNumber ?? ticket.bookSize - 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

