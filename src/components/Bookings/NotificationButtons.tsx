
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, AlertCircle } from 'lucide-react';
import { Booking } from '@/context/BookingContext';

interface NotificationButtonsProps {
  unreadBookings: string[];
  attendanceBookings: Booking[];
  onShowNotifications: () => void;
  onShowAttendance: () => void;
}

const NotificationButtons = ({
  unreadBookings,
  attendanceBookings,
  onShowNotifications,
  onShowAttendance
}: NotificationButtonsProps) => {
  return (
    <>
      {unreadBookings.length > 0 && (
        <Button 
          onClick={onShowNotifications}
          className="mb-6 bg-primary hover:bg-primary/90 flex items-center"
        >
          <Bell className="mr-2 h-4 w-4" />
          {unreadBookings.length} {unreadBookings.length === 1 ? 'nuova prenotazione' : 'nuove prenotazioni'} da confermare
        </Button>
      )}
      
      {attendanceBookings.length > 0 && (
        <Button 
          onClick={onShowAttendance}
          className="mb-6 ml-2 bg-amber-500 hover:bg-amber-600 flex items-center"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          {attendanceBookings.length} {attendanceBookings.length === 1 ? 'prenotazione' : 'prenotazioni'} da verificare
        </Button>
      )}
    </>
  );
};

export default NotificationButtons;
