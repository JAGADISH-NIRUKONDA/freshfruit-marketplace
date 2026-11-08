import React from 'react';

export default function DataTable({
  columns = [],
  data = [],
  keyField = '_id',
  emptyMessage = 'No records found',
  onRowClick,
}) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`py-3 px-3 sm:px-4 ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100/80">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-stone-400 font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-emerald-50/40 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`py-3.5 px-3 sm:px-4 text-stone-700 font-medium ${
                      col.cellClassName || ''
                    }`}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
