
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Menu, Image, Video, Calendar, Star, Home, MapPin } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StarRating from '@/components/common/StarRating';
import { sampleRestaurant } from '@/data/sampleRestaurant';

// Tipo per le sezioni dei contenuti
type ContentSection = 'home' | 'menu' | 'gallery' | 'videos' | 'bookings' | 'reviews';

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContentSection>('home');
  const [restaurant, setRestaurant] = useState(sampleRestaurant);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!id) return;
      
      try {
        const restaurantDoc = await getDoc(doc(db, "restaurants", id));
        
        if (restaurantDoc.exists()) {
          const data = restaurantDoc.data();
          setRestaurant({
            id: restaurantDoc.id,
            name: data.name || sampleRestaurant.name,
            address: data.address || sampleRestaurant.address,
            cuisine: data.cuisine || sampleRestaurant.cuisine,
            description: data.description || sampleRestaurant.description,
            distance: data.distance || sampleRestaurant.distance,
            distanceValue: data.distanceValue || sampleRestaurant.distanceValue,
            hasGlutenFreeOptions: data.hasGlutenFreeOptions || sampleRestaurant.hasGlutenFreeOptions,
            image: data.coverImage || sampleRestaurant.image,
            location: data.location || sampleRestaurant.location,
            rating: typeof data.rating === 'number' ? data.rating : sampleRestaurant.rating,
            reviews: typeof data.reviewCount === 'number' ? data.reviewCount : sampleRestaurant.reviews
          });
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [id]);
  
  const tabs = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'menu', label: 'Menu', icon: <Menu size={18} /> },
    { id: 'gallery', label: 'Galleria', icon: <Image size={18} /> },
    { id: 'videos', label: 'Videoricette', icon: <Video size={18} /> },
    { id: 'bookings', label: 'Prenotazioni', icon: <Calendar size={18} /> },
    { id: 'reviews', label: 'Recensioni', icon: <Star size={18} /> },
  ];
  
  return (
    <Layout>
      <div className="pb-20">
        {/* Header image */}
        <div className="relative h-64">
          <img 
            src={restaurant.image || "/lovable-uploads/72ce3268-fe10-45d6-9c12-aecfe184f7ed.png"} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
            <div className="text-white">
              <h1 className="font-bold text-2xl mb-1">{restaurant.name}</h1>
              <div className="flex items-center mb-1">
                <StarRating rating={restaurant.rating} className="mr-2" />
                <span className="text-sm">{restaurant.reviews} recensioni</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin size={14} className="mr-1" />
                <span>{restaurant.address}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="restaurant-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`restaurant-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as ContentSection)}
            >
              <div className="flex items-center gap-1">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Content section */}
        <div className="p-4">
          {activeTab === 'home' && (
            <div className="text-left">
              <h2 className="text-xl font-bold mb-4">Informazioni</h2>
              <p className="text-gray-700 mb-6">
                {restaurant.description || "Ristorante 100% gluten free specializzato in cucina campana tradizionale. Il nostro locale è certificato dall'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine. Dal pane alla pasta, dalle pizze ai dolci, offriamo un'esperienza gastronomica completa senza compromessi sul gusto."}
              </p>
              
              <h3 className="text-lg font-bold mb-2">Orari di apertura</h3>
              <div className="mb-6">
                <div className="flex justify-between py-1 border-b">
                  <span>Lunedì</span>
                  <span>Chiuso</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Martedì-Venerdì</span>
                  <span>12:00-14:30, 19:00-22:30</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Sabato</span>
                  <span>12:00-15:00, 19:00-23:00</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>Domenica</span>
                  <span>12:00-15:00, 19:00-22:00</span>
                </div>
              </div>
              
              <button
                className="w-full py-3 bg-green-default text-white font-bold rounded-lg flex items-center justify-center"
                onClick={() => setActiveTab('bookings')}
              >
                <Calendar className="mr-2" size={20} />
                Prenota un tavolo
              </button>
            </div>
          )}
          
          {activeTab === 'menu' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-left">La Trattoria Senza Glutine - Menu</h2>
              
              <div className="flex border-b space-x-4 mb-4 overflow-x-auto">
                <button className="py-2 px-4 border-b-2 border-green-default font-bold">Antipasti</button>
                <button className="py-2 px-4">Primi</button>
                <button className="py-2 px-4">Secondi</button>
                <button className="py-2 px-4">Pizze</button>
                <button className="py-2 px-4">Dolci</button>
              </div>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-1 text-left">
                    <div>
                      <h3 className="font-bold">Bruschetta ai pomodorini</h3>
                      <span className="text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Popolare</span>
                    </div>
                    <span className="font-bold">€8,50</span>
                  </div>
                  <p className="text-gray-600 text-sm text-left">Pane senza glutine tostato con pomodorini freschi, basilico e aglio</p>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-1 text-left">
                    <h3 className="font-bold">Tagliere misto</h3>
                    <span className="font-bold">€14,00</span>
                  </div>
                  <p className="text-gray-600 text-sm text-left">Selezione di salumi e formaggi senza glutine con marmellate</p>
                </div>
              </div>
              
              <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-start">
                  <div className="mr-2 mt-1">📝</div>
                  <div className="text-left">
                    <h3 className="font-bold text-amber-800">Nota importante</h3>
                    <p className="text-sm text-amber-700">Tutti i piatti di questo menu sono preparati in una cucina 100% senza glutine. Il ristorante è certificato dall'Associazione Italiana Celiachia.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'gallery' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-left">Galleria Fotografica</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          )}
          
          {activeTab === 'videos' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-left">Videoricette</h2>
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <Video size={48} className="text-gray-400" />
                  </div>
                  <div className="p-3 text-left">
                    <h3 className="font-bold">Come preparare la pasta senza glutine</h3>
                    <p className="text-sm text-gray-600">Tutti i segreti per una pasta senza glutine perfetta.</p>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <Video size={48} className="text-gray-400" />
                  </div>
                  <div className="p-3 text-left">
                    <h3 className="font-bold">Pizza senza glutine fatta in casa</h3>
                    <p className="text-sm text-gray-600">Ricetta per una pizza croccante e gustosa completamente gluten-free.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-left">Prenota un tavolo presso {restaurant.name}</h2>
              <p className="text-gray-600 mb-6 text-left">Compila il form per prenotare il tuo tavolo</p>
              
              <form className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="block font-medium">Data</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Seleziona data" 
                      className="w-full p-3 border rounded-lg"
                      readOnly
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
                
                <div className="space-y-2 text-left">
                  <label className="block font-medium">Orario</label>
                  <select className="w-full p-3 border rounded-lg">
                    <option value="">Seleziona orario</option>
                    <option value="19:00">19:00</option>
                    <option value="19:30">19:30</option>
                    <option value="20:00">20:00</option>
                    <option value="20:30">20:30</option>
                    <option value="21:00">21:00</option>
                  </select>
                </div>
                
                <div className="space-y-2 text-left">
                  <label className="block font-medium">Numero di persone</label>
                  <div className="flex items-center justify-between">
                    <span>2</span>
                    <input type="range" min="1" max="10" className="w-full mx-2" defaultValue="2" />
                    <span>10</span>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="w-full py-3 bg-green-default text-white font-bold rounded-lg"
                >
                  Conferma prenotazione
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-left">Recensioni</h2>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <StarRating rating={restaurant.rating} className="mr-2" />
                  <span className="font-bold">{restaurant.rating}</span>
                </div>
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {restaurant.reviews} recensioni
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold">Mario Rossi</h3>
                    <StarRating rating={5} size="sm" />
                  </div>
                  <p className="text-gray-600 text-sm text-left">Ristorante fantastico! Finalmente posso mangiare pizza senza preoccupazioni. Personale molto cordiale e attento.</p>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold">Lucia Bianchi</h3>
                    <StarRating rating={4} size="sm" />
                  </div>
                  <p className="text-gray-600 text-sm text-left">Buon ristorante, cibo molto buono e ambiente accogliente. Il menù è vario e ci sono molte opzioni.</p>
                </div>
                
                <button className="w-full py-3 border border-green-default text-green-default font-bold rounded-lg">
                  Lascia una recensione
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantPage;
