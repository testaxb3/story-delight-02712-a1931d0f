import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Users, FileCheck, GraduationCap, AlertTriangle, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Methodology() {
  const { t } = useTranslation();
  
  const handleDownloadPDF = () => {
    // Usa a funcionalidade de impressão do navegador que gera PDFs melhores
    window.print();
  };
  
  return (
    <>
      <style>{`
        @media print {
          /* Esconde navegação, rodapé e botões */
          nav, footer, .no-print {
            display: none !important;
          }
          
          /* Otimiza para impressão */
          body {
            background: white !important;
          }
          
          /* Evita quebras de página dentro de cards */
          .print-card {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Ajusta margens */
          .container {
            max-width: 100% !important;
            padding: 20px !important;
          }
          
          /* Remove sombras e bordas decorativas */
          * {
            box-shadow: none !important;
          }
        }
      `}</style>
      <MainLayout>
      <div id="methodology-content" className="container max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t.methodology.title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t.methodology.subtitle}
          </p>
          <Button onClick={handleDownloadPDF} className="gap-2 no-print">
            <Download className="w-4 h-4" />
            Baixar como PDF
          </Button>
        </div>

        <Separator className="my-8" />

        {/* Critical Distinction */}
        <Card className="print-card border-2 border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
              <CardTitle>{t.methodology.notGenericAI.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-100">
                  {t.methodology.notGenericAI.generic.title}
                </h4>
                <ul className="text-sm space-y-1 text-purple-800 dark:text-purple-200">
                  {t.methodology.notGenericAI.generic.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-green-900 dark:text-green-100">
                  {t.methodology.notGenericAI.ours.title}
                </h4>
                <ul className="text-sm space-y-1 text-green-800 dark:text-green-200">
                  {t.methodology.notGenericAI.ours.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neurological Foundation */}
        <Card className="print-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <CardTitle>{t.methodology.neurologicalReality.title}</CardTitle>
            </div>
            <CardDescription>
              {t.methodology.neurologicalReality.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-5 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
              <h3 className="font-bold text-blue-900 dark:text-blue-100">
                {t.methodology.neurologicalReality.prefrontalCortex.title}
              </h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                {t.methodology.neurologicalReality.prefrontalCortex.content.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-lg border border-amber-200 dark:border-amber-800 space-y-3">
              <h3 className="font-bold text-amber-900 dark:text-amber-100">
                {t.methodology.neurologicalReality.amygdalaHijack.title}
              </h3>
              <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                {t.methodology.neurologicalReality.amygdalaHijack.content.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 p-5 rounded-lg border border-green-200 dark:border-green-800 space-y-3">
              <h3 className="font-bold text-green-900 dark:text-green-100">
                {t.methodology.neurologicalReality.coRegulation.title}
              </h3>
              <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                {t.methodology.neurologicalReality.coRegulation.content.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Three Neurological Profiles */}
        <Card className="print-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <CardTitle>{t.methodology.profiles.title}</CardTitle>
            </div>
            <CardDescription>
              {t.methodology.profiles.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* DEFIANT Profile */}
            <div className="border-l-4 border-red-500 pl-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  {t.methodology.profiles.defiant.title}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.methodology.profiles.defiant.data}</h4>
                <p className="text-sm text-muted-foreground">
                  {t.methodology.profiles.defiant.dataContent}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {t.methodology.profiles.defiant.prevalence}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.methodology.profiles.defiant.approach}</h4>
                <p className="text-sm font-medium">{t.methodology.profiles.defiant.approachTitle}</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  {t.methodology.profiles.defiant.approachPoints.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.methodology.profiles.defiant.implications}</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  {t.methodology.profiles.defiant.implicationsPoints.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* INTENSE Profile */}
            <div className="border-l-4 border-orange-500 pl-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="text-xs bg-orange-500 hover:bg-orange-600">
                  {t.methodology.profiles.intense.title}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.methodology.profiles.intense.data}</h4>
                <p className="text-sm text-muted-foreground">
                  {t.methodology.profiles.intense.dataContent}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.methodology.profiles.intense.approach}</h4>
                <p className="text-sm font-medium">{t.methodology.profiles.intense.approachTitle}</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  {t.methodology.profiles.intense.approachPoints.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.methodology.profiles.intense.implications}</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  {t.methodology.profiles.intense.implicationsPoints.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DISTRACTED Profile */}
            <div className="border-l-4 border-blue-500 pl-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {t.methodology.profiles.distracted.title}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.methodology.profiles.distracted.data}</h4>
                <p className="text-sm text-muted-foreground">
                  {t.methodology.profiles.distracted.dataContent}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {t.methodology.profiles.distracted.prevalence}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.methodology.profiles.distracted.approach}</h4>
                <p className="text-sm font-medium">{t.methodology.profiles.distracted.approachTitle}</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  {t.methodology.profiles.distracted.approachPoints.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t.methodology.profiles.distracted.implications}</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  {t.methodology.profiles.distracted.implicationsPoints.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Script Creation Methodology */}
        <Card className="print-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-green-600" />
              <CardTitle>{t.methodology.scriptCreation.title}</CardTitle>
            </div>
            <CardDescription>
              {t.methodology.scriptCreation.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-300">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.methodology.scriptCreation.step1.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.methodology.scriptCreation.step1.content}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-300">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.methodology.scriptCreation.step2.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.methodology.scriptCreation.step2.content}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-300">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.methodology.scriptCreation.step3.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.methodology.scriptCreation.step3.content}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-300">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.methodology.scriptCreation.step4.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.methodology.scriptCreation.step4.content}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-300">5</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.methodology.scriptCreation.step5.title}</h4>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1 ml-4">
                    {t.methodology.scriptCreation.step5.points.map((point, i) => (
                      <li key={i}>✓ {point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Academic References */}
        <Card className="print-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <CardTitle>{t.methodology.references.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {t.methodology.references.items.map((ref, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium">
                    {ref.authors} ({ref.year}). <span className="italic">{ref.title}</span>.
                  </p>
                  <p className="text-muted-foreground ml-4">{ref.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Professional Disclaimer */}
        <Card className="print-card border-2 border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <CardTitle>{t.methodology.disclaimer.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t.methodology.disclaimer.content}
            </p>
          </CardContent>
        </Card>

      </div>
    </MainLayout>
    </>
  );
}
