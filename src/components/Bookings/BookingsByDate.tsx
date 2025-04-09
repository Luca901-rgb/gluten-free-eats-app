
import React from 'react';
import { Booking } from '@/context/BookingContext';
import DateHeader from './DateHeader';
import BookingList from './BookingList';

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
      <DateHeader date={date} />
      <BookingList 
        bookings={bookings}
        unreadBookings={unreadBookings}
        attendanceBookings={attendanceBookings}
        onConfirmBooking={onConfirmBooking}
        onCancelBooking={onCancelBooking}
        onConfirmAttendance={onConfirmAttendance}
        onNoShow={onNoShow}
      />
    </div>
  );
};

export default BookingsByDate;
