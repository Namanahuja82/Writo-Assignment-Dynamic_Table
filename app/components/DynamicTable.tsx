'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Column, Row, CellValue } from '../types';

interface DynamicTableProps {
  initialColumns: Column[];
  initialData: Row[];
}

const DynamicTable: React.FC<DynamicTableProps> = ({ initialColumns, initialData }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [data, setData] = useState<Row[]>(initialData);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<'string' | 'number'>('string');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const addColumn = useCallback(() => {
    if (newColumnName && !columns.some(col => col.name === newColumnName)) {
      setColumns(prevColumns => [...prevColumns, { name: newColumnName, type: newColumnType }]);
      setData(prevData => prevData.map(row => ({ ...row, [newColumnName]: newColumnType === 'number' ? 0 : '' })));
      setNewColumnName('');
    }
  }, [newColumnName, newColumnType, columns]);

  const addRow = useCallback(() => {
    const newRow: Row = {};
    columns.forEach(column => {
      newRow[column.name] = column.type === 'number' ? 0 : '';
    });
    setData(prevData => [...prevData, newRow]);
  }, [columns]);

  const updateCell = useCallback((rowIndex: number, columnName: string, value: CellValue) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [columnName]: value };
      return newData;
    });
  }, []);

  const handleFilter = useCallback((columnName: string, filterValue: string) => {
    setFilters(prevFilters => ({ ...prevFilters, [columnName]: filterValue }));
  }, []);

  const handleSort = useCallback((columnName: string) => {
    setSortColumn(prevSortColumn => {
      if (prevSortColumn === columnName) {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortOrder('asc');
      }
      return columnName;
    });
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let result = data;

   
    Object.entries(filters).forEach(([columnName, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => {
          const cellValue = row[columnName];
          if (Array.isArray(cellValue)) {
            return cellValue.some(v => v.toString().toLowerCase().includes(filterValue.toLowerCase()));
          }
          return cellValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    
    if (sortColumn) {
      const column = columns.find(c => c.name === sortColumn);
      if (column) {
        result.sort((a, b) => {
          const aValue = a[sortColumn];
          const bValue = b[sortColumn];
          if (column.type === 'number') {
            return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
          }
          return sortOrder === 'asc' ? aValue.toString().localeCompare(bValue.toString()) : bValue.toString().localeCompare(aValue.toString());
        });
      }
    }

    return result;
  }, [data, filters, sortColumn, sortOrder, columns]);

  const formatCellValue = (value: CellValue): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="New column name"
          className="mr-2 p-2 border rounded"
        />
        <select
          value={newColumnType}
          onChange={(e) => setNewColumnType(e.target.value as 'string' | 'number')}
          className="mr-2 p-2 border rounded"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
        </select>
        <button onClick={addColumn} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Add Column</button>
        <button onClick={addRow} className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">Add Row</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.name} className="border p-2">
                  <div className="flex flex-col">
                    <span>{column.name}</span>
                    <input
                      type="text"
                      onChange={(e) => handleFilter(column.name, e.target.value)}
                      placeholder="Filter"
                      className="mt-1 p-1 border rounded text-sm"
                    />
                    <button onClick={() => handleSort(column.name)} className="mt-1 p-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors">
                      Sort {sortColumn === column.name ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(column => (
                  <td key={column.name} className="border p-2">
                    <input
                      type={column.type === 'number' ? 'number' : 'text'}
                      value={formatCellValue(row[column.name])}
                      onChange={(e) => updateCell(rowIndex, column.name, column.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;
