"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ClearDataButton() {
  const { toast } = useToast();

  const handleClear = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('daypilot-tasks');
      localStorage.removeItem('daypilot-preferences');
      localStorage.removeItem('daypilot-profile');
      
      toast({
        title: "Data Cleared",
        description: "Refreshing to load sample data with new features...",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClear}
      className="fixed bottom-4 right-4 z-50 gap-2 shadow-lg"
    >
      <Trash2 className="w-4 h-4" />
      Reset to Sample Data
    </Button>
  );
}
