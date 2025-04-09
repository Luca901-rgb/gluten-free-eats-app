
import React from 'react';
import { Booking } from '@/context/BookingContext';
import BookingItem from './BookingItem';

interface BookingListProps {
  bookings: Booking[];
  unreadBookings: string[];
  attendanceBookings: Booking[];
  onConfirmBooking: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onConfirmAttendance: (id: string) => void;
  onNoShow: (id: string) => void;
}

const BookingList = ({
  bookings,
  unreadBookings,
  attendanceBookings,
  onConfirmBooking,
  onCancelBooking,
  onConfirmAttendance,
  onNoShow
}: BookingListProps) => {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-gray-500 text-sm">Nessuna prenotazione per questa data</p>
      </div>
    );
  }

  return (
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
  );
};

export default BookingList;
