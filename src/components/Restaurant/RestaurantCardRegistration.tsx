
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Info, Store, Image, CalendarClock, Menu, Video, MapPin, Phone, Globe, Star, Upload, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardRegistrationProps {
  onComplete?: (success: boolean) => void;
}

interface MenuSection {
  title: string;
  items: {
    name: string;
    description: string;
    price: string;
    glutenFree: boolean;
  }[];
}

interface Gallery {
  url: string;
  caption: string;
  main: boolean;
}

interface Video {
  title: string;
  url: string;
  thumbnail?: string;
}

const RestaurantCardRegistration: React.FC<RestaurantCardRegistrationProps> = ({ 
  onComplete 
}) => {
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [coverImageUrl, setCoverImageUrl] = useState<string>('/placeholder.svg');
  
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    description: '',
    cuisine: '',
    priceRange: '',
    coverImage: '',
    hasGlutenFreeOptions: true,
    openingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    openingHours: {
      lunchStart: '12:00',
      lunchEnd: '15:00',
      dinnerStart: '19:00',
      dinnerEnd: '23:00'
    }
  });
  
  // Stato per il menu
  const [menuSections, setMenuSections] = useState<MenuSection[]>([
    {
      title: "Antipasti",
      items: [
        { name: "", description: "", price: "", glutenFree: true }
      ]
    },
    {
      title: "Primi",
      items: [
        { name: "", description: "", price: "", glutenFree: true }
      ]
    }
  ]);
  
  // Stato per la galleria
  const [gallery, setGallery] = useState<Gallery[]>([
    { url: "/placeholder.svg", caption: "Immagine del locale", main: true }
  ]);
  
  // Stato per i video
  const [videos, setVideos] = useState<Video[]>([
    { title: "", url: "", thumbnail: "" }
  ]);
  
  // Stato per la certificazione
  const [certification, setCertification] = useState({
    type: "",
    number: "",
    date: "",
    expires: "",
    hasGlutenFreeCertification: false,
    hasDedicatedKitchen: false,
    hasTrainedStaff: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setRestaurantData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setRestaurantData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setRestaurantData(prev => ({
      ...prev,
      openingDays: {
        ...prev.openingDays,
        [day]: checked
      }
    }));
  };

  const handleHoursChange = (timeSlot: string, value: string) => {
    setRestaurantData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [timeSlot]: value
      }
    }));
  };
  
  const handleAddMenuItem = (sectionIndex: number) => {
    const updatedSections = [...menuSections];
    updatedSections[sectionIndex].items.push({
      name: "",
      description: "",
      price: "",
      glutenFree: true
    });
    setMenuSections(updatedSections);
  };
  
  const handleRemoveMenuItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = [...menuSections];
    updatedSections[sectionIndex].items.splice(itemIndex, 1);
    setMenuSections(updatedSections);
  };
  
  const handleMenuItemChange = (sectionIndex: number, itemIndex: number, field: string, value: string | boolean) => {
    const updatedSections = [...menuSections];
    updatedSections[sectionIndex].items[itemIndex] = {
      ...updatedSections[sectionIndex].items[itemIndex],
      [field]: value
    };
    setMenuSections(updatedSections);
  };
  
  const handleAddMenuSection = () => {
    setMenuSections([
      ...menuSections,
      {
        title: "Nuova Sezione",
        items: [
          { name: "", description: "", price: "", glutenFree: true }
        ]
      }
    ]);
  };
  
  const handleMenuSectionTitleChange = (index: number, title: string) => {
    const updatedSections = [...menuSections];
    updatedSections[index].title = title;
    setMenuSections(updatedSections);
  };
  
  const handleAddGalleryItem = () => {
    setGallery([...gallery, { url: "/placeholder.svg", caption: "", main: false }]);
  };
  
  const handleGalleryItemChange = (index: number, field: string, value: string | boolean) => {
    const updatedGallery = [...gallery];
    updatedGallery[index] = {
      ...updatedGallery[index],
      [field]: value
    };
    setGallery(updatedGallery);
  };
  
  const handleAddVideo = () => {
    setVideos([...videos, { title: "", url: "", thumbnail: "" }]);
  };
  
  const handleVideoChange = (index: number, field: string, value: string) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      [field]: value
    };
    setVideos(updatedVideos);
  };
  
  const handleCertificationChange = (field: string, value: string | boolean) => {
    setCertification(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simuliamo un caricamento dell'immagine
      toast.info("Caricamento immagine in corso...");
      
      // Per simulare il caricamento, mostriamo solo un'anteprima locale
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImageUrl(reader.result);
          setRestaurantData(prev => ({
            ...prev,
            coverImage: reader.result as string
          }));
          toast.success("Immagine caricata con successo!");
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (!restaurantData.name || !restaurantData.address || !restaurantData.phone) {
      toast.error("Completa i campi obbligatori per continuare");
      return;
    }
    
    // Salva i dati in localStorage per il profilo del ristorante
    localStorage.setItem('restaurantName', restaurantData.name);
    localStorage.setItem('restaurantAddress', restaurantData.address);
    localStorage.setItem('restaurantPhone', restaurantData.phone);
    localStorage.setItem('restaurantDescription', restaurantData.description);
    localStorage.setItem('restaurantCuisine', restaurantData.cuisine);
    localStorage.setItem('restaurantWebsite', restaurantData.website);
    localStorage.setItem('restaurantCoverImage', coverImageUrl);
    localStorage.setItem('restaurantHasGlutenFree', restaurantData.hasGlutenFreeOptions.toString());
    localStorage.setItem('restaurantOpeningDays', JSON.stringify(restaurantData.openingDays));
    localStorage.setItem('restaurantOpeningHours', JSON.stringify(restaurantData.openingHours));
    localStorage.setItem('restaurantMenu', JSON.stringify(menuSections));
    localStorage.setItem('restaurantGallery', JSON.stringify(gallery));
    localStorage.setItem('restaurantVideos', JSON.stringify(videos));
    localStorage.setItem('restaurantCertification', JSON.stringify(certification));

    toast.success("Dati del ristorante salvati con successo");
    
    if (onComplete) {
      onComplete(true);
    }
  };
  
  const isLastTab = activeTab === "certification";
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Registrazione Ristorante
        </CardTitle>
        <CardDescription>
          Inserisci tutte le informazioni del tuo ristorante per completare la registrazione e renderlo visibile sulla piattaforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <ScrollArea className="w-full pb-2">
            <TabsList className="w-full">
              <TabsTrigger value="basic">Info Base</TabsTrigger>
              <TabsTrigger value="hours">Orari</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="media">Galleria & Video</TabsTrigger>
              <TabsTrigger value="certification">Certificazione</TabsTrigger>
            </TabsList>
          </ScrollArea>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 mb-6">
              <div className="bg-green-100 rounded-full p-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Adesione al programma confermata</p>
                <p className="text-sm text-green-600">
                  Completa i dati del tuo ristorante per essere visibile ai clienti.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Nome del ristorante *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={restaurantData.name}
                    onChange={handleChange}
                    placeholder="Il nome del tuo ristorante"
                    className="pl-10"
                    required
                  />
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-base">Indirizzo completo *</Label>
                <div className="relative">
                  <Input
                    id="address"
                    name="address"
                    value={restaurantData.address}
                    onChange={handleChange}
                    placeholder="Via, numero civico, città, CAP"
                    className="pl-10"
                    required
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">Telefono *</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    value={restaurantData.phone}
                    onChange={handleChange}
                    placeholder="+39 123 4567890"
                    className="pl-10"
                    required
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website" className="text-base">Sito web</Label>
                <div className="relative">
                  <Input
                    id="website"
                    name="website"
                    value={restaurantData.website}
                    onChange={handleChange}
                    placeholder="www.ristorantesenzaglutine.it"
                    className="pl-10"
                  />
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisine" className="text-base">Tipo di cucina</Label>
                  <Select value={restaurantData.cuisine} onValueChange={(value) => handleSelectChange('cuisine', value)}>
                    <SelectTrigger id="cuisine">
                      <SelectValue placeholder="Seleziona tipo di cucina" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italiana">Italiana</SelectItem>
                      <SelectItem value="pizzeria">Pizzeria</SelectItem>
                      <SelectItem value="trattoria">Trattoria</SelectItem>
                      <SelectItem value="pub">Pub</SelectItem>
                      <SelectItem value="panineria">Panineria</SelectItem>
                      <SelectItem value="internazionale">Internazionale</SelectItem>
                      <SelectItem value="fusion">Fusion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priceRange" className="text-base">Fascia di prezzo</Label>
                  <Select value={restaurantData.priceRange} onValueChange={(value) => handleSelectChange('priceRange', value)}>
                    <SelectTrigger id="priceRange">
                      <SelectValue placeholder="Seleziona fascia di prezzo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="€">€ - Economico</SelectItem>
                      <SelectItem value="€€">€€ - Nella media</SelectItem>
                      <SelectItem value="€€€">€€€ - Costoso</SelectItem>
                      <SelectItem value="€€€€">€€€€ - Lusso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">Descrizione del ristorante</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={restaurantData.description}
                  onChange={handleChange}
                  placeholder="Descrivi il tuo ristorante, la vostra storia, le specialità e i servizi offerti..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Immagine di copertina</Label>
                <div className="border rounded-md p-4 flex flex-col items-center">
                  <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                    <img 
                      src={coverImageUrl}
                      alt="Copertina ristorante" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={triggerFileInput}
                    className="flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Carica immagine
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Formato consigliato: JPG o PNG, min 1280x720px
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasGlutenFreeOptions"
                  name="hasGlutenFreeOptions"
                  checked={restaurantData.hasGlutenFreeOptions}
                  onCheckedChange={(checked) => setRestaurantData(prev => ({ ...prev, hasGlutenFreeOptions: !!checked }))}
                  disabled
                />
                <Label htmlFor="hasGlutenFreeOptions" className="cursor-pointer">
                  Offriamo un menu completamente senza glutine o con opzioni senza glutine
                </Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => setActiveTab("hours")}
                className="mt-4"
              >
                Continua
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="hours" className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Orari di apertura</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md">
                <div className="space-y-4">
                  <h4 className="font-medium">Giorni di apertura</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'monday', label: 'Lunedì' },
                      { id: 'tuesday', label: 'Martedì' },
                      { id: 'wednesday', label: 'Mercoledì' },
                      { id: 'thursday', label: 'Giovedì' },
                      { id: 'friday', label: 'Venerdì' },
                      { id: 'saturday', label: 'Sabato' },
                      { id: 'sunday', label: 'Domenica' }
                    ].map(day => (
                      <div className="flex items-center space-x-2" key={day.id}>
                        <Checkbox
                          id={day.id}
                          checked={restaurantData.openingDays[day.id as keyof typeof restaurantData.openingDays]}
                          onCheckedChange={(checked) => handleDayChange(day.id, !!checked)}
                        />
                        <Label htmlFor={day.id} className="cursor-pointer">{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Orari standard</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-500">Pranzo</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="lunchStart" className="text-xs">Dalle</Label>
                          <Input
                            id="lunchStart"
                            type="time"
                            value={restaurantData.openingHours.lunchStart}
                            onChange={(e) => handleHoursChange('lunchStart', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lunchEnd" className="text-xs">Alle</Label>
                          <Input
                            id="lunchEnd"
                            type="time"
                            value={restaurantData.openingHours.lunchEnd}
                            onChange={(e) => handleHoursChange('lunchEnd', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-500">Cena</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="dinnerStart" className="text-xs">Dalle</Label>
                          <Input
                            id="dinnerStart"
                            type="time"
                            value={restaurantData.openingHours.dinnerStart}
                            onChange={(e) => handleHoursChange('dinnerStart', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dinnerEnd" className="text-xs">Alle</Label>
                          <Input
                            id="dinnerEnd"
                            type="time"
                            value={restaurantData.openingHours.dinnerEnd}
                            onChange={(e) => handleHoursChange('dinnerEnd', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Nota: Potrai specificare orari diversi per giorni specifici nella dashboard ristorante</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("basic")}
              >
                Indietro
              </Button>
              <Button
                onClick={() => setActiveTab("menu")}
              >
                Continua
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="menu" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Menu className="mr-2 h-5 w-5" />
                  Menu Senza Glutine
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddMenuSection}
                >
                  Aggiungi sezione
                </Button>
              </div>
              
              {menuSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-md p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={section.title}
                      onChange={(e) => handleMenuSectionTitleChange(sectionIndex, e.target.value)}
                      className="font-medium"
                      placeholder="Nome sezione (es. Antipasti, Primi, ecc.)"
                    />
                  </div>
                  
                  <div className="space-y-4 mt-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-t pt-3 first:border-t-0 first:pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-[3fr,1fr] gap-3">
                          <div className="space-y-2">
                            <Input
                              value={item.name}
                              onChange={(e) => handleMenuItemChange(sectionIndex, itemIndex, 'name', e.target.value)}
                              placeholder="Nome piatto"
                            />
                            <Textarea
                              value={item.description}
                              onChange={(e) => handleMenuItemChange(sectionIndex, itemIndex, 'description', e.target.value)}
                              placeholder="Descrizione e ingredienti"
                              rows={2}
                              className="text-sm"
                            />
                          </div>
                          <div className="flex flex-col">
                            <Input
                              value={item.price}
                              onChange={(e) => handleMenuItemChange(sectionIndex, itemIndex, 'price', e.target.value)}
                              placeholder="Prezzo €"
                              className="mb-2"
                            />
                            <div className="flex items-center space-x-2 mt-auto">
                              <Checkbox
                                id={`gluten-free-${sectionIndex}-${itemIndex}`}
                                checked={item.glutenFree}
                                onCheckedChange={(checked) => handleMenuItemChange(sectionIndex, itemIndex, 'glutenFree', !!checked)}
                              />
                              <Label htmlFor={`gluten-free-${sectionIndex}-${itemIndex}`} className="text-xs cursor-pointer">
                                Senza glutine
                              </Label>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMenuItem(sectionIndex, itemIndex)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
                          disabled={section.items.length === 1}
                        >
                          Rimuovi
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddMenuItem(sectionIndex)}
                      className="w-full mt-2"
                    >
                      Aggiungi piatto
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("hours")}
              >
                Indietro
              </Button>
              <Button
                onClick={() => setActiveTab("media")}
              >
                Continua
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center">
                    <Image className="mr-2 h-5 w-5" />
                    Galleria Foto
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddGalleryItem}
                  >
                    Aggiungi foto
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map((item, index) => (
                    <div key={index} className="border rounded-md p-3 space-y-3">
                      <div className="w-full h-36 rounded-md overflow-hidden">
                        <img 
                          src={item.url} 
                          alt={item.caption} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Input
                        value={item.caption}
                        onChange={(e) => handleGalleryItemChange(index, 'caption', e.target.value)}
                        placeholder="Descrizione immagine"
                        className="text-sm"
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`main-photo-${index}`}
                          checked={item.main}
                          onCheckedChange={(checked) => {
                            // Se questa è selezionata come principale, deseleziona le altre
                            if (checked) {
                              const updatedGallery = gallery.map((g, i) => ({
                                ...g,
                                main: i === index
                              }));
                              setGallery(updatedGallery);
                            } else {
                              handleGalleryItemChange(index, 'main', false);
                            }
                          }}
                        />
                        <Label htmlFor={`main-photo-${index}`} className="text-xs cursor-pointer">
                          Immagine principale
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center">
                    <Video className="mr-2 h-5 w-5" />
                    Video
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddVideo}
                  >
                    Aggiungi video
                  </Button>
                </div>
                
                {videos.map((video, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-3">
                    <Input
                      value={video.title}
                      onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                      placeholder="Titolo del video"
                    />
                    <Input
                      value={video.url}
                      onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                      placeholder="URL del video (YouTube, Vimeo, ecc.)"
                    />
                    <p className="text-xs text-gray-500">
                      Inserisci un URL di YouTube o Vimeo, es: https://youtube.com/watch?v=XXXX
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("menu")}
              >
                Indietro
              </Button>
              <Button
                onClick={() => setActiveTab("certification")}
              >
                Continua
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="certification" className="space-y-6">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-amber-500 h-5 w-5" />
                <p className="text-sm text-amber-800">
                  Le certificazioni saranno verificate prima della pubblicazione del tuo ristorante
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certification-type">Tipo di certificazione</Label>
                  <Select 
                    value={certification.type} 
                    onValueChange={(value) => handleCertificationChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona certificazione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aic">AIC (Associazione Italiana Celiachia)</SelectItem>
                      <SelectItem value="afc">AFC (Associazione Italiana Celiachia)</SelectItem>
                      <SelectItem value="self">Auto-certificazione</SelectItem>
                      <SelectItem value="other">Altro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {certification.type && certification.type !== 'self' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cert-number">Numero certificazione</Label>
                      <Input
                        id="cert-number"
                        value={certification.number}
                        onChange={(e) => handleCertificationChange('number', e.target.value)}
                        placeholder="Es: AIC-123456"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cert-date">Data di rilascio</Label>
                        <Input
                          id="cert-date"
                          type="date"
                          value={certification.date}
                          onChange={(e) => handleCertificationChange('date', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cert-expires">Data di scadenza</Label>
                        <Input
                          id="cert-expires"
                          type="date"
                          value={certification.expires}
                          onChange={(e) => handleCertificationChange('expires', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium text-base">Requisiti senza glutine</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="dedicated-kitchen" 
                        checked={certification.hasDedicatedKitchen}
                        onCheckedChange={(checked) => handleCertificationChange('hasDedicatedKitchen', !!checked)}
                      />
                      <Label htmlFor="dedicated-kitchen">Abbiamo una cucina dedicata per la preparazione di cibi senza glutine</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="trained-staff" 
                        checked={certification.hasTrainedStaff}
                        onCheckedChange={(checked) => handleCertificationChange('hasTrainedStaff', !!checked)}
                      />
                      <Label htmlFor="trained-staff">Il nostro personale è formato sulla celiachia e sulla preparazione di cibi senza glutine</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <div className="flex items-start gap-3">
                  <Info className="text-blue-500 h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Processo di verifica</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Dopo la registrazione, il nostro team verificherà le informazioni fornite. 
                      Potremmo contattarti per ulteriori dettagli o documenti a supporto della certificazione.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("media")}
              >
                Indietro
              </Button>
              <Button
                onClick={handleContinue}
              >
                Completa registrazione
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {!isLastTab && (
          <div className="mt-6">
            <Separator className="my-4" />
            
            <Button 
              onClick={handleContinue}
              className="w-full"
              variant="outline"
            >
              Salva e continua più tardi
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCardRegistration;
