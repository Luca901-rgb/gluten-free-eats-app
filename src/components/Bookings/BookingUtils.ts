
export const checkAttendanceConfirmationNeeded = (bookings: any[]) => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
  
  // Filtra prenotazioni confermate con data di oltre un'ora fa ma senza conferma presenza
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return (
      booking.status === 'confirmed' && 
      booking.attendance === null && 
      bookingDate < oneHourAgo
    );
  });
};
