
import React from 'react';
import { Copy } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ReviewCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewCode: string;
  onCopyCode: () => void;
  onViewReviews: () => void;
}

const ReviewCodeDialog = ({
  open,
  onOpenChange,
  reviewCode,
  onCopyCode,
  onViewReviews
}: ReviewCodeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Codice recensione generato</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Questo è il codice che il cliente dovrà inserire per lasciare una recensione verificata:
          </p>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
            <span className="font-mono text-lg font-semibold">{reviewCode}</span>
            <Button variant="outline" size="sm" onClick={onCopyCode}>
              <Copy className="h-4 w-4 mr-1" /> Copia
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Questo codice è stato automaticamente associato alla prenotazione. 
            Quando il cliente accederà alla sezione recensioni del ristorante, 
            potrà utilizzare questo codice che verrà automaticamente inserito nel form.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onViewReviews}>
            Visualizza in sezione recensioni
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewCodeDialog;
