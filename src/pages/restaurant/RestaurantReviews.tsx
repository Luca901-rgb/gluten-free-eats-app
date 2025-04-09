
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ThumbsUp, PenLine } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import ReviewForm from '@/components/Restaurant/ReviewForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RestaurantReviews = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bookingCode = searchParams.get('bookingCode');
  const restaurantCode = searchParams.get('restaurantCode');
  
  // Determine which tab to show initially
  const [activeTab, setActiveTab] = useState<string>(bookingCode && restaurantCode ? 'write' : 'read');
  
  // Mock reviews data
  const [reviews, setReviews] = React.useState([
    {
      id: 1,
      userName: 'Mario Rossi',
      rating: 5,
      date: '2023-08-15',
      comment: 'Ottimo ristorante senza glutine, finalmente ho potuto gustare una pizza davvero buona senza preoccuparmi!',
      replied: false,
      reply: ''
    },
    {
      id: 2,
      userName: 'Giulia Bianchi',
      rating: 4,
      date: '2023-08-10',
      comment: 'Ambiente accogliente e personale molto attento alle esigenze dei celiaci. Menu vario e gustoso.',
      replied: true,
      reply: 'Grazie mille per la tua recensione positiva, Giulia! Siamo felici che ti sia trovata bene nel nostro ristorante.'
    },
    {
      id: 3,
      userName: 'Paolo Verdi',
      rating: 3,
      date: '2023-08-05',
      comment: 'Cibo buono ma tempi di attesa un po\' lunghi. Comunque apprezzo l\'attenzione per i celiaci.',
      replied: false,
      reply: ''
    }
  ]);

  const [replyText, setReplyText] = React.useState<Record<number, string>>({});

  // Show toast notification if we have codes in URL params
  useEffect(() => {
    if (bookingCode && restaurantCode) {
      toast.info(
        <div>
          <p className="font-medium">Codici di recensione rilevati</p>
          <p className="text-sm">I codici dalla tua prenotazione sono stati inseriti automaticamente</p>
        </div>,
        { duration: 5000 }
      );
    }
  }, [bookingCode, restaurantCode]);

  const handleReply = (id: number) => {
    if (replyText[id]?.trim()) {
      setReviews(reviews.map(review => 
        review.id === id ? {...review, replied: true, reply: replyText[id]} : review
      ));
      setReplyText({...replyText, [id]: ''});
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  const handleReviewSuccess = () => {
    setActiveTab('read');
    toast.success('Recensione pubblicata con successo!');
    // In a real app, we would fetch the updated reviews here
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Recensioni</h1>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="read">Leggi recensioni</TabsTrigger>
          <TabsTrigger value="write" className="flex items-center">
            <PenLine className="w-4 h-4 mr-2" />
            Scrivi recensione
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="read">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Valutazione media</h2>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                  <div className="flex">{renderStars(Math.round(averageRating))}</div>
                  <span className="ml-2 text-sm text-gray-500">({reviews.length} recensioni)</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Tasso di risposta</p>
                <p className="font-medium">{Math.round((reviews.filter(r => r.replied).length / reviews.length) * 100)}%</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{review.userName}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('it-IT')}
                  </span>
                </div>
                
                <div className="flex my-2">{renderStars(review.rating)}</div>
                
                <p className="text-gray-700">{review.comment}</p>
                
                {review.replied && (
                  <div className="mt-4 pl-4 border-l-2 border-primary">
                    <div className="flex items-center text-sm text-primary font-medium mb-1">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      La tua risposta
                    </div>
                    <p className="text-gray-700">{review.reply}</p>
                  </div>
                )}
                
                {!review.replied && (
                  <div className="mt-4">
                    <div className="flex items-center text-sm font-medium mb-2">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Rispondi alla recensione
                    </div>
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[100px] mb-2"
                      placeholder="Scrivi una risposta..."
                      value={replyText[review.id] || ''}
                      onChange={(e) => setReplyText({...replyText, [review.id]: e.target.value})}
                    ></textarea>
                    <Button 
                      className="flex items-center text-sm"
                      onClick={() => handleReply(review.id)}
                      disabled={!replyText[review.id]?.trim()}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Pubblica risposta
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="write">
          <ReviewForm 
            restaurantId="1"
            restaurantName="La Trattoria Senza Glutine"
            bookingCode={bookingCode || ""}
            restaurantCode={restaurantCode || ""}
            onSubmitSuccess={handleReviewSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantReviews;
