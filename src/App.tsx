import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { TableProvider } from './context/TableContext';
import { Toaster } from './components/ui/sonner';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantPage from './pages/RestaurantPage';
import './App.css';

function App() {
  return (
    <Router>
      <BookingProvider>
        <TableProvider>
          <Routes>
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/dashboard" element={<RestaurantDashboard />} />
          </Routes>
          <Toaster />
        </TableProvider>
      </BookingProvider>
    </Router>
  );
}

export default App;
