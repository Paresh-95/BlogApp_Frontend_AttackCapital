'use client';

import { useToast } from '@/hooks/use-toast'; 

export function Toast({ title, description }: { title: string; description: string }) {
  const { toast } = useToast();

  // Trigger the toast
  toast({
    title,
    description,
  });

  return null;
}
