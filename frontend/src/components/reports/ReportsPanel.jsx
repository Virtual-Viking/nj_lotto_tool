export default function ReportsPanel({ reports, editingIndex, onLoadReport, onDeleteReport }) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Reports & Sessions</h2>
      <p className="text-xs text-gray-500 mb-2">Click a report to load it for editing.</p>
      <div className="space-y-2 mb-4 h-48 overflow-y-auto">
        {reports.length === 0 ? (
          <p className="text-gray-500 text-sm">No reports saved.</p>
        ) : (
          reports.map((report, index) => (
            <div
              key={report.id}
              className={`report-item flex justify-between items-center border rounded p-2 ${
                editingIndex === index ? 'bg-blue-100' : ''
              }`}
            >
              <button
                onClick={() => onLoadReport(index)}
                className="flex-grow text-left hover:bg-gray-100 p-2 rounded"
              >
                {new Date(report.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
              </button>
              <button
                onClick={() => onDeleteReport(report.id)}
                className="text-red-500 hover:text-red-700 font-bold px-2"
              >
                X
              </button>
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow disabled:bg-gray-400"
          disabled={reports.length === 0}
        >
          Generate PDF
        </button>
        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow disabled:bg-gray-400"
          disabled={reports.length === 0}
        >
          Clear List
        </button>
      </div>
    </div>
  );
}

