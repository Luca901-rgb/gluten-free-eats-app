
import React, { useState } from 'react';
import { Table, useTables } from '@/context/TableContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Edit, Save } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Table as UITable,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface TableManagementProps {
  restaurantId: string;
}

const TableManagement = ({ restaurantId }: TableManagementProps) => {
  const { tables, addTable, updateTable, deleteTable, getTablesByRestaurantId } = useTables();
  const restaurantTables = getTablesByRestaurantId(restaurantId);
  
  const [newTable, setNewTable] = useState<{
    tableNumber: number;
    seats: number;
  }>({
    tableNumber: 0,
    seats: 0,
  });

  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
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

  const handleEdit = (table: Table) => {
    setEditingTable(table.id);
    setEditData({
      tableNumber: table.tableNumber,
      seats: table.seats,
    });
  };

  const handleSaveEdit = (id: string) => {
    if (editData.tableNumber <= 0 || editData.seats <= 0) {
      toast.error('Il numero del tavolo e i posti devono essere maggiori di zero');
      return;
    }

    // Verifica se esiste già un tavolo con lo stesso numero (escluso questo tavolo)
    const tableExists = restaurantTables.some(
      (table) => table.tableNumber === editData.tableNumber && table.id !== id
    );

    if (tableExists) {
      toast.error(`Il tavolo ${editData.tableNumber} esiste già`);
      return;
    }

    updateTable(id, {
      tableNumber: editData.tableNumber,
      seats: editData.seats,
    });

    toast.success('Tavolo aggiornato con successo');
    setEditingTable(null);
  };

  const handleDelete = (id: string, tableNumber: number) => {
    deleteTable(id);
    toast.success(`Tavolo ${tableNumber} eliminato`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Gestione Tavoli</h1>
      
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
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Tavoli Disponibili</h2>
          {restaurantTables.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nessun tavolo disponibile. Aggiungi il tuo primo tavolo.
            </p>
          ) : (
            <UITable>
              <TableHeader>
                <TableRow>
                  <TableHead>Numero Tavolo</TableHead>
                  <TableHead>Posti</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurantTables
                  .sort((a, b) => a.tableNumber - b.tableNumber)
                  .map((table) => (
                    <TableRow key={table.id}>
                      <TableCell>
                        {editingTable === table.id ? (
                          <Input
                            type="number"
                            min="1"
                            value={editData.tableNumber}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                tableNumber: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20"
                          />
                        ) : (
                          `Tavolo ${table.tableNumber}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTable === table.id ? (
                          <Input
                            type="number"
                            min="1"
                            value={editData.seats}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                seats: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-20"
                          />
                        ) : (
                          `${table.seats} ${table.seats === 1 ? 'posto' : 'posti'}`
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingTable === table.id ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveEdit(table.id)}
                            className="mr-2"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Salva
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(table)}
                            className="mr-2"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifica
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(table.id, table.tableNumber)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Elimina
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </UITable>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableManagement;
