import React, { useState } from 'react';
import { Calendar, FileText, MoreVertical, ExternalLink, Download, Share2 } from 'lucide-react';

const PDFCard = ({ 
  pdfUrl, 
  imageUrl, 
  title = "Document Title", 
  openedDate = "May 10, 2025",
  owner = "Opened May 10, 2025"
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenPdf = () => {
    window.open(pdfUrl, '_blank');
  };

  const handleDownload = () => {
    // Logic to download the PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-[230px] max-w-[230px] bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* A4 paper ratio wrapper */}
      <div className="relative" style={{ paddingTop: '141.4%' }}> {/* A4 ratio (1:1.414) */}
        {/* Document content */}
        <div 
          className="absolute inset-0 cursor-pointer overflow-hidden flex flex-col"
          onClick={handleOpenPdf}
        >
          {/* PDF Preview */}
          <div className="flex-1 bg-white overflow-hidden">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-fit"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <iframe 
                  src={`${pdfUrl}#toolbar=0&view=FitH`}
                  className="w-full h-full border-none"
                  title={title}
                />
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 bg-blue-600 rounded-full p-2 text-white transform translate-y-2 hover:translate-y-0 transition-all duration-200">
                <ExternalLink size={16} />
              </div>
            </div>
          </div>
          
          {/* Paper shadow effect */}
          <div className="absolute inset-0 shadow-[2px_1px_1px_rgba(0,0,0,0.1)] pointer-events-none"></div>
        </div>
      </div>
      
      {/* Document info footer */}
      <div className="p-2 border-t border-gray-200">
        {/* Title and menu */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-1.5 flex-shrink-0 text-blue-500">
              <FileText size={16} />
            </div>
            <div className="text-xs font-medium text-gray-800 truncate max-w-[140px]">
              {title}
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }} 
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
              aria-label="More options"
            >
              <MoreVertical size={14} />
            </button>
            
            {/* Menu dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-36 bg-white shadow-lg rounded-md z-10 border border-gray-200 py-1">
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPdf();
                  setIsMenuOpen(false);
                }} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center">
                  <ExternalLink size={14} className="mr-2" /> Open PDF
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                  setIsMenuOpen(false);
                }} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center">
                  <Download size={14} className="mr-2" /> Download
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Date info */}
        <div className="flex items-center">
          <Calendar size={12} className="mr-1 text-gray-400" />
          <span className="text-xs text-gray-500">{owner}</span>
        </div>
      </div>
    </div>
  );
};

export default PDFCard;