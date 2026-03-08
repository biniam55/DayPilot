"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Priority, EnergyLevel, RecurrenceType } from "@/lib/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface QuickTaskInputProps {
  onAdd: (name: string, priority: Priority, duration: number, energyLevel?: EnergyLevel, recurrence?: RecurrenceType) => void;
}

export function QuickTaskInput({ onAdd }: QuickTaskInputProps) {
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [duration, setDuration] = useState(30);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim(), priority, duration, energyLevel, recurrence);
      setValue('');
      setPriority('medium');
      setDuration(30);
      setEnergyLevel('medium');
      setRecurrence('none');
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex flex-col gap-3 p-4 bg-card rounded-xl border shadow-sm">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a new task..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="border-0 focus-visible:ring-0 bg-transparent text-sm h-10 flex-1 px-0"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="rounded-lg h-9 px-4 gap-2"
              disabled={!value.trim()}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
          
          <CollapsibleContent>
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
              <Select value={priority} onValueChange={(val: Priority) => setPriority(val)}>
                <SelectTrigger className="h-8 text-xs w-[110px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={duration.toString()} onValueChange={(val) => setDuration(parseInt(val))}>
                <SelectTrigger className="h-8 text-xs w-[100px]">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                </SelectContent>
              </Select>

              <Select value={energyLevel} onValueChange={(val: EnergyLevel) => setEnergyLevel(val)}>
                <SelectTrigger className="h-8 text-xs w-[100px]">
                  <SelectValue placeholder="Energy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔥 High</SelectItem>
                  <SelectItem value="medium">⚡ Medium</SelectItem>
                  <SelectItem value="low">🌙 Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={recurrence} onValueChange={(val: RecurrenceType) => setRecurrence(val)}>
                <SelectTrigger className="h-8 text-xs w-[100px]">
                  <SelectValue placeholder="Repeat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>

              <CollapsibleTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 ml-auto text-xs text-muted-foreground"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </form>
  );
}