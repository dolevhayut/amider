import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  mobileLabel?: string; // Optional custom label for mobile view
  hideOnMobile?: boolean; // Hide this column on mobile
  mobileOrder?: number; // Order in mobile view (lower = higher priority)
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  onRowClick 
}: DataTableProps<T>) {
  // Filter and sort columns for mobile view
  const mobileColumns = columns
    .filter(col => !col.hideOnMobile)
    .sort((a, b) => (a.mobileOrder ?? 999) - (b.mobileOrder ?? 999));

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500">
                    אין נתונים להצגה
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(item)}
                    className={onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 text-sm text-gray-900 text-right">
                        {column.render ? column.render(item) : item[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            אין נתונים להצגה
          </div>
        ) : (
          data.map((item, index) => {
            // Find actions column
            const actionsColumn = columns.find(col => col.key === 'actions');
            
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
              >
                {/* Regular data fields */}
                <div
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? 'cursor-pointer space-y-3' : 'space-y-3'}
                >
                  {mobileColumns.map((column) => {
                    const value = column.render ? column.render(item) : item[column.key];
                    const label = column.mobileLabel || column.header;
                    
                    // Skip rendering if value is null/undefined/empty
                    if (value === null || value === undefined || value === '') return null;
                    
                    return (
                      <div key={column.key} className="flex justify-between items-start gap-3">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider flex-shrink-0">
                          {label}
                        </span>
                        <div className="text-sm text-gray-900 text-right flex-1">
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Actions at bottom of card */}
                {actionsColumn && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-end gap-2">
                      {actionsColumn.render ? actionsColumn.render(item) : item[actionsColumn.key]}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

