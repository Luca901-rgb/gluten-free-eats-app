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
import { Eye, FileText, Download, Upload } from 'lucide-react';
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
import jsPDF from 'jspdf';

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

interface MenuViewerProps {
  isRestaurantOwner?: boolean;
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

const MenuViewer: React.FC<MenuViewerProps> = ({ isRestaurantOwner = false }) => {
  const [activeCategory, setActiveCategory] = useState<string>(sampleMenu.categories[0]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuPdfFile, setMenuPdfFile] = useState<File | null>(null);
  const [showPdfUpload, setShowPdfUpload] = useState(false);

  const handleDownloadMenu = () => {
    toast.info('Download del menu in corso...');
    
    const doc = new jsPDF();
    let yPos = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`MENU - ${sampleMenu.restaurantName}`, 15, yPos);
    yPos += 15;
    
    sampleMenu.categories.forEach(category => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${category.toUpperCase()}`, 15, yPos);
      yPos += 10;
      
      const itemsInCategory = sampleMenu.menuItems.filter(item => item.category === category);
      
      itemsInCategory.forEach(item => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.name} - €${item.price}`, 15, yPos);
        yPos += 6;
        
        const descLines = doc.splitTextToSize(item.description, 180);
        doc.text(descLines, 15, yPos);
        yPos += descLines.length * 5;
        
        if (item.glutenFree) {
          doc.text("✓ Senza Glutine", 15, yPos);
          yPos += 5;
        }
        
        if (item.allergens && item.allergens.length > 0) {
          doc.text(`⚠️ Allergeni: ${item.allergens.join(', ')}`, 15, yPos);
          yPos += 5;
        }
        
        yPos += 8;
      });
      
      yPos += 10;
    });
    
    const date = new Date().toLocaleDateString('it-IT');
    doc.setFontSize(8);
    doc.text(`Generato il ${date}. Prezzi soggetti a variazioni.`, 15, 285);
    
    doc.save(`menu-${sampleMenu.restaurantName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    
    toast.success('Menu scaricato con successo in formato PDF');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setMenuPdfFile(file);
        toast.success('File PDF selezionato');
      } else {
        toast.error('Per favore seleziona un file PDF');
      }
    }
  };

  const handlePdfUpload = () => {
    if (menuPdfFile) {
      toast.success('Menu PDF caricato con successo');
      setShowPdfUpload(false);
    } else {
      toast.error('Seleziona un file PDF prima di caricare');
    }
  };

  const filteredItems = sampleMenu.menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-poppins font-semibold text-lg">{sampleMenu.restaurantName} - Menu</h2>
        <div className="flex gap-2">
          {isRestaurantOwner && (
            <Button variant="outline" size="sm" onClick={() => setShowPdfUpload(true)} className="flex gap-1">
              <Upload size={16} />
              <span className="hidden sm:inline">Carica PDF</span>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleDownloadMenu} className="flex gap-1">
            <Download size={16} />
            <span className="hidden sm:inline">Scarica PDF</span>
          </Button>
        </div>
      </div>

      {showPdfUpload && isRestaurantOwner && (
        <div className="border border-dashed rounded-lg p-6 text-center">
          <FileText size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="font-medium text-gray-700 mb-2">Carica il menu in formato PDF</p>
          <p className="text-sm text-gray-500 mb-4">Il file verrà mostrato ai clienti insieme al menu interattivo</p>
          
          <input
            type="file"
            id="menu-pdf-upload"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <label htmlFor="menu-pdf-upload" className="cursor-pointer">
              <Button variant="outline" type="button">
                Seleziona file PDF
              </Button>
            </label>
            
            {menuPdfFile && (
              <Button onClick={handlePdfUpload}>
                Carica menu
              </Button>
            )}
          </div>
          
          {menuPdfFile && (
            <p className="mt-3 text-sm text-green-600">
              File selezionato: {menuPdfFile.name}
            </p>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-3" 
            onClick={() => setShowPdfUpload(false)}
          >
            Annulla
          </Button>
        </div>
      )}

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
