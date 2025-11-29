import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ticketsAPI, employeesAPI, reportsAPI } from '../services/api';
import { calculateSoldCount, calculateExpectedCash, calculateDifference, formatDifference } from '../utils/calculations';
import ShiftPanel from '../components/shifts/ShiftPanel';
import TicketsTable from '../components/tickets/TicketsTable';
import ReportsPanel from '../components/reports/ReportsPanel';
import SettingsModal from '../components/settings/SettingsModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [editingReportIndex, setEditingReportIndex] = useState(null);
  const queryClient = useQueryClient();

  // Fetch tickets
  const { data: ticketsData, isLoading: ticketsLoading } = useQuery('tickets', ticketsAPI.getTickets);
  const tickets = ticketsData?.data?.tickets || [];

  // Fetch employees
  const { data: employeesData } = useQuery('employees', employeesAPI.getEmployees);
  const employees = employeesData?.data?.employees || [];

  // Fetch reports
  const { data: reportsData } = useQuery('reports', reportsAPI.getReports);
  const reports = reportsData?.data?.reports || [];

  // Mutations
  const saveReportMutation = useMutation(reportsAPI.createReport, {
    onSuccess: () => {
      queryClient.invalidateQueries('reports');
      queryClient.invalidateQueries('tickets');
      alert('Day report saved successfully!');
      resetDayInputs(true);
    },
  });

  const updateReportMutation = useMutation(
    ({ id, data }) => reportsAPI.updateReport(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('reports');
        queryClient.invalidateQueries('tickets');
        alert('Day report updated successfully!');
        setEditingReportIndex(null);
        resetDayInputs(true);
      },
    }
  );

  const deleteReportMutation = useMutation(reportsAPI.deleteReport, {
    onSuccess: () => {
      queryClient.invalidateQueries('reports');
    },
  });

  const performCalculation = (isFinal = false) => {
    // This will be handled by the child components
    // For now, return null
    return null;
  };

  const resetDayInputs = (startNextDay) => {
    setEditingReportIndex(null);
    if (startNextDay && reports.length > 0) {
      const latestReport = reports[reports.length - 1];
      const latestDate = new Date(latestReport.date);
      latestDate.setUTCDate(latestDate.getUTCDate() + 1);
      setShiftDate(latestDate.toISOString().split('T')[0]);
    }
  };

  const handleSaveDay = async (dayReport) => {
    if (editingReportIndex !== null) {
      const report = reports[editingReportIndex];
      await updateReportMutation.mutateAsync({
        id: report.id,
        data: dayReport,
      });
    } else {
      await saveReportMutation.mutateAsync(dayReport);
    }
  };

  const handleLoadReport = (index) => {
    setEditingReportIndex(index);
    // Load report data into form
    // This will be handled by child components
  };

  const handleDeleteReport = async (id) => {
    if (confirm('Are you sure you want to delete this report?')) {
      await deleteReportMutation.mutateAsync(id);
    }
  };

  if (ticketsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <div className="container mx-auto p-4 md:p-6">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://www.njlottery.com/content/dam/portal/images/NewJerseyLottery_Logo_Full%20Color.png"
              alt="NJ Lottery Logo"
              className="h-16"
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-700">Hudson Mart</h1>
              <p className="text-slate-500">104 Washington Street, Hoboken NJ</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 self-center">{user?.email}</span>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-transform transform hover:scale-105"
            >
              Settings
            </button>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow"
            >
              Logout
            </button>
          </div>
        </header>

        <main>
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="shiftDate" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="shiftDate"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <ShiftPanel
              shift="A"
              shiftDate={shiftDate}
              employees={employees}
              onCalculate={performCalculation}
              onSave={handleSaveDay}
              tickets={tickets}
            />
            <ShiftPanel
              shift="B"
              shiftDate={shiftDate}
              employees={employees}
              onCalculate={performCalculation}
              onSave={handleSaveDay}
              tickets={tickets}
            />
            <ReportsPanel
              reports={reports}
              editingIndex={editingReportIndex}
              onLoadReport={handleLoadReport}
              onDeleteReport={handleDeleteReport}
            />
          </div>

          <div className="flex justify-center items-center gap-4 my-6 flex-wrap">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105">
              Calculate Day
            </button>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105">
              {editingReportIndex !== null ? 'Update Day & Start Next' : 'Save Day & Start Next'}
            </button>
          </div>

          <TicketsTable tickets={tickets} />
        </main>

        <footer className="text-center text-sm text-gray-500 mt-8">
          <p>
            Developed by{' '}
            <a
              href="https://github.com/Virtual-Viking"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Virtual-Viking
            </a>
          </p>
        </footer>
      </div>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          tickets={tickets}
          employees={employees}
        />
      )}
    </div>
  );
}

