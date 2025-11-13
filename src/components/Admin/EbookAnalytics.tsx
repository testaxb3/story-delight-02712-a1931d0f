import { useEbookStats } from '@/hooks/useEbookStats';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Users, Clock, BookOpen, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EbookAnalyticsProps {
  ebookId: string;
}

export function EbookAnalytics({ ebookId }: EbookAnalyticsProps) {
  const { stats, isLoading, error } = useEbookStats(ebookId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Erro ao carregar analytics</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Leitores</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalReaders}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Taxa de Conclusão</span>
          </div>
          <p className="text-2xl font-bold">{Math.round(stats.completionRate)}%</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium">Tempo Médio</span>
          </div>
          <p className="text-2xl font-bold">{stats.avgTime} min</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Notas</span>
          </div>
          <p className="text-2xl font-bold">{stats.totalNotes}</p>
        </Card>
      </div>

      {/* Chapter Statistics */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Estatísticas por Capítulo</h3>
        <div className="space-y-4">
          {stats.chapterStats.map((chapter, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      Cap. {index + 1}
                    </Badge>
                    <h4 className="font-medium text-sm">{chapter.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {chapter.readers} leitores
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {chapter.avgTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {Math.round(chapter.completionRate)}% conclusão
                    </span>
                    {chapter.abandonmentRate > 30 && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {Math.round(chapter.abandonmentRate)}% abandono
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Progress value={chapter.completionRate} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Reading Over Time */}
      {stats.readingsOverTime && stats.readingsOverTime.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Leituras nos Últimos 30 Dias</h3>
          <div className="h-48 flex items-end gap-1">
            {stats.readingsOverTime.map((day, index) => {
              const maxReaders = Math.max(...stats.readingsOverTime.map(d => d.readers));
              const height = maxReaders > 0 ? (day.readers / maxReaders) * 100 : 0;
              
              return (
                <div
                  key={index}
                  className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-all"
                  style={{ height: `${height}%`, minHeight: day.readers > 0 ? '4px' : '0' }}
                  title={`${new Date(day.date).toLocaleDateString()}: ${day.readers} leitores`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>30 dias atrás</span>
            <span>Hoje</span>
          </div>
        </Card>
      )}
    </div>
  );
}
