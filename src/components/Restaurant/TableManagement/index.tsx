
import React from 'react';
import AddTableForm from './AddTableForm';
import TableList from './TableList';

interface TableManagementProps {
  restaurantId: string;
}

const TableManagement = ({ restaurantId }: TableManagementProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Gestione Tavoli</h1>
      <AddTableForm restaurantId={restaurantId} />
      <TableList restaurantId={restaurantId} />
    </div>
  );
};

export default TableManagement;
