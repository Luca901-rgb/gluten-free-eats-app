
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

const RestaurantReviews = () => {
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Recensioni</h1>
        
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
      </div>
    </Layout>
  );
};

export default RestaurantReviews;
