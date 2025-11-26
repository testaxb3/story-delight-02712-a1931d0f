import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Users, FileCheck, GraduationCap, AlertTriangle, Download, Zap, Shield, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Methodology() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleDownloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.methodology.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background: #f9fafb; padding: 40px 20px; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 60px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 2.5rem; color: #7c3aed; margin-bottom: 16px; text-align: center; }
    .subtitle { font-size: 1.125rem; color: #6b7280; text-align: center; margin-bottom: 48px; }
    h2 { font-size: 1.875rem; color: #1f2937; margin: 40px 0 20px; padding-bottom: 12px; border-bottom: 2px solid #7c3aed; }
    h3 { font-size: 1.5rem; color: #374151; margin: 32px 0 16px; }
    h4 { font-size: 1.25rem; color: #4b5563; margin: 24px 0 12px; font-weight: 600; }
    p { margin-bottom: 16px; color: #374151; font-size: 1rem; }
    ul, ol { margin: 16px 0 16px 24px; }
    li { margin-bottom: 8px; color: #374151; }
    .card { background: #f9fafb; padding: 24px; margin: 24px 0; border-radius: 6px; border-left: 4px solid #7c3aed; }
    .profile-card { background: #f0f9ff; border-left-color: #3b82f6; }
    .warning-card { background: #fef3c7; border-left-color: #f59e0b; }
    .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin: 24px 0; }
    .reference { margin: 16px 0; padding: 12px; background: #f9fafb; border-radius: 4px; font-size: 0.875rem; }
    strong { color: #1f2937; font-weight: 600; }
    @media print { body { padding: 0; } .container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>${t.methodology.title}</h1>
    <p class="subtitle">${t.methodology.subtitle}</p>

    <h2>${t.methodology.notGenericAI.title}</h2>
    <div class="two-columns">
      <div>
        <h4>${t.methodology.notGenericAI.generic.title}</h4>
        <ul>${t.methodology.notGenericAI.generic.items.map((item: string) => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div>
        <h4>${t.methodology.notGenericAI.ours.title}</h4>
        <ul>${t.methodology.notGenericAI.ours.items.map((item: string) => `<li>${item}</li>`).join('')}</ul>
      </div>
    </div>

    <h2>${t.methodology.neurologicalReality.title}</h2>
    <p><em>${t.methodology.neurologicalReality.subtitle}</em></p>
    
    <div class="card">
      <h3>${t.methodology.neurologicalReality.prefrontalCortex.title}</h3>
      ${t.methodology.neurologicalReality.prefrontalCortex.content.map((text: string) => `<p>${text}</p>`).join('')}
    </div>

    <div class="card">
      <h3>${t.methodology.neurologicalReality.amygdalaHijack.title}</h3>
      ${t.methodology.neurologicalReality.amygdalaHijack.content.map((text: string) => `<p>${text}</p>`).join('')}
    </div>

    <div class="card">
      <h3>${t.methodology.neurologicalReality.coRegulation.title}</h3>
      ${t.methodology.neurologicalReality.coRegulation.content.map((text: string) => `<p>${text}</p>`).join('')}
    </div>

    <h2>${t.methodology.profiles.title}</h2>
    <p><em>${t.methodology.profiles.subtitle}</em></p>

    <div class="card profile-card">
      <h3>${t.methodology.profiles.defiant.title}</h3>
      <h4>${t.methodology.profiles.defiant.data}</h4>
      <p>${t.methodology.profiles.defiant.dataContent}</p>
      <p>${t.methodology.profiles.defiant.prevalence}</p>
      <h4>${t.methodology.profiles.defiant.approach}</h4>
      <p>${t.methodology.profiles.defiant.approachTitle}</p>
      <ul>${t.methodology.profiles.defiant.approachPoints.map((point: string) => `<li>${point}</li>`).join('')}</ul>
      <h4>${t.methodology.profiles.defiant.implications}</h4>
      <ul>${t.methodology.profiles.defiant.implicationsPoints.map((point: string) => `<li>${point}</li>`).join('')}</ul>
    </div>

    <div class="card profile-card">
      <h3>${t.methodology.profiles.intense.title}</h3>
      <h4>${t.methodology.profiles.intense.data}</h4>
      <p>${t.methodology.profiles.intense.dataContent}</p>
      <h4>${t.methodology.profiles.intense.approach}</h4>
      <p>${t.methodology.profiles.intense.approachTitle}</p>
      <ul>${t.methodology.profiles.intense.approachPoints.map((point: string) => `<li>${point}</li>`).join('')}</ul>
      <h4>${t.methodology.profiles.intense.implications}</h4>
      <ul>${t.methodology.profiles.intense.implicationsPoints.map((point: string) => `<li>${point}</li>`).join('')}</ul>
    </div>

    <div class="card profile-card">
      <h3>${t.methodology.profiles.distracted.title}</h3>
      <h4>${t.methodology.profiles.distracted.data}</h4>
      <p>${t.methodology.profiles.distracted.dataContent}</p>
      <p>${t.methodology.profiles.distracted.prevalence}</p>
      <h4>${t.methodology.profiles.distracted.approach}</h4>
      <p>${t.methodology.profiles.distracted.approachTitle}</p>
      <ul>${t.methodology.profiles.distracted.approachPoints.map((point: string) => `<li>${point}</li>`).join('')}</ul>
      <h4>${t.methodology.profiles.distracted.implications}</h4>
      <ul>${t.methodology.profiles.distracted.implicationsPoints.map((point: string) => `<li>${point}</li>`).join('')}</ul>
    </div>

    <h2>${t.methodology.scriptCreation.title}</h2>
    <p><em>${t.methodology.scriptCreation.subtitle}</em></p>

    <div class="card">
      <h4>1. ${t.methodology.scriptCreation.step1.title}</h4>
      <p>${t.methodology.scriptCreation.step1.content}</p>
    </div>

    <div class="card">
      <h4>2. ${t.methodology.scriptCreation.step2.title}</h4>
      <p>${t.methodology.scriptCreation.step2.content}</p>
    </div>

    <div class="card">
      <h4>3. ${t.methodology.scriptCreation.step3.title}</h4>
      <p>${t.methodology.scriptCreation.step3.content}</p>
    </div>

    <div class="card">
      <h4>4. ${t.methodology.scriptCreation.step4.title}</h4>
      <p>${t.methodology.scriptCreation.step4.content}</p>
    </div>

    <div class="card">
      <h4>5. ${t.methodology.scriptCreation.step5.title}</h4>
      <ul>${t.methodology.scriptCreation.step5.points.map((point: string) => `<li>✓ ${point}</li>`).join('')}</ul>
    </div>

    <h2>${t.methodology.references.title}</h2>
    ${t.methodology.references.items.map((ref: any) => `
      <div class="reference">
        <strong>${ref.authors}</strong> (${ref.year}). <em>${ref.title}</em>.<br>
        ${ref.details}
      </div>
    `).join('')}

    <div class="card warning-card">
      <h3>${t.methodology.disclaimer.title}</h3>
      <p>${t.methodology.disclaimer.content}</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'metodologia-neuroparenting.html';
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black pb-32 font-relative">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Header Spacer */}
        <div className="w-full h-[calc(env(safe-area-inset-top)+20px)]" />

        {/* Navigation */}
        <div className="px-4 mb-6 sticky top-0 z-50">
          <div className="flex items-center justify-between bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl p-4 rounded-full shadow-sm border border-gray-200 dark:border-gray-800">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/profile')}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Scientific Basis
            </span>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 relative z-10">
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-200 dark:border-purple-800">
              <GraduationCap className="w-4 h-4" />
              NEP Methodology
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
              The Science of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Obedience Language</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t.methodology.subtitle}
            </p>
          </motion.div>

          {/* The "Why it Works" Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="h-full border-none shadow-lg bg-white dark:bg-[#1C1C1E] rounded-[24px] overflow-hidden">
                <CardHeader className="bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-lg text-red-700 dark:text-red-300">{t.methodology.notGenericAI.generic.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {t.methodology.notGenericAI.generic.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="h-full border-none shadow-lg bg-white dark:bg-[#1C1C1E] rounded-[24px] overflow-hidden ring-2 ring-green-500/20">
                <CardHeader className="bg-green-50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg text-green-700 dark:text-green-300">{t.methodology.notGenericAI.ours.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    {t.methodology.notGenericAI.ours.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        <strong>{item}</strong>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Neurological Deep Dive */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="mb-12">
            <div className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                  <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.methodology.neurologicalReality.title}</h2>
                  <p className="text-sm text-gray-500">{t.methodology.neurologicalReality.subtitle}</p>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                {[
                  { 
                    title: t.methodology.neurologicalReality.prefrontalCortex.title,
                    content: t.methodology.neurologicalReality.prefrontalCortex.content,
                    color: "bg-indigo-50 dark:bg-indigo-900/10",
                    line: "bg-indigo-500"
                  },
                  {
                    title: t.methodology.neurologicalReality.amygdalaHijack.title,
                    content: t.methodology.neurologicalReality.amygdalaHijack.content,
                    color: "bg-orange-50 dark:bg-orange-900/10",
                    line: "bg-orange-500"
                  },
                  {
                    title: t.methodology.neurologicalReality.coRegulation.title,
                    content: t.methodology.neurologicalReality.coRegulation.content,
                    color: "bg-teal-50 dark:bg-teal-900/10",
                    line: "bg-teal-500"
                  }
                ].map((section, i) => (
                  <div key={i} className="pl-6 border-l-4 border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{section.title}</h3>
                    <div className="space-y-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {section.content.map((p, j) => <p key={j}>{p}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Brain Profiles */}
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3">
              <Users className="w-6 h-6" />
              {t.methodology.profiles.title}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* DEFIANT */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[24px] border-t-4 border-red-500 shadow-lg"
              >
                <Badge variant="outline" className="mb-4 border-red-200 text-red-600 bg-red-50">
                  {t.methodology.profiles.defiant.title}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 italic">"{t.methodology.profiles.defiant.dataContent}"</p>
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400">Approach</div>
                  <ul className="text-sm space-y-2">
                    {t.methodology.profiles.defiant.approachPoints.slice(0,3).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Zap className="w-3 h-3 text-red-500 mt-1" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* INTENSE */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[24px] border-t-4 border-orange-500 shadow-lg"
              >
                <Badge variant="outline" className="mb-4 border-orange-200 text-orange-600 bg-orange-50">
                  {t.methodology.profiles.intense.title}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 italic">"{t.methodology.profiles.intense.dataContent}"</p>
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400">Approach</div>
                  <ul className="text-sm space-y-2">
                    {t.methodology.profiles.intense.approachPoints.slice(0,3).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Zap className="w-3 h-3 text-orange-500 mt-1" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* DISTRACTED */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[24px] border-t-4 border-blue-500 shadow-lg"
              >
                <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600 bg-blue-50">
                  {t.methodology.profiles.distracted.title}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 italic">"{t.methodology.profiles.distracted.dataContent}"</p>
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-400">Approach</div>
                  <ul className="text-sm space-y-2">
                    {t.methodology.profiles.distracted.approachPoints.slice(0,3).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Zap className="w-3 h-3 text-blue-500 mt-1" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col items-center gap-4 mt-16 text-center">
            <Button 
              onClick={handleDownloadHTML} 
              size="lg"
              className="rounded-full px-8 h-12 font-bold bg-gray-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-transform"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Full PDF
            </Button>
            <p className="text-xs text-gray-400 max-w-md">
              {t.methodology.disclaimer.content}
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}