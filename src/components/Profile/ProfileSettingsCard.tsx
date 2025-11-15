import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Clock, Smartphone, Check, DollarSign, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { PhotoUpload } from '@/components/PhotoUpload';
import { NotificationSettings } from '@/components/NotificationSettings';
import type { ChildProfile } from '@/contexts/ChildProfilesContext';

interface ProfileSettingsCardProps {
  activeChild: ChildProfile | null;
  childName: string;
  childAge: number | '';
  savingChild: boolean;
  onChildNameChange: (name: string) => void;
  onChildAgeChange: (age: number | '') => void;
  onChildNameUpdate: () => Promise<void>;
  onChildInfoUpdate: () => Promise<void>;
  onPhotoUpdate: () => Promise<void>;
  refundStatus: { status: string; created_at: string } | null;
  isInstalled: boolean;
}

export function ProfileSettingsCard({
  activeChild,
  childName,
  childAge,
  savingChild,
  onChildNameChange,
  onChildAgeChange,
  onChildNameUpdate,
  onChildInfoUpdate,
  onPhotoUpdate,
  refundStatus,
  isInstalled,
}: ProfileSettingsCardProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Settings */}
      <Card className="p-6 glass border-none shadow-lg animate-in fade-in slide-in-from-bottom-7 duration-500 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 dark:text-slate-300" />
          <h2 className="text-lg font-semibold dark:text-slate-100">Child Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="child-name" className="text-sm">
              Child's name
            </Label>
            <Input
              id="child-name"
              placeholder="Enter name"
              className="mt-1"
              value={childName}
              disabled={!activeChild}
              onChange={(e) => onChildNameChange(e.target.value)}
              onBlur={onChildNameUpdate}
            />
            {!activeChild && (
              <p className="text-xs text-muted-foreground mt-1">
                Complete the quiz to add your child's information.
              </p>
            )}
          </div>

          {activeChild && (
            <>
              <div>
                <Label htmlFor="child-photo" className="text-sm mb-2 block">
                  Child's Photo
                </Label>
                <PhotoUpload
                  currentPhotoUrl={activeChild.photo_url}
                  childId={activeChild.id}
                  childName={activeChild.name}
                  onUploadComplete={onPhotoUpdate}
                />
              </div>
              <div>
                <Label htmlFor="child-age" className="text-sm">
                  Child's age
                </Label>
                <Input
                  id="child-age"
                  type="number"
                  placeholder="5"
                  className="mt-1"
                  value={childAge}
                  onChange={(e) =>
                    onChildAgeChange(e.target.value ? parseInt(e.target.value) : '')
                  }
                  onBlur={onChildInfoUpdate}
                  min="1"
                  max="18"
                />
              </div>
            </>
          )}

          {savingChild && activeChild && (
            <p className="text-xs text-green-600">Saving...</p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t dark:border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary dark:text-primary-foreground" />
            <h3 className="font-semibold text-sm dark:text-slate-200">Support</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium dark:text-slate-300">Support via WhatsApp</span>
            <a
              href="https://wa.me/27617525578"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary dark:text-primary-foreground text-sm font-semibold hover:underline transition-colors"
            >
              Message us →
            </a>
          </div>
        </div>
      </Card>

      {/* Push Notifications */}
      <NotificationSettings />

      {/* PWA Install */}
      <Card className="p-6 glass border-none shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-500 transition-all">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-4 h-4 text-primary dark:text-primary-foreground" />
          <h3 className="font-semibold text-sm dark:text-slate-200">App Installation</h3>
        </div>
        <div className="pl-6">
          {isInstalled ? (
            <div className="flex items-center gap-2 text-success dark:text-green-400">
              <Check className="w-4 h-4" />
              <p className="text-sm font-medium">✓ App Installed on Device</p>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full dark:border-slate-600 dark:hover:bg-slate-800/60 transition-colors"
              onClick={() => navigate('/onboarding')}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              📱 Add App to Home Screen
            </Button>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Install for faster access and offline use
          </p>
        </div>
      </Card>

      {/* Refund Status or Policy */}
      {refundStatus ? (
        <Card className="p-6 border-2 border-primary/20 dark:border-primary/30 glass animate-in fade-in slide-in-from-bottom-9 duration-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {refundStatus.status === 'pending' && <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
              {refundStatus.status === 'processed' && (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
              {(refundStatus.status === 'approved' ||
                refundStatus.status === 'partial_accepted') && (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              )}
              <h3 className="font-semibold text-sm dark:text-slate-200">Refund Request</h3>
            </div>
            <Badge
              variant={refundStatus.status === 'processed' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {refundStatus.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground mb-4">
              {refundStatus.status === 'pending' && 'Your refund request is being reviewed.'}
              {refundStatus.status === 'approved' && 'Your refund has been approved!'}
              {refundStatus.status === 'partial_accepted' &&
                'Your partial refund has been approved!'}
              {refundStatus.status === 'processed' && 'Your refund has been processed.'}
              {refundStatus.status === 'rejected' && 'Your refund request was not approved.'}
            </p>
            <Button
              variant="outline"
              className="w-full dark:border-slate-600 dark:hover:bg-slate-800/60 transition-colors"
              onClick={() => navigate('/refund-status')}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Refund Status
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 glass border-none shadow-lg animate-in fade-in slide-in-from-bottom-9 duration-500 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-primary dark:text-primary-foreground" />
            <h3 className="font-semibold text-sm dark:text-slate-200">Refund Policy</h3>
          </div>
          <div className="pl-6">
            <p className="text-sm text-muted-foreground mb-4">
              30-day money-back guarantee. Not satisfied? Get a full refund, no questions asked.
            </p>
            <Button variant="outline" className="w-full dark:border-slate-600 dark:hover:bg-slate-800/60 transition-colors" onClick={() => navigate('/refund')}>
              <DollarSign className="w-4 h-4 mr-2" />
              Request Refund
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
