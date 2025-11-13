import { CalendarClock, CheckCircle2, Loader2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface TimelineMilestone {
  id: string;
  ageRange: string;
  title: string;
  description: string;
  recommendedScriptIds: string[];
  recommendedVideoIds: string[];
}

interface DevelopmentTimelineProps {
  loading: boolean;
  milestones: TimelineMilestone[];
  childName?: string;
  brainProfile?: string;
}

const COLORS: Record<string, string> = {
  INTENSE: 'from-purple-500/10 to-purple-600/10 border-purple-500/20',
  DISTRACTED: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
  DEFIANT: 'from-green-500/10 to-green-600/10 border-green-500/20',
};

export function DevelopmentTimeline({ loading, milestones, childName, brainProfile }: DevelopmentTimelineProps) {
  const gradientClass = COLORS[brainProfile ?? 'INTENSE'] ?? COLORS.INTENSE;

  return (
    <Card className={cn('p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg relative overflow-hidden')}> 
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold">Development Timeline</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {childName
              ? `Personalized milestones for ${childName}`
              : 'Track upcoming milestones for your child\'s brain.'}
          </p>
        </div>
        {brainProfile && (
          <Badge className="bg-purple-500/10 text-purple-700 border-purple-500/20 uppercase">
            {brainProfile} Profile
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Carregando marcos…
        </div>
      ) : milestones.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted p-6 text-center text-sm text-muted-foreground">
          Nenhum marco personalizado ainda. Use scripts e registre resultados para destravar recomendações.
        </div>
      ) : (
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 shadow" />
                {index !== milestones.length - 1 && (
                  <div className="flex-1 w-px bg-gradient-to-b from-purple-500/40 via-purple-400/20 to-transparent" />
                )}
              </div>

              <div className={cn('rounded-xl border p-4 bg-gradient-to-br', gradientClass)}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Faixa etária</p>
                    <p className="text-sm font-semibold">{milestone.ageRange}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Marco recomendado
                  </Badge>
                </div>
                <h3 className="mt-3 text-base font-semibold">{milestone.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{milestone.description}</p>

                {(milestone.recommendedScriptIds.length > 0 || milestone.recommendedVideoIds.length > 0) && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {milestone.recommendedScriptIds.length > 0 && (
                      <div className="rounded-lg border border-purple-500/20 bg-white/70 p-3 text-xs">
                        <p className="font-semibold text-purple-700 mb-1">Scripts sugeridos</p>
                        <p className="text-muted-foreground">
                          {milestone.recommendedScriptIds.length} disponível(is). Explore-os em NEP Scripts.
                        </p>
                      </div>
                    )}
                    {milestone.recommendedVideoIds.length > 0 && (
                      <div className="rounded-lg border border-blue-500/20 bg-white/70 p-3 text-xs">
                        <p className="font-semibold text-blue-700 mb-1">Vídeos sugeridos</p>
                        <p className="text-muted-foreground">
                          {milestone.recommendedVideoIds.length} na Biblioteca de Vídeos.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
