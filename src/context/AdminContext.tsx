
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

// Definizione dei tipi per le statistiche delle prenotazioni
interface BookingStats {
  totalBookings: number;
  monthlyBookings: number;
  yearlyBookings: number;
  topRestaurants: {
    restaurantId: string;
    restaurantName: string;
    bookingsCount: number;
  }[];
  noShowCount: number;
  totalCovers: number;
  coverRevenue: number;
}

// Definizione dei tipi per i pagamenti
interface Payment {
  id: string;
  restaurantId: string;
  restaurantName: string;
  amount: number;
  date: string;
  type: 'cover' | 'noshow' | 'other';
  status: 'pending' | 'completed';
}

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  bookingStats: BookingStats | null;
  loadBookingStats: () => void;
  payments: Payment[];
  loadPayments: () => void;
  appIssues: {id: string, title: string, description: string, status: 'open' | 'resolved'}[];
  loadAppIssues: () => void;
  resolveIssue: (id: string) => void;
}

// Valori di default
const defaultBookingStats: BookingStats = {
  totalBookings: 0,
  monthlyBookings: 0,
  yearlyBookings: 0,
  topRestaurants: [],
  noShowCount: 0,
  totalCovers: 0,
  coverRevenue: 0
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appIssues, setAppIssues] = useState<{id: string, title: string, description: string, status: 'open' | 'resolved'}[]>([]);

  // Verificare se l'utente è admin al caricamento
  useEffect(() => {
    const checkAdminStatus = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Verifica se l'email è nell'elenco degli admin o se è stato impostato come admin nel localStorage
          const adminEmail = localStorage.getItem('adminEmail');
          
          if (user.email === 'admin@glutenfreeeats.com' || user.email === adminEmail) {
            setIsAdmin(true);
            localStorage.setItem('isAdmin', 'true');
            if (!adminEmail && user.email) {
              localStorage.setItem('adminEmail', user.email);
            }
          } else {
            setIsAdmin(false);
            localStorage.removeItem('isAdmin');
          }
        } else {
          setIsAdmin(false);
          localStorage.removeItem('isAdmin');
        }
      });
    };

    // Verifica se è già stato impostato come admin nel localStorage
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }

    checkAdminStatus();
  }, []);

  // Funzione per caricare le statistiche delle prenotazioni
  const loadBookingStats = () => {
    // In un'app reale, questa funzione dovrebbe fare una chiamata API
    // Qui simuliamo i dati per la demo
    setTimeout(() => {
      setBookingStats({
        totalBookings: 482,
        monthlyBookings: 87,
        yearlyBookings: 1254,
        topRestaurants: [
          {
            restaurantId: '1',
            restaurantName: 'La Trattoria Senza Glutine',
            bookingsCount: 124
          },
          {
            restaurantId: '2',
            restaurantName: 'Pizzeria Gluten Free',
            bookingsCount: 98
          },
          {
            restaurantId: '3', 
            restaurantName: 'Bio & Gluten Free',
            bookingsCount: 56
          }
        ],
        noShowCount: 18,
        totalCovers: 964,
        coverRevenue: 1928 // €2 a persona
      });
      toast.success("Statistiche aggiornate");
    }, 800);
  };

  // Funzione per caricare i pagamenti
  const loadPayments = () => {
    // Simuliamo i dati dei pagamenti
    setTimeout(() => {
      setPayments([
        {
          id: 'pay_1',
          restaurantId: '1',
          restaurantName: 'La Trattoria Senza Glutine',
          amount: 248,
          date: '2023-11-01T12:00:00',
          type: 'cover',
          status: 'completed'
        },
        {
          id: 'pay_2',
          restaurantId: '2',
          restaurantName: 'Pizzeria Gluten Free',
          amount: 196,
          date: '2023-11-02T14:30:00',
          type: 'cover',
          status: 'completed'
        },
        {
          id: 'pay_3',
          restaurantId: '3',
          restaurantName: 'Bio & Gluten Free',
          amount: 112,
          date: '2023-11-03T10:15:00',
          type: 'cover',
          status: 'pending'
        },
        {
          id: 'pay_4',
          restaurantId: '1',
          restaurantName: 'La Trattoria Senza Glutine',
          amount: 20,
          date: '2023-11-05T18:45:00',
          type: 'noshow',
          status: 'completed'
        }
      ]);
      toast.success("Dati pagamenti caricati");
    }, 800);
  };

  // Funzione per caricare i problemi dell'app
  const loadAppIssues = () => {
    // Simuliamo i dati dei problemi
    setTimeout(() => {
      setAppIssues([
        {
          id: 'issue_1',
          title: 'Problemi di login',
          description: 'Alcuni utenti riportano difficoltà nel login con Google',
          status: 'open'
        },
        {
          id: 'issue_2',
          title: 'Errore prenotazione',
          description: 'Le prenotazioni non vengono salvate correttamente per alcuni ristoranti',
          status: 'open'
        },
        {
          id: 'issue_3',
          title: 'Recensioni non visibili',
          description: 'Le recensioni non vengono visualizzate nella pagina del ristorante',
          status: 'resolved'
        }
      ]);
      toast.success("Problematiche app caricate");
    }, 800);
  };

  // Funzione per risolvere un problema
  const resolveIssue = (id: string) => {
    setAppIssues(appIssues.map(issue => 
      issue.id === id ? { ...issue, status: 'resolved' } : issue
    ));
    toast.success("Problema contrassegnato come risolto");
  };

  return (
    <AdminContext.Provider 
      value={{ 
        isAdmin, 
        setIsAdmin,
        bookingStats, 
        loadBookingStats,
        payments,
        loadPayments,
        appIssues,
        loadAppIssues,
        resolveIssue
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within a AdminProvider');
  }
  return context;
}
