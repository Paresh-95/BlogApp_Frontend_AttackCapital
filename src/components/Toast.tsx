'use client';

import { useToast } from '@/hooks/use-toast'; 

export function Toast({ title, description }: { title: string; description: string }) {
  const { toast } = useToast();

  toast({
    title,
    description,
  });

  return null;
}
