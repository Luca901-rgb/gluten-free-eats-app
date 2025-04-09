
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Table {
  id: string;
  restaurantId: string;
  tableNumber: number;
  seats: number;
  isAvailable: boolean;
  // Questi campi servono per la gestione della disponibilità temporale
  availableDates?: string[]; // Date in cui il tavolo è disponibile (formato ISO)
  unavailableDates?: string[]; // Date in cui il tavolo non è disponibile (formato ISO)
  timeSlots?: { 
    startTime: string; // formato HH:MM
    endTime: string; // formato HH:MM
  }[];
}

interface TableContextType {
  tables: Table[];
  addTable: (table: Omit<Table, 'id'>) => Table;
  updateTable: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  getTablesByRestaurantId: (restaurantId: string) => Table[];
  getAvailableTables: (restaurantId: string, date: string, partySize: number) => Table[];
  reserveTable: (tableId: string, date: string) => void;
  releaseTable: (tableId: string, date: string) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

// Dati di esempio per i tavoli
const initialTables: Table[] = [
  {
    id: 't1',
    restaurantId: '1',
    tableNumber: 1,
    seats: 2,
    isAvailable: true,
    availableDates: ['2023-11-25', '2023-11-26', '2023-11-27'],
    timeSlots: [
      { startTime: '12:00', endTime: '14:00' },
      { startTime: '19:00', endTime: '22:00' },
    ]
  },
  {
    id: 't2',
    restaurantId: '1',
    tableNumber: 2,
    seats: 4,
    isAvailable: true,
    availableDates: ['2023-11-25', '2023-11-26', '2023-11-27'],
    timeSlots: [
      { startTime: '12:00', endTime: '14:00' },
      { startTime: '19:00', endTime: '22:00' },
    ]
  },
  {
    id: 't3',
    restaurantId: '1',
    tableNumber: 3,
    seats: 6,
    isAvailable: true,
    availableDates: ['2023-11-25', '2023-11-27'],
    timeSlots: [
      { startTime: '12:00', endTime: '14:00' },
      { startTime: '19:00', endTime: '22:00' },
    ]
  },
];

export function TableProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<Table[]>(initialTables);

  const addTable = (table: Omit<Table, 'id'>): Table => {
    const newTable: Table = {
      ...table,
      id: `t${Date.now()}`, // Genera un ID unico basato sul timestamp
    };
    setTables((prevTables) => [...prevTables, newTable]);
    return newTable;
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === id ? { ...table, ...updates } : table
      )
    );
  };

  const deleteTable = (id: string) => {
    setTables((prevTables) => prevTables.filter((table) => table.id !== id));
  };

  const getTablesByRestaurantId = (restaurantId: string): Table[] => {
    return tables.filter((table) => table.restaurantId === restaurantId);
  };

  const getAvailableTables = (
    restaurantId: string,
    date: string,
    partySize: number
  ): Table[] => {
    // Formatta la data in YYYY-MM-DD
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    return tables.filter(
      (table) =>
        table.restaurantId === restaurantId &&
        table.isAvailable &&
        table.seats >= partySize &&
        (!table.availableDates || table.availableDates.includes(formattedDate)) &&
        (!table.unavailableDates || !table.unavailableDates.includes(formattedDate))
    );
  };

  const reserveTable = (tableId: string, date: string) => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.id === tableId) {
          let updatedUnavailableDates = [...(table.unavailableDates || [])];
          if (!updatedUnavailableDates.includes(formattedDate)) {
            updatedUnavailableDates.push(formattedDate);
          }
          return {
            ...table,
            unavailableDates: updatedUnavailableDates,
          };
        }
        return table;
      })
    );
  };

  const releaseTable = (tableId: string, date: string) => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            unavailableDates: (table.unavailableDates || []).filter(
              (d) => d !== formattedDate
            ),
          };
        }
        return table;
      })
    );
  };

  return (
    <TableContext.Provider
      value={{
        tables,
        addTable,
        updateTable,
        deleteTable,
        getTablesByRestaurantId,
        getAvailableTables,
        reserveTable,
        releaseTable,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTables() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTables must be used within a TableProvider');
  }
  return context;
}
