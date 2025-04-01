
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, FileText, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  glutenFree: boolean;
  allergens?: string[];
  popular?: boolean;
}

interface MenuProps {
  restaurantName: string;
  menuPdfUrl?: string;
  menuItems: MenuItem[];
  categories: string[];
}

const sampleMenu: MenuProps = {
  restaurantName: "La Trattoria Senza Glutine",
  menuPdfUrl: "https://example.com/menu.pdf",
  categories: ["Antipasti", "Primi", "Secondi", "Pizze", "Dolci"],
  menuItems: [
    {
      id: "1",
      name: "Bruschetta ai pomodorini",
      description: "Pane senza glutine tostato con pomodorini freschi, basilico e aglio",
      price: "8,50",
      category: "Antipasti",
      glutenFree: true,
      popular: true
    },
    {
      id: "2",
      name: "Tagliere misto",
      description: "Selezione di salumi e formaggi senza glutine con marmellate",
      price: "14,00",
      category: "Antipasti",
      glutenFree: true,
      allergens: ["Latticini"]
    },
    {
      id: "3",
      name: "Spaghetti alla carbonara",
      description: "Pasta senza glutine con uovo, guanciale, pecorino e pepe",
      price: "13,00",
      category: "Primi",
      glutenFree: true,
      allergens: ["Uova", "Latticini"],
      popular: true
    },
    {
      id: "4",
      name: "Lasagna tradizionale",
      description: "Sfoglie di pasta senza glutine con ragù, besciamella e parmigiano",
      price: "13,50",
      category: "Primi",
      glutenFree: true,
      allergens: ["Latticini", "Uova"]
    },
    {
      id: "5",
      name: "Tagliata di manzo",
      description: "Controfiletto di manzo con rucola e scaglie di parmigiano",
      price: "18,00",
      category: "Secondi",
      glutenFree: true,
      allergens: ["Latticini"]
    },
    {
      id: "6",
      name: "Pizza Margherita",
      description: "Pomodoro, mozzarella e basilico su base senza glutine",
      price: "10,00",
      category: "Pizze",
      glutenFree: true,
      allergens: ["Latticini"],
      popular: true
    },
    {
      id: "7",
      name: "Pizza Quattro Formaggi",
      description: "Mozzarella, gorgonzola, taleggio e parmigiano su base senza glutine",
      price: "12,00",
      category: "Pizze",
      glutenFree: true,
      allergens: ["Latticini"]
    },
    {
      id: "8",
      name: "Tiramisù",
      description: "Dolce tradizionale con savoiardi senza glutine, mascarpone e caffè",
      price: "6,50",
      category: "Dolci",
      glutenFree: true,
      allergens: ["Latticini", "Uova"],
      popular: true
    }
  ]
};

const MenuViewer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(sampleMenu.categories[0]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleDownloadMenu = () => {
    toast.info('Download del menu in corso...');
    // In a real app, this would initiate a download
  };

  const filteredItems = sampleMenu.menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-poppins font-semibold text-lg">{sampleMenu.restaurantName} - Menu</h2>
        <Button variant="outline" size="sm" onClick={handleDownloadMenu} className="flex gap-1">
          <Download size={16} />
          <span className="hidden sm:inline">Scarica PDF</span>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Tabs defaultValue={sampleMenu.categories[0]} value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex w-full overflow-x-auto scrollbar-hide p-0 h-auto">
            {sampleMenu.categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex-1">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {sampleMenu.categories.map((category) => (
            <TabsContent key={category} value={category} className="p-0 m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Piatto</TableHead>
                    <TableHead className="w-[100px] text-right">Prezzo</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {item.name}
                            {item.popular && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                Popolare
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">€{item.price}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye size={16} />
                            </Button>
                          </DialogTrigger>
                          {selectedItem && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{selectedItem.name}</DialogTitle>
                                <DialogDescription>
                                  Dettagli del piatto e ingredienti
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4 space-y-4">
                                <p>{selectedItem.description}</p>
                                <div>
                                  <p className="text-sm font-medium">Prezzo</p>
                                  <p className="text-xl font-semibold">€{selectedItem.price}</p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Informazioni allergeni</p>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="bg-green-50 border-green-200">
                                      100% Senza Glutine
                                    </Badge>
                                    {selectedItem.allergens?.map((allergen) => (
                                      <Badge key={allergen} variant="outline">
                                        {allergen}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          )}
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="bg-secondary/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <FileText size={18} className="mt-0.5 text-primary" />
          <div>
            <h3 className="font-medium">Nota importante</h3>
            <p className="text-sm text-gray-600">
              Tutti i piatti di questo menu sono preparati in una cucina 100% senza glutine.
              Il ristorante è certificato dall'Associazione Italiana Celiachia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuViewer;
