
import React, { useState } from 'react';
import { Table, useTables } from '@/context/TableContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table as UITable,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface TableListProps {
  restaurantId: string;
}

const TableList = ({ restaurantId }: TableListProps) => {
  const { updateTable, deleteTable, getTablesByRestaurantId } = useTables();
  const restaurantTables = getTablesByRestaurantId(restaurantId);
  
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    tableNumber: number;
    seats: number;
  }>({
    tableNumber: 0,
    seats: 0,
  });

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
  );
};

export default TableList;
