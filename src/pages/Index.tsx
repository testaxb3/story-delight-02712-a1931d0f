import { EbookReader } from "@/components/ebook/EbookReader";
import { ebookContent } from "@/data/ebookContent";

const Index = () => {
  return <EbookReader chapters={ebookContent} />;
};

export default Index;
