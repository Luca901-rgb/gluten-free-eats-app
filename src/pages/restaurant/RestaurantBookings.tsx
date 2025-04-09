
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurantBookings } from '@/hooks/useRestaurantBookings';
import BookingsByDate from '@/components/Bookings/BookingsByDate';
import NotificationDialog from '@/components/Bookings/NotificationDialog';
import AttendanceDialog from '@/components/Bookings/AttendanceDialog';
import ReviewCodeDialog from '@/components/Bookings/ReviewCodeDialog';
import NotificationButtons from '@/components/Bookings/NotificationButtons';

const RestaurantBookings = () => {
  const navigate = useNavigate();
  const restaurantId = '1';
  
  const {
    bookingsByDate,
    unreadBookings,
    attendanceBookings,
    notificationBookings,
    showNotificationDialog,
    setShowNotificationDialog,
    showAttendanceDialog,
    setShowAttendanceDialog,
    showReviewCodeDialog,
    setShowReviewCodeDialog,
    currentBookingId,
    generatedReviewCode,
    handleConfirmBooking,
    handleCancelBooking,
    handleConfirmAttendance,
    handleNoShow,
    handleCopyCode,
    allBookings
  } = useRestaurantBookings(restaurantId);

  const redirectToReviews = () => {
    const currentBooking = allBookings.find(b => b.id === currentBookingId);
    if (currentBooking) {
      setShowReviewCodeDialog(false);
      navigate(`/restaurant/${restaurantId}?tab=reviews&bookingCode=${currentBooking.bookingCode}&restaurantCode=${generatedReviewCode}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Prenotazioni</h1>
      
      <NotificationButtons 
        unreadBookings={unreadBookings}
        attendanceBookings={attendanceBookings}
        onShowNotifications={() => setShowNotificationDialog(true)}
        onShowAttendance={() => setShowAttendanceDialog(true)}
      />
      
      {Object.entries(bookingsByDate).map(([date, dateBookings]) => (
        <BookingsByDate
          key={date}
          date={date}
          bookings={dateBookings}
          unreadBookings={unreadBookings}
          attendanceBookings={attendanceBookings}
          onConfirmBooking={handleConfirmBooking}
          onCancelBooking={handleCancelBooking}
          onConfirmAttendance={handleConfirmAttendance}
          onNoShow={handleNoShow}
        />
      ))}
      
      {Object.keys(bookingsByDate).length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nessuna prenotazione disponibile</p>
        </div>
      )}
      
      <NotificationDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
        bookings={notificationBookings}
        onConfirmBooking={handleConfirmBooking}
      />
      
      <AttendanceDialog
        open={showAttendanceDialog}
        onOpenChange={setShowAttendanceDialog}
        bookings={attendanceBookings}
        onConfirmAttendance={handleConfirmAttendance}
        onNoShow={handleNoShow}
      />
      
      <ReviewCodeDialog
        open={showReviewCodeDialog}
        onOpenChange={setShowReviewCodeDialog}
        reviewCode={generatedReviewCode}
        onCopyCode={handleCopyCode}
        onViewReviews={redirectToReviews}
      />
    </div>
  );
};

export default RestaurantBookings;
