
import React from 'react';
import { Calendar } from 'lucide-react';
import { Booking } from '@/context/BookingContext';
import BookingItem from './BookingItem';

interface BookingsByDateProps {
  date: string;
  bookings: Booking[];
  unreadBookings: string[];
  attendanceBookings: Booking[];
  onConfirmBooking: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onConfirmAttendance: (id: string) => void;
  onNoShow: (id: string) => void;
}

const BookingsByDate = ({
  date,
  bookings,
  unreadBookings,
  attendanceBookings,
  onConfirmBooking,
  onCancelBooking,
  onConfirmAttendance,
  onNoShow
}: BookingsByDateProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3 flex items-center">
        <Calendar className="mr-2 h-5 w-5" />
        {new Date(date).toLocaleDateString('it-IT', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </h2>
      
      <div className="space-y-3">
        {bookings.map((booking) => (
          <BookingItem
            key={booking.id}
            booking={booking}
            isUnread={unreadBookings.includes(booking.id)}
            isAttendancePending={attendanceBookings.some(b => b.id === booking.id)}
            onConfirmBooking={onConfirmBooking}
            onCancelBooking={onCancelBooking}
            onConfirmAttendance={onConfirmAttendance}
            onNoShow={onNoShow}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingsByDate;
