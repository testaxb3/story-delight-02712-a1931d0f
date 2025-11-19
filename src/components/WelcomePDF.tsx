import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.8,
    color: '#333333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    marginLeft: 20,
    marginTop: 10,
  },
  listItem: {
    fontSize: 12,
    lineHeight: 1.8,
    color: '#333333',
    marginBottom: 8,
  },
  highlight: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  highlightText: {
    fontSize: 12,
    lineHeight: 1.8,
    color: '#1a1a1a',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1pt solid #E5E7EB',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#999999',
  },
});

export const WelcomePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to NEP System! 🎉</Text>
        <Text style={styles.subtitle}>
          Your Science-Based Guide to Understanding & Supporting Your Child
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Congratulations on Your Purchase!</Text>
        <Text style={styles.text}>
          Thank you for choosing NEP System. You've just taken a transformative step toward 
          better understanding your child's unique brain profile and building a more peaceful, 
          connected relationship.
        </Text>
      </View>

      <View style={styles.button}>
        <Link src="https://nepsystem.vercel.app/" style={styles.buttonText}>
          Access Your NEP System Account →
        </Link>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is NEP System?</Text>
        <Text style={styles.text}>
          NEP System is a comprehensive, science-backed platform designed to help parents 
          understand their child's neurological and emotional profile. Based on cutting-edge 
          research in neuroscience and child development, our system provides:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            • Brain profile identification (INTENSE, DISTRACTED, DEFIANT, or UNIVERSAL)
          </Text>
          <Text style={styles.listItem}>
            • Hundreds of situation-specific scripts with exact phrases to use
          </Text>
          <Text style={styles.listItem}>
            • Video training on evidence-based parenting strategies
          </Text>
          <Text style={styles.listItem}>
            • Exclusive ebooks with deep-dive content
          </Text>
          <Text style={styles.listItem}>
            • Daily progress tracking and personalized insights
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Getting Started - Step by Step</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            1. Visit https://nepsystem.vercel.app/
          </Text>
          <Text style={styles.listItem}>
            2. Sign in with the email you used to purchase
          </Text>
          <Text style={styles.listItem}>
            3. Complete the brain profile quiz to identify your child's unique profile
          </Text>
          <Text style={styles.listItem}>
            4. Explore the Scripts section for immediate, actionable strategies
          </Text>
          <Text style={styles.listItem}>
            5. Watch the training videos in the Videos section
          </Text>
          <Text style={styles.listItem}>
            6. Start tracking your progress in the MY PLAN section
          </Text>
        </View>
      </View>

      <View style={styles.highlight}>
        <Text style={styles.highlightText}>
          💡 Pro Tip: Start with the Scripts section when you're facing a challenging moment. 
          Each script gives you exact phrases to say, step-by-step actions, and explains the 
          neuroscience behind why it works.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What to Expect</Text>
        <Text style={styles.text}>
          NEP System is designed to give you immediate relief while building long-term skills. 
          You'll notice:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            • Immediate scripts for crisis moments (meltdowns, bedtime, screens, etc.)
          </Text>
          <Text style={styles.listItem}>
            • Scientific explanations that help you understand WHY your child acts this way
          </Text>
          <Text style={styles.listItem}>
            • Profile-specific strategies tailored to your child's unique brain wiring
          </Text>
          <Text style={styles.listItem}>
            • Progress tracking to see improvement over time
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Need Help?</Text>
        <Text style={styles.text}>
          If you have any questions or need assistance accessing your account, please reach 
          out to our support team. We're here to help you succeed.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          NEP System - Science-Based Parenting Solutions
        </Text>
        <Text style={styles.footerText}>
          © 2025 NEP System. All rights reserved.
        </Text>
      </View>
    </Page>
  </Document>
);
