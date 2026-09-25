import { lazy, Suspense, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

const ReviewForm = lazy(() =>
  import('@/components/reviews/ReviewForm').then((m) => ({ default: m.ReviewForm }))
);

interface ReviewDialogProps {
  children: React.ReactNode;
}

export default function ReviewDialog({ children }: ReviewDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-left">Share your thoughts</DialogTitle>
          <DialogDescription className="text-left">* required fields</DialogDescription>
        </DialogHeader>
        {open && (
          <Suspense fallback={null}>
            <ReviewForm onSuccess={() => setOpen(false)} />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
}
