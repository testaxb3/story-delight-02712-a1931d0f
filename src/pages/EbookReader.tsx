import { EbookReader } from "@/components/ebook/EbookReader";
import { ebookContent } from "@/data/ebookContent";
import { useNavigate } from "react-router-dom";

const EbookReaderPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return <EbookReader chapters={ebookContent} onClose={handleClose} />;
};

export default EbookReaderPage;
