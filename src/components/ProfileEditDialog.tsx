import React from 'react';
import { UserProfile } from "@/lib/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileEditDialogProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  onChange: (profile: UserProfile) => void;
}

export function ProfileEditDialog({ isOpen, profile, onClose, onSave, onChange }: ProfileEditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription className="text-[11px] sm:text-xs">
            Personalize your DayPilot experience.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:py-4">
          <div className="grid gap-2">
            <Label className="text-[11px] sm:text-xs">Full Name</Label>
            <Input 
              className="text-xs" 
              value={profile.name} 
              onChange={(e) => onChange({...profile, name: e.target.value})} 
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-[11px] sm:text-xs">Email Address</Label>
            <Input 
              className="text-xs" 
              type="email" 
              value={profile.email} 
              onChange={(e) => onChange({...profile, email: e.target.value})} 
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-[11px] sm:text-xs">Profile Bio</Label>
            <Textarea 
              className="text-xs" 
              value={profile.bio || ''} 
              onChange={(e) => onChange({...profile, bio: e.target.value})} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full text-xs" onClick={() => onSave(profile)}>
            Save Profile Info
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
