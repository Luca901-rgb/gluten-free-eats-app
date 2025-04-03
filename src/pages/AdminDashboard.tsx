
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAdmin } from '@/context/AdminContext';
import Layout from '@/components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  BarChart as BarChartIcon,
  CreditCard,
  Activity,
  Settings,
  LogOut,
  FileText,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { logoutUser } from '@/lib/firebase';

const AdminDashboard = () => {
  const { 
    isAdmin, 
    bookingStats, 
    loadBookingStats, 
    payments, 
    loadPayments, 
    appIssues, 
    loadAppIssues, 
    resolveIssue 
  } = useAdmin();
  
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se l'utente è admin, altrimenti reindirizza
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    // Carica i dati iniziali
    loadBookingStats();
    loadPayments();
    loadAppIssues();
  }, [isAdmin, navigate, loadBookingStats, loadPayments, loadAppIssues]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('isAdmin');
      navigate('/admin-login');
      toast.success('Logout effettuato con successo');
    } catch (error: any) {
      toast.error(`Errore durante il logout: ${error.message}`);
    }
  };

  // Prepara i dati per il grafico dei ristoranti top
  const restaurantChartData = bookingStats?.topRestaurants.map(restaurant => ({
    name: restaurant.restaurantName.substring(0, 15) + (restaurant.restaurantName.length > 15 ? '...' : ''),
    prenotazioni: restaurant.bookingsCount
  })) || [];

  return (
    <Layout hideNavigation>
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Dashboard Amministratore</h1>
              <Badge className="bg-primary">Admin</Badge>
            </div>
            <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="statistics" className="space-y-4">
            <TabsList className="grid grid-cols-4 gap-4 sm:flex">
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChartIcon size={16} />
                <span>Statistiche</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard size={16} />
                <span>Pagamenti</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Prenotazioni</span>
              </TabsTrigger>
              <TabsTrigger value="issues" className="flex items-center gap-2">
                <Activity size={16} />
                <span>Problematiche</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="statistics">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Prenotazioni Totali</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bookingStats?.totalBookings || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +2.1% rispetto al mese scorso
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Prenotazioni Mensili</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bookingStats?.monthlyBookings || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% rispetto al mese scorso
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Coperti Totali</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bookingStats?.totalCovers || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      €{bookingStats?.coverRevenue || 0} di fatturato coperti
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">No-Show</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bookingStats?.noShowCount || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {bookingStats?.totalBookings 
                        ? ((bookingStats.noShowCount / bookingStats.totalBookings) * 100).toFixed(1) 
                        : 0}% del totale prenotazioni
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ristoranti con più prenotazioni</CardTitle>
                    <CardDescription>Analisi dei ristoranti più popolari sulla piattaforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={restaurantChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="prenotazioni" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Gestione Pagamenti</CardTitle>
                  <CardDescription>
                    Gestisci i pagamenti dei coperti e i no-show
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Ristorante</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Importo</TableHead>
                        <TableHead>Stato</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono">{payment.id}</TableCell>
                          <TableCell>{payment.restaurantName}</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString('it-IT')}</TableCell>
                          <TableCell>
                            <Badge className={payment.type === 'cover' ? 'bg-blue-500' : 'bg-orange-500'}>
                              {payment.type === 'cover' ? 'Coperti' : 'No-Show'}
                            </Badge>
                          </TableCell>
                          <TableCell>€{payment.amount}</TableCell>
                          <TableCell>
                            <Badge className={payment.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                              {payment.status === 'completed' ? 'Completato' : 'In attesa'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button onClick={loadPayments} className="ml-auto">
                    Aggiorna dati
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Sistema di Prenotazioni e Garanzia</CardTitle>
                  <CardDescription>
                    Gestione delle condizioni di prenotazione e pagamenti garanzia
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                    <h3 className="text-amber-800 font-medium mb-2">Regole di garanzia prenotazioni</h3>
                    <ul className="list-disc list-inside space-y-1 text-amber-700">
                      <li>€10 per prenotazioni fino a 9 persone</li>
                      <li>€20 per prenotazioni da 10 persone in su</li>
                      <li>Addebito solo in caso di no-show non comunicato</li>
                      <li>Cancellazione gratuita fino a 2 ore prima</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-blue-800 font-medium mb-2">Gestione coperti</h3>
                    <p className="text-blue-700">
                      Ogni ristorante paga €2 per persona prenotata. Il pagamento viene elaborato mensilmente
                      in base ai coperti confermati.
                    </p>
                  </div>
                  
                  <Button className="mt-4">
                    Configura impostazioni di pagamento
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <CardTitle>Problematiche dell'applicazione</CardTitle>
                  <CardDescription>
                    Gestisci i problemi riscontrati dagli utenti
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appIssues.length === 0 ? (
                    <p className="text-center p-4 text-gray-500">Nessun problema da risolvere</p>
                  ) : (
                    <div className="space-y-4">
                      {appIssues.map((issue) => (
                        <div key={issue.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{issue.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                            </div>
                            <Badge className={issue.status === 'open' ? 'bg-red-500' : 'bg-green-500'}>
                              {issue.status === 'open' ? 'Aperto' : 'Risolto'}
                            </Badge>
                          </div>
                          {issue.status === 'open' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => resolveIssue(issue.id)}
                            >
                              Segna come risolto
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={loadAppIssues} className="ml-auto">
                    Aggiorna problemi
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
