import { MainLayout } from "@/components/Layout/MainLayout";
import { useEbooks } from "@/hooks/useEbooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EbookLibrary() {
  const { ebooks, isLoading } = useEbooks();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando biblioteca...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Biblioteca de Ebooks</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Guias completos e práticos para transformar a criação dos seus filhos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{ebooks?.length || 0}</div>
              <div className="text-sm text-muted-foreground mt-1">Ebooks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">
                {ebooks?.reduce((sum, e) => sum + (e.total_chapters || 0), 0) || 0}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Capítulos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">
                {ebooks?.reduce((sum, e) => sum + (e.estimated_reading_time || 0), 0) || 0} min
              </div>
              <div className="text-sm text-muted-foreground mt-1">Leitura</div>
            </CardContent>
          </Card>
        </div>

        {/* Ebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ebooks?.map((ebook) => (
            <Card
              key={ebook.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              onClick={() => navigate(`/ebook/${ebook.id}`)}
            >
              {/* Cover */}
              <div
                className="h-48 rounded-t-lg flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: ebook.cover_color }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                <BookOpen className="w-20 h-20 text-white/80 relative z-10" />
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {ebook.title}
                </CardTitle>
                {ebook.subtitle && (
                  <CardDescription className="line-clamp-2">
                    {ebook.subtitle}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{ebook.total_chapters} caps</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{ebook.estimated_reading_time} min</span>
                  </div>
                </div>

                {/* Progress Badge (if applicable) */}
                {ebook.total_readers && ebook.total_readers > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {ebook.total_readers} {ebook.total_readers === 1 ? "leitor" : "leitores"}
                    </Badge>
                    {ebook.completion_rate && ebook.completion_rate > 0 && (
                      <Badge variant="outline">
                        {ebook.completion_rate.toFixed(0)}% completo
                      </Badge>
                    )}
                  </div>
                )}

                {/* CTA */}
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <span>Começar Leitura</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {(!ebooks || ebooks.length === 0) && (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum ebook disponível</h3>
            <p className="text-muted-foreground">
              Os ebooks serão adicionados em breve
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
