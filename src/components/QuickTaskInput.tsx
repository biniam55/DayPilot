"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";

interface QuickTaskInputProps {
  onAdd: (name: string) => void;
}

export function QuickTaskInput({ onAdd }: QuickTaskInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex items-center gap-2 p-1.5 bg-card rounded-xl border shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
        <div className="pl-3 text-muted-foreground">
          <Zap className="w-4 h-4 text-accent" />
        </div>
        <Input
          placeholder="Quickly add a task..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border-none focus-visible:ring-0 bg-transparent text-sm h-9"
        />
        <Button 
          type="submit" 
          size="sm" 
          className="rounded-lg h-8 px-3 gap-1"
          disabled={!value.trim()}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 px-1">
        Type a task name and press Enter to save instantly.
      </p>
    </form>
  );
}