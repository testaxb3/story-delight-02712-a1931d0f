import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { WelcomePDF } from '@/components/WelcomePDF';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedPage } from '@/components/common/AnimatedPage';
import { Card } from '@/components/ui/card';

const GenerateWelcomePDF = () => {
  const handleDownload = async () => {
    try {
      toast.loading('Generating PDF...');
      
      const blob = await pdf(<WelcomePDF />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'NEP-System-Welcome-Guide.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <AnimatedPage>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome PDF Generator</h1>
              <p className="text-muted-foreground">
                Generate the welcome PDF to send to new Hotmart customers
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 text-left space-y-3">
              <h2 className="font-semibold text-lg">PDF Contents:</h2>
              <ul className="space-y-2 text-sm">
                <li>✓ Welcome message and congratulations</li>
                <li>✓ What is NEP System explanation</li>
                <li>✓ Step-by-step getting started guide</li>
                <li>✓ Direct link to access the app (https://nepsystem.vercel.app/)</li>
                <li>✓ What to expect from the platform</li>
                <li>✓ Pro tips for best results</li>
                <li>✓ Support information</li>
              </ul>
            </div>

            <Button 
              onClick={handleDownload} 
              size="lg"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Welcome PDF
            </Button>

            <p className="text-sm text-muted-foreground">
              This PDF is in English and professionally formatted for sending to customers
              after their Hotmart purchase.
            </p>
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default GenerateWelcomePDF;
