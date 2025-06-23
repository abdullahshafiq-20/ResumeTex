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
    <div className="relative w-[240px] max-w-[240px] bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* A4 paper ratio wrapper */}
      <div className="relative" style={{ paddingTop: '141.4%' }}> {/* A4 ratio (1:1.414) */}
        {/* Document content */}
        <div 
          className="absolute inset-0 cursor-pointer overflow-hidden flex flex-col rounded-t-lg"
          onClick={handleOpenPdf}
        >
          {/* PDF Preview */}
          <div className="flex-1 bg-white overflow-hidden rounded-t-lg">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-fit rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-t-lg">
                <iframe 
                  src={`${pdfUrl}#toolbar=0&view=FitH`}
                  className="w-full h-full border-none rounded-t-lg"
                  title={title}
                />
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center rounded-t-lg transition-all duration-200">
              <div className="opacity-0 hover:opacity-100 bg-blue-600 rounded-full p-3 text-white transform translate-y-2 hover:translate-y-0 transition-all duration-200 shadow-lg">
                <ExternalLink size={18} />
              </div>
            </div>
          </div>
          
          {/* Paper shadow effect */}
          <div className="absolute inset-0 shadow-inner pointer-events-none rounded-t-lg"></div>
        </div>
      </div>
      
      {/* Document info footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        {/* Title and menu */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center flex-1 min-w-0">
            <div className="w-5 h-5 mr-2 flex-shrink-0 text-blue-600">
              <FileText size={16} />
            </div>
            <div className="text-sm font-medium text-gray-900 truncate">
              {title}
            </div>
          </div>
          <div className="relative ml-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }} 
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full transition-colors duration-150"
              aria-label="More options"
            >
              <MoreVertical size={14} />
            </button>
            
            {/* Menu dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-40 bg-white shadow-lg rounded-lg z-10 border border-gray-200 py-1 overflow-hidden">
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPdf();
                  setIsMenuOpen(false);
                }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors duration-150">
                  <ExternalLink size={14} className="mr-3 text-gray-500" /> Open PDF
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                  setIsMenuOpen(false);
                }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors duration-150">
                  <Download size={14} className="mr-3 text-gray-500" /> Download
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Date info */}
        <div className="flex items-center">
          <Calendar size={12} className="mr-1.5 text-gray-400" />
          <span className="text-xs text-gray-500">{owner}</span>
        </div>
      </div>
    </div>
  );
};

export default PDFCard;