
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, Upload, Download, Plus, Edit, Trash2 } from "lucide-react";

interface MenuItem {
  name: string;
  description: string;
  price: number;
  glutenFree: boolean;
  image?: string;
  popular?: boolean;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

// Dati di esempio per il menu
const sampleMenuItems: MenuCategory[] = [
  {
    category: "Antipasti",
    items: [
      {
        name: "Bruschetta",
        description: "Pane tostato con pomodorini, basilico e olio d'oliva",
        price: 6.50,
        glutenFree: false
      },
      {
        name: "Caprese",
        description: "Mozzarella di bufala, pomodoro e basilico",
        price: 8.50,
        glutenFree: true,
        popular: true
      }
    ]
  },
  {
    category: "Primi",
    items: [
      {
        name: "Spaghetti alla Carbonara",
        description: "Spaghetti con uova, guanciale, pecorino e pepe",
        price: 12.00,
        glutenFree: false,
        popular: true
      },
      {
        name: "Risotto ai Funghi",
        description: "Risotto con funghi porcini e parmigiano",
        price: 14.00,
        glutenFree: true
      }
    ]
  },
  {
    category: "Secondi",
    items: [
      {
        name: "Tagliata di Manzo",
        description: "Tagliata di manzo con rucola e grana",
        price: 18.00,
        glutenFree: true,
        popular: true
      },
      {
        name: "Branzino al Forno",
        description: "Branzino al forno con patate e olive",
        price: 16.00,
        glutenFree: true
      }
    ]
  },
  {
    category: "Dolci",
    items: [
      {
        name: "Tiramisù",
        description: "Dolce tradizionale al caffè e mascarpone",
        price: 6.00,
        glutenFree: false
      },
      {
        name: "Panna Cotta",
        description: "Panna cotta con coulis di frutti di bosco",
        price: 5.50,
        glutenFree: true,
        popular: true
      }
    ]
  }
];

interface MenuViewerProps {
  isRestaurantOwner?: boolean;
}

const MenuViewer: React.FC<MenuViewerProps> = ({ isRestaurantOwner = false }) => {
  const [menuItems, setMenuItems] = useState<MenuCategory[]>(sampleMenuItems);
  const [activeTab, setActiveTab] = useState("menu-interactive");

  // Carica il menu dal localStorage se disponibile
  React.useEffect(() => {
    try {
      const registrationData = localStorage.getItem('restaurantRegistrationData');
      if (registrationData) {
        const parsed = JSON.parse(registrationData);
        if (parsed.content?.menuItems && Array.isArray(parsed.content.menuItems)) {
          setMenuItems(parsed.content.menuItems);
        }
      }
    } catch (error) {
      console.error("Errore nel caricamento del menu:", error);
    }
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-poppins font-semibold text-lg flex items-center">
          <Menu className="mr-2 h-5 w-5 text-green-600" />
          Menu del Ristorante
        </h2>
        
        {isRestaurantOwner && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Carica PDF</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Esporta</span>
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Aggiungi Piatto</span>
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="menu-interactive" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="menu-interactive">Menu Interattivo</TabsTrigger>
          <TabsTrigger value="menu-pdf">Menu PDF</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu-interactive" className="mt-4 space-y-6">
          {menuItems.length > 0 ? (
            menuItems.map((category, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="bg-green-50 p-3 border-b">
                  <h3 className="font-medium text-green-800">{category.category}</h3>
                </div>
                <CardContent className="p-0">
                  {category.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx}
                      className={`p-4 border-b last:border-0 flex justify-between items-start ${item.glutenFree ? 'relative' : ''}`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.popular && (
                            <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded">
                              Popolare
                            </span>
                          )}
                          {item.glutenFree && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                              Senza Glutine
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="font-medium">€{item.price.toFixed(2)}</span>
                        
                        {isRestaurantOwner && (
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <Menu className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Nessun piatto disponibile</h3>
              <p className="text-gray-500 mt-1">Non sono stati ancora aggiunti piatti al menu</p>
              
              {isRestaurantOwner && (
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Aggiungi il primo piatto
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="menu-pdf" className="mt-4">
          <Card className="p-6 text-center">
            <div className="py-12 border-2 border-dashed rounded-lg bg-gray-50">
              <Download className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Menu PDF non disponibile</h3>
              <p className="text-gray-500 mt-1">Non è stato ancora caricato un menu in formato PDF</p>
              
              {isRestaurantOwner && (
                <Button className="mt-4">
                  <Upload className="mr-2 h-4 w-4" />
                  Carica Menu PDF
                </Button>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuViewer;
