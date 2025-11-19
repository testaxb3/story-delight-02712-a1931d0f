import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fontes (opcional - usar fontes padrão por enquanto)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    lineHeight: 1.6,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7c3aed',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  card: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderLeft: '3px solid #7c3aed',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  text: {
    fontSize: 10,
    marginBottom: 6,
    color: '#374151',
  },
  boldText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  list: {
    marginLeft: 15,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 10,
    marginBottom: 4,
    color: '#374151',
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  column: {
    flex: 1,
  },
  warningCard: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    borderLeft: '3px solid #f59e0b',
  },
  profileCard: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 4,
    borderLeft: '3px solid #3b82f6',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 4,
  },
  reference: {
    fontSize: 9,
    marginBottom: 8,
    color: '#4b5563',
  },
  referenceAuthors: {
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 9,
    color: '#9ca3af',
  },
});

interface MethodologyPDFProps {
  t: any;
}

export const MethodologyPDF = ({ t }: MethodologyPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.methodology.title}</Text>
        <Text style={styles.subtitle}>{t.methodology.subtitle}</Text>
      </View>

      {/* Critical Distinction */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.methodology.notGenericAI.title}</Text>
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <Text style={styles.boldText}>{t.methodology.notGenericAI.generic.title}</Text>
            {t.methodology.notGenericAI.generic.items.map((item: string, i: number) => (
              <Text key={i} style={styles.listItem}>• {item}</Text>
            ))}
          </View>
          <View style={styles.column}>
            <Text style={styles.boldText}>{t.methodology.notGenericAI.ours.title}</Text>
            {t.methodology.notGenericAI.ours.items.map((item: string, i: number) => (
              <Text key={i} style={styles.listItem}>• {item}</Text>
            ))}
          </View>
        </View>
      </View>

      {/* Neurological Foundation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.methodology.neurologicalReality.title}</Text>
        <Text style={styles.sectionSubtitle}>{t.methodology.neurologicalReality.subtitle}</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.methodology.neurologicalReality.prefrontalCortex.title}</Text>
          {t.methodology.neurologicalReality.prefrontalCortex.content.map((text: string, i: number) => (
            <Text key={i} style={styles.text}>{text}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.methodology.neurologicalReality.amygdalaHijack.title}</Text>
          {t.methodology.neurologicalReality.amygdalaHijack.content.map((text: string, i: number) => (
            <Text key={i} style={styles.text}>{text}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.methodology.neurologicalReality.coRegulation.title}</Text>
          {t.methodology.neurologicalReality.coRegulation.content.map((text: string, i: number) => (
            <Text key={i} style={styles.text}>{text}</Text>
          ))}
        </View>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>

    <Page size="A4" style={styles.page}>
      {/* Three Neurological Profiles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.methodology.profiles.title}</Text>
        <Text style={styles.sectionSubtitle}>{t.methodology.profiles.subtitle}</Text>

        {/* DEFIANT Profile */}
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>{t.methodology.profiles.defiant.title}</Text>
          
          <Text style={styles.boldText}>{t.methodology.profiles.defiant.data}</Text>
          <Text style={styles.text}>{t.methodology.profiles.defiant.dataContent}</Text>
          <Text style={styles.text}>{t.methodology.profiles.defiant.prevalence}</Text>

          <Text style={styles.boldText}>{t.methodology.profiles.defiant.approach}</Text>
          <Text style={styles.text}>{t.methodology.profiles.defiant.approachTitle}</Text>
          {t.methodology.profiles.defiant.approachPoints.map((point: string, i: number) => (
            <Text key={i} style={styles.listItem}>• {point}</Text>
          ))}

          <Text style={styles.boldText}>{t.methodology.profiles.defiant.implications}</Text>
          {t.methodology.profiles.defiant.implicationsPoints.map((point: string, i: number) => (
            <Text key={i} style={styles.listItem}>• {point}</Text>
          ))}
        </View>

        {/* INTENSE Profile */}
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>{t.methodology.profiles.intense.title}</Text>
          
          <Text style={styles.boldText}>{t.methodology.profiles.intense.data}</Text>
          <Text style={styles.text}>{t.methodology.profiles.intense.dataContent}</Text>

          <Text style={styles.boldText}>{t.methodology.profiles.intense.approach}</Text>
          <Text style={styles.text}>{t.methodology.profiles.intense.approachTitle}</Text>
          {t.methodology.profiles.intense.approachPoints.map((point: string, i: number) => (
            <Text key={i} style={styles.listItem}>• {point}</Text>
          ))}

          <Text style={styles.boldText}>{t.methodology.profiles.intense.implications}</Text>
          {t.methodology.profiles.intense.implicationsPoints.map((point: string, i: number) => (
            <Text key={i} style={styles.listItem}>• {point}</Text>
          ))}
        </View>

        {/* DISTRACTED Profile */}
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>{t.methodology.profiles.distracted.title}</Text>
          
          <Text style={styles.boldText}>{t.methodology.profiles.distracted.data}</Text>
          <Text style={styles.text}>{t.methodology.profiles.distracted.dataContent}</Text>
          <Text style={styles.text}>{t.methodology.profiles.distracted.prevalence}</Text>

          <Text style={styles.boldText}>{t.methodology.profiles.distracted.approach}</Text>
          <Text style={styles.text}>{t.methodology.profiles.distracted.approachTitle}</Text>
          {t.methodology.profiles.distracted.approachPoints.map((point: string, i: number) => (
            <Text key={i} style={styles.listItem}>• {point}</Text>
          ))}

          <Text style={styles.boldText}>{t.methodology.profiles.distracted.implications}</Text>
          {t.methodology.profiles.distracted.implicationsPoints.map((point: string, i: number) => (
            <Text key={i} style={styles.listItem}>• {point}</Text>
          ))}
        </View>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>

    <Page size="A4" style={styles.page}>
      {/* Script Creation Methodology */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.methodology.scriptCreation.title}</Text>
        <Text style={styles.sectionSubtitle}>{t.methodology.scriptCreation.subtitle}</Text>

        <View style={styles.card}>
          <Text style={styles.stepNumber}>1. {t.methodology.scriptCreation.step1.title}</Text>
          <Text style={styles.text}>{t.methodology.scriptCreation.step1.content}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.stepNumber}>2. {t.methodology.scriptCreation.step2.title}</Text>
          <Text style={styles.text}>{t.methodology.scriptCreation.step2.content}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.stepNumber}>3. {t.methodology.scriptCreation.step3.title}</Text>
          <Text style={styles.text}>{t.methodology.scriptCreation.step3.content}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.stepNumber}>4. {t.methodology.scriptCreation.step4.title}</Text>
          <Text style={styles.text}>{t.methodology.scriptCreation.step4.content}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.stepNumber}>5. {t.methodology.scriptCreation.step5.title}</Text>
          {t.methodology.scriptCreation.step5.points.map((point: string, i: number) => (
            <Text key={i} style={styles.listItem}>✓ {point}</Text>
          ))}
        </View>
      </View>

      {/* Academic References */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.methodology.references.title}</Text>
        {t.methodology.references.items.map((ref: any, i: number) => (
          <View key={i} style={styles.reference}>
            <Text>
              <Text style={styles.referenceAuthors}>{ref.authors}</Text> ({ref.year}). {ref.title}.
            </Text>
            <Text style={{ marginLeft: 15, marginTop: 2 }}>{ref.details}</Text>
          </View>
        ))}
      </View>

      {/* Professional Disclaimer */}
      <View style={styles.warningCard}>
        <Text style={styles.cardTitle}>{t.methodology.disclaimer.title}</Text>
        <Text style={styles.text}>{t.methodology.disclaimer.content}</Text>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>
  </Document>
);
