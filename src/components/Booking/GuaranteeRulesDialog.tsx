
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Euro, Info, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GuaranteeRulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GuaranteeRulesDialog: React.FC<GuaranteeRulesDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const isMobile = useIsMobile();
  
  // Auto-dismiss after component mounts (to simulate hidden state)
  React.useEffect(() => {
    // Auto-close the dialog after it mounts
    const timer = setTimeout(() => {
      onOpenChange(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [onOpenChange]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'w-[95%] p-4' : 'sm:max-w-md'} mx-auto`}>
        <DialogHeader className={isMobile ? 'space-y-2 mb-3' : ''}>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span className="flex-1">Regole di garanzia prenotazioni</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Informazioni importanti sulle garanzie per la tua prenotazione
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-md border border-blue-200">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Euro size={16} className="mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                <span><strong>€10</strong> per prenotazioni fino a 9 persone</span>
              </li>
              <li className="flex items-start">
                <Euro size={16} className="mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                <span><strong>€20</strong> per prenotazioni da 10 persone in su</span>
              </li>
            </ul>
          </div>
          
          <div className="text-sm">
            <p className="font-semibold mb-1">Importante:</p>
            <p className="text-gray-700">Addebito solo in caso di no-show non comunicato</p>
          </div>
          
          <div className={`border-t pt-4 ${isMobile ? 'pb-2' : ''}`}>
            <DialogClose asChild>
              <Button className="w-full">Ho capito</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuaranteeRulesDialog;
