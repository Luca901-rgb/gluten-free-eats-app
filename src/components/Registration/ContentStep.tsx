
import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText, Upload, Check, Plus, Trash2 } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { getErrorMessage, getNestedError } from '@/utils/formErrorUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ContentStep = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('description');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, we would upload to a server
    // For now, just store the file name
    setValue('content.menuPdfUrl', file.name);
  };

  // Get menu items from form
  const menuItems = watch('content.menuItems') || [];
  
  // Add a new menu category
  const addCategory = () => {
    const newCategory = {
      category: '',
      items: [{ name: '', description: '', price: 0, glutenFree: false }]
    };
    
    setValue('content.menuItems', [...menuItems, newCategory]);
  };
  
  // Add a new menu item to a category
  const addMenuItem = (categoryIndex: number) => {
    const updatedMenu = [...menuItems];
    updatedMenu[categoryIndex].items.push({ 
      name: '', 
      description: '', 
      price: 0, 
      glutenFree: false 
    });
    
    setValue('content.menuItems', updatedMenu);
  };
  
  // Update a category name
  const updateCategoryName = (index: number, value: string) => {
    const updatedMenu = [...menuItems];
    updatedMenu[index].category = value;
    setValue('content.menuItems', updatedMenu);
  };
  
  // Update a menu item property
  const updateMenuItem = (categoryIndex: number, itemIndex: number, property: string, value: any) => {
    const updatedMenu = [...menuItems];
    updatedMenu[categoryIndex].items[itemIndex] = {
      ...updatedMenu[categoryIndex].items[itemIndex],
      [property]: value
    };
    
    setValue('content.menuItems', updatedMenu);
  };
  
  // Remove a menu item
  const removeMenuItem = (categoryIndex: number, itemIndex: number) => {
    const updatedMenu = [...menuItems];
    updatedMenu[categoryIndex].items.splice(itemIndex, 1);
    
    // If no items left, remove the category too
    if (updatedMenu[categoryIndex].items.length === 0) {
      updatedMenu.splice(categoryIndex, 1);
    }
    
    setValue('content.menuItems', updatedMenu);
  };
  
  // Remove a category and all its items
  const removeCategory = (index: number) => {
    const updatedMenu = [...menuItems];
    updatedMenu.splice(index, 1);
    setValue('content.menuItems', updatedMenu);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Descrizione e Menù</h3>
        <p className="text-sm text-gray-500">
          Aggiungi una descrizione dettagliata del tuo ristorante, carica il menù e descrivi i tuoi piatti.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="description">Descrizione</TabsTrigger>
          <TabsTrigger value="pdfMenu">Menu PDF</TabsTrigger>
          <TabsTrigger value="interactiveMenu">Menu Interattivo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content.description">Descrizione del ristorante *</Label>
            <Textarea
              id="content.description"
              placeholder="Descrivi il tuo locale, la storia, lo stile di cucina, l'atmosfera..."
              className="min-h-[200px]"
              {...register('content.description', { required: "Campo obbligatorio" })}
            />
            {getNestedError(errors, 'content.description') && (
              <p className="text-sm text-red-500 mt-1">
                {getErrorMessage(getNestedError(errors, 'content.description'))}
              </p>
            )}
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start space-x-3">
            <Check className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="space-y-2">
              <Label htmlFor="content.hasGlutenFreeMenu" className="flex items-center space-x-2">
                <Checkbox
                  id="content.hasGlutenFreeMenu"
                  checked={watch('content.hasGlutenFreeMenu')}
                  onCheckedChange={(checked) => setValue('content.hasGlutenFreeMenu', !!checked)}
                />
                <span>Disponiamo di un menù specifico per celiaci (Senza glutine)</span>
              </Label>
              <p className="text-sm text-green-700">
                Selezionando questa opzione, il tuo ristorante sarà incluso nelle ricerche specifiche per opzioni senza glutine.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pdfMenu" className="space-y-4">
          <div className="space-y-2">
            <Label>Carica menù (PDF)</Label>
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{watch('content.menuPdfUrl') || 'Nessun file selezionato'}</p>
                    <p className="text-xs text-gray-500">Formato PDF, max 10MB</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf" 
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} className="mr-2" />
                  Carica PDF
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              <strong>Suggerimento:</strong> Un menu in formato PDF è essenziale, ma considera di utilizzare
              anche il nostro menu interattivo che permette ai clienti di esplorare i piatti con immagini,
              descrizioni dettagliate e informazioni sugli allergeni.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="interactiveMenu" className="space-y-6">
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-700">
              Crea un menu interattivo per il tuo ristorante. Organizza i tuoi piatti in categorie
              (antipasti, primi, secondi, etc.) e aggiungi dettagli su ogni piatto.
            </p>
          </div>
          
          {menuItems.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="mb-4">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={category.category}
                    placeholder="Nome categoria (es. Antipasti)"
                    onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
                    className="font-medium text-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCategory(categoryIndex)}
                    className="h-8 w-8 text-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-3 border rounded-md bg-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Input
                          value={item.name}
                          placeholder="Nome del piatto"
                          onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'name', e.target.value)}
                          className="font-medium"
                        />
                      </div>
                      
                      <div className="w-24 ml-2">
                        <Input
                          type="number"
                          value={item.price}
                          placeholder="Prezzo"
                          min="0"
                          step="0.01"
                          onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'price', parseFloat(e.target.value))}
                        />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMenuItem(categoryIndex, itemIndex)}
                        className="ml-1 h-8 w-8 text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    <Textarea
                      value={item.description}
                      placeholder="Descrizione del piatto e ingredienti"
                      onChange={(e) => updateMenuItem(categoryIndex, itemIndex, 'description', e.target.value)}
                      className="h-20 text-sm"
                    />
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`gluten-free-${categoryIndex}-${itemIndex}`}
                        checked={item.glutenFree}
                        onCheckedChange={(checked) => updateMenuItem(categoryIndex, itemIndex, 'glutenFree', !!checked)}
                      />
                      <Label htmlFor={`gluten-free-${categoryIndex}-${itemIndex}`}>
                        Piatto senza glutine
                      </Label>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addMenuItem(categoryIndex)}
                  className="w-full flex items-center justify-center"
                >
                  <Plus size={16} className="mr-1" />
                  Aggiungi piatto
                </Button>
              </CardContent>
            </Card>
          ))}
          
          <Button
            type="button"
            variant="secondary"
            onClick={addCategory}
            className="w-full"
          >
            <Plus size={16} className="mr-1" />
            Aggiungi categoria
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentStep;
