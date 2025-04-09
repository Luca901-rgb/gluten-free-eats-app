
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useTables } from '@/context/TableContext';
import { toast } from 'sonner';

interface AddTableFormProps {
  restaurantId: string;
}

const AddTableForm = ({ restaurantId }: AddTableFormProps) => {
  const { addTable, getTablesByRestaurantId } = useTables();
  const restaurantTables = getTablesByRestaurantId(restaurantId);
  
  const [newTable, setNewTable] = useState<{
    tableNumber: number;
    seats: number;
  }>({
    tableNumber: 0,
    seats: 0,
  });

  const handleAddTable = () => {
    if (newTable.tableNumber <= 0 || newTable.seats <= 0) {
      toast.error('Il numero del tavolo e i posti devono essere maggiori di zero');
      return;
    }

    // Verifica se esiste già un tavolo con lo stesso numero
    const tableExists = restaurantTables.some(
      (table) => table.tableNumber === newTable.tableNumber
    );

    if (tableExists) {
      toast.error(`Il tavolo ${newTable.tableNumber} esiste già`);
      return;
    }

    const table = addTable({
      restaurantId,
      tableNumber: newTable.tableNumber,
      seats: newTable.seats,
      isAvailable: true,
      availableDates: [],
      unavailableDates: [],
      timeSlots: [
        { startTime: '12:00', endTime: '14:00' },
        { startTime: '19:00', endTime: '22:00' },
      ],
    });

    toast.success(`Tavolo ${table.tableNumber} aggiunto con successo`);
    setNewTable({ tableNumber: 0, seats: 0 });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Aggiungi Nuovo Tavolo</h2>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numero Tavolo
          </label>
          <Input
            type="number"
            min="1"
            value={newTable.tableNumber}
            onChange={(e) => setNewTable({ ...newTable, tableNumber: parseInt(e.target.value) || 0 })}
            className="w-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posti
          </label>
          <Input
            type="number"
            min="1"
            value={newTable.seats}
            onChange={(e) => setNewTable({ ...newTable, seats: parseInt(e.target.value) || 0 })}
            className="w-24"
          />
        </div>
        <Button onClick={handleAddTable} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Aggiungi Tavolo
        </Button>
      </div>
    </div>
  );
};

export default AddTableForm;
