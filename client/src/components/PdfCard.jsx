import React from 'react';
import { Calendar, FileText, Eye, ExternalLink } from 'lucide-react';

const PDFCard = ({ 
  pdfUrl, 
  imageUrl, 
  title = "Document Title", 
  openedDate = "May 10, 2025",
  owner = "Opened May 10, 2025"
}) => {

  const handleOpenPdf = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden group transition-all duration-300 relative">
      {/* Subtle background blob */}
      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/20 blur-lg opacity-0  transition-opacity duration-300"></div>
      
      {/* Resume Image Container */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-fit transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <iframe 
              src={`${pdfUrl}#toolbar=0&view=FitH`}
              className="w-full h-full border-none transform transition-transform duration-300"
              title={title}
            />
          </div>
        )}
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
        
        {/* Hover overlay with see button */}

      </div>

      {/* Title and Info Section */}
      <div className="p-4 relative">
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gradient-to-br from-green-200/40 to-blue-200/30 blur-sm opacity-50"></div>
        
        <div className="relative">
          <div className="flex items-start space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                {title}
              </h3>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span className="truncate">{owner}</span>
              </div>
            </div>
          </div>
          
          {/* Simple See Button for Mobile/Alternative */}
          <button
            onClick={handleOpenPdf}
            className="w-full mt-2 px-3 py-2 bg-transparent border border-blue-500 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 hover:border-blue-600 transition-all duration-200 flex items-center justify-center space-x-2 group/btn"
          >
            <Eye className="h-3 w-3 transition-transform duration-200 group-hover/btn:scale-110" />
            <span>View Resume</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFCard;