import { Chapter } from '@/data/ebookContent';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, FileText, List, AlertCircle } from 'lucide-react';

interface ChaptersPreviewProps {
  chapters: Chapter[];
}

export function ChaptersPreview({ chapters }: ChaptersPreviewProps) {
  if (chapters.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Nenhum capítulo detectado</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Capítulos</span>
          </div>
          <p className="text-2xl font-bold">{chapters.length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Seções</span>
          </div>
          <p className="text-2xl font-bold">
            {chapters.reduce((sum, ch) => sum + ch.content.length, 0)}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <List className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Palavras</span>
          </div>
          <p className="text-2xl font-bold">
            {chapters.reduce((sum, ch) => {
              return sum + ch.content.reduce((contentSum, section) => {
                if (typeof section.content === 'string') {
                  return contentSum + section.content.split(/\s+/).length;
                }
                return contentSum;
              }, 0);
            }, 0)}
          </p>
        </Card>
      </div>

      {/* Chapters List */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Preview dos Capítulos</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <Card key={chapter.id} className="p-4 border-l-4 border-l-primary">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Capítulo {index + 1}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {chapter.content.length} seções
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{chapter.title}</h4>
                      {chapter.subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {chapter.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Section Types Preview */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Array.from(
                      new Set(chapter.content.map((section) => section.type))
                    ).map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* First paragraph preview */}
                  {chapter.content.length > 0 && (
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-2 pl-4 border-l-2 border-muted">
                      {typeof chapter.content[0].content === 'string'
                        ? chapter.content[0].content.substring(0, 150)
                        : 'Preview não disponível'}
                      ...
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
