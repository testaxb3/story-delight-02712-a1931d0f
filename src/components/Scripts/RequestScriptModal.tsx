import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useScriptRequests, CreateScriptRequestData } from '@/hooks/useScriptRequests';
import { AlertCircle, Loader2 } from 'lucide-react';

const requestSchema = z.object({
  situation_description: z.string().min(20, 'Descreva a situação com pelo menos 20 caracteres'),
  child_brain_profile: z.string().optional(),
  child_age: z.coerce.number().min(1).max(18).optional(),
  location_type: z.array(z.string()).optional(),
  parent_emotional_state: z.string().optional(),
  urgency_level: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  additional_notes: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const LOCATION_OPTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'school', label: 'School' },
  { id: 'public', label: 'Public places' },
  { id: 'transport', label: 'Transportation' },
  { id: 'family', label: 'Family events' },
];

const BRAIN_PROFILES = [
  'DEFIANT',
  'INTENSE',
  'SENSITIVE',
  'HYPERFOCUS',
];

const EMOTIONAL_STATES = [
  'calm',
  'stressed',
  'frustrated',
  'exhausted',
  'overwhelmed',
];

const URGENCY_LEVELS = [
  { value: 'low', label: 'Low - Future planning' },
  { value: 'medium', label: 'Medium - Happens regularly' },
  { value: 'high', label: 'High - Happens daily' },
  { value: 'urgent', label: 'Urgent - Need help now!' },
];

interface RequestScriptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestScriptModal({ open, onOpenChange }: RequestScriptModalProps) {
  const { createRequest, isCreating } = useScriptRequests();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      situation_description: '',
      urgency_level: 'medium',
      location_type: [],
      additional_notes: '',
    },
  });

  const onSubmit = (values: RequestFormValues) => {
    const requestData: CreateScriptRequestData = {
      situation_description: values.situation_description,
      child_brain_profile: values.child_brain_profile,
      child_age: values.child_age,
      location_type: selectedLocations.length > 0 ? selectedLocations : undefined,
      parent_emotional_state: values.parent_emotional_state,
      urgency_level: values.urgency_level,
      additional_notes: values.additional_notes,
    };

    createRequest(requestData, {
      onSuccess: () => {
        form.reset();
        setSelectedLocations([]);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Request New Script
          </DialogTitle>
          <DialogDescription>
            Describe the situation you're facing and our team will create a personalized script for you.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Situation */}
            <FormField
              control={form.control}
              name="situation_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe the Situation *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: My 6-year-old has meltdowns every morning before school. He screams, throws himself on the floor and refuses to get dressed..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about what happens, when it happens, and how your child reacts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brain Profile */}
              <FormField
                control={form.control}
                name="child_brain_profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Child's Brain Profile</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select profile" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BRAIN_PROFILES.map((profile) => (
                          <SelectItem key={profile} value={profile}>
                            {profile}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Age */}
              <FormField
                control={form.control}
                name="child_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Child's Age</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="18" placeholder="Ex: 7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <FormItem>
              <FormLabel>Where does it happen?</FormLabel>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {LOCATION_OPTIONS.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={location.id}
                      checked={selectedLocations.includes(location.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLocations([...selectedLocations, location.id]);
                        } else {
                          setSelectedLocations(selectedLocations.filter((l) => l !== location.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={location.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {location.label}
                    </label>
                  </div>
                ))}
              </div>
            </FormItem>

            {/* Parent Emotional State */}
            <FormField
              control={form.control}
              name="parent_emotional_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How do you usually feel in this situation?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your emotional state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMOTIONAL_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state.charAt(0).toUpperCase() + state.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This helps us create a script suitable for your emotional state
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Urgency Level */}
            <FormField
              control={form.control}
              name="urgency_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency Level *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {URGENCY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="additional_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other information that might be helpful..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
