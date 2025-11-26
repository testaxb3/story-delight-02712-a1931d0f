import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Lock, Eye, Database, Users, Mail, Download, Fingerprint, Globe, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const policies = [
  {
    id: "collection",
    icon: Database,
    title: "1. Information We Collect",
    content: (
      <div className="space-y-6 text-sm md:text-base">
        <div className="space-y-3">
          <h4 className="font-bold text-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
            Account Essentials
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            To secure your account and progress, we store minimum necessary data:
          </p>
          <ul className="grid gap-2 pl-4">
            {["Name & Email Address", "Authentication ID (via Supabase)", "Account Creation Date"].map((item) => (
              <li key={item} className="text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-border" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
            Personalization Data
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            To generate custom strategies for your family:
          </p>
          <ul className="grid gap-2 pl-4">
            {["Child's Nickname/Name", "Age Range", "Brain Profile (e.g., INTENSE)", "Behavioral Notes"].map((item) => (
              <li key={item} className="text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-border" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "usage",
    icon: Eye,
    title: "2. How We Use Data",
    content: (
      <div className="space-y-4 text-sm md:text-base">
        <p className="text-muted-foreground leading-relaxed">
          We don't just collect data; we use it to make your parenting journey easier.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { t: "Personalization", d: "Tailoring scripts to your child's brain type." },
            { t: "Improvement", d: "Analyzing patterns to create better content." },
            { t: "Support", d: "Resolving technical issues quickly." },
            { t: "Security", d: "Preventing unauthorized access." }
          ].map((item) => (
            <div key={item.t} className="bg-muted/30 p-3 rounded-xl border border-border/50">
              <div className="font-semibold text-foreground mb-1">{item.t}</div>
              <div className="text-muted-foreground text-xs">{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "sharing",
    icon: Users,
    title: "3. Zero-Sale Policy",
    content: (
      <div className="space-y-4 text-sm md:text-base">
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-500 shrink-0" />
          <p className="font-semibold text-green-700 dark:text-green-400">We DO NOT sell your personal data.</p>
        </div>
        <p className="text-muted-foreground">We only share data with essential infrastructure providers required to run the app:</p>
        <div className="space-y-2">
          {[
            { name: "Supabase", role: "Secure Database & Auth" },
            { name: "Sentry", role: "Error Tracking" },
            { name: "PostHog", role: "Anonymous Analytics" },
            { name: "OneSignal", role: "Notifications (Opt-in)" }
          ].map((service) => (
            <div key={service.name} className="flex justify-between items-center p-2 border-b border-border/40 last:border-0">
              <span className="font-medium text-foreground">{service.name}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{service.role}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "security",
    icon: Lock,
    title: "4. Ironclad Security",
    content: (
      <div className="space-y-4 text-sm md:text-base">
        <p className="text-muted-foreground">Your trust is our currency. We protect it with:</p>
        <ul className="grid gap-3">
          {[
            "End-to-End SSL/TLS Encryption",
            "Row-Level Security (Only you see your data)",
            "Automated Daily Backups",
            "24/7 Security Monitoring"
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  },
  {
    id: "rights",
    icon: Fingerprint,
    title: "5. Your Rights (GDPR/LGPD)",
    content: (
      <div className="space-y-4 text-sm md:text-base">
        <p className="text-muted-foreground">You are in control. At any time, you can request to:</p>
        <div className="grid grid-cols-2 gap-2">
          {["Access Data", "Correct Data", "Delete Account", "Export Data"].map((right) => (
            <div key={right} className="text-center p-3 bg-muted/30 rounded-xl border border-border/50 font-medium text-foreground/80 text-sm">
              {right}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Contact support@nepsystem.pro to exercise these rights. We respond within 30 days.
        </p>
      </div>
    )
  }
];

import { CheckCircle } from "lucide-react";

export default function Privacy() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 relative z-10 pb-40">
          
          {/* Header Section */}
          <div className="text-center space-y-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50 backdrop-blur-md"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trust Center</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-foreground tracking-tight font-relative"
            >
              Privacy & Trust
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
            >
              We built NEP System to protect your family, not to sell your data. Here is our commitment to you in plain English.
            </motion.p>
          </div>

          {/* Highlights Grid (Bento-lite) */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Lock, title: "Encrypted", desc: "Bank-grade security" },
              { icon: Download, title: "Your Data", desc: "Export anytime" },
              { icon: RefreshCcw, title: "Transparent", desc: "No hidden tracking" }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-2xl flex flex-col items-center text-center gap-2 hover:bg-card/80 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-full text-primary mb-1">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Policies Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {policies.map((policy, i) => (
                <AccordionItem 
                  key={policy.id} 
                  value={policy.id}
                  className="border border-border/40 rounded-3xl bg-card/30 backdrop-blur-sm overflow-hidden data-[state=open]:bg-card/50 data-[state=open]:shadow-lg transition-all duration-300 px-2"
                >
                  <AccordionTrigger className="px-4 py-5 hover:no-underline [&[data-state=open]>div>span]:text-primary">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2.5 rounded-xl bg-background shadow-sm border border-border/50 text-muted-foreground transition-colors">
                        <policy.icon className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-bold text-foreground/90 transition-colors">
                        {policy.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-0 pl-[4.5rem]">
                    {policy.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Footer / Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center space-y-4"
          >
            <div className="inline-block p-6 rounded-3xl bg-gradient-to-b from-card/50 to-card/10 border border-border/50 backdrop-blur-md">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold text-foreground mb-1">Questions?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our Data Protection Officer is ready to help.
              </p>
              <a 
                href="mailto:support@nepsystem.pro" 
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                support@nepsystem.pro
              </a>
            </div>
            
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </motion.div>

        </div>
      </div>
    </MainLayout>
  );
}