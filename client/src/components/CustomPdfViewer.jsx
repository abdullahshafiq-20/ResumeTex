"use client"

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CustomPDFViewer = ({ pdfUrl, onError }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  
  if (typeof window === 'undefined') return null;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="relative h-[calc(100vh-2rem)] w-full max-w-3xl mx-auto">
      <div className="absolute inset-0 overflow-auto bg-white rounded-lg border border-gray-200">
        <div className="min-h-full w-full p-4">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error('Error loading PDF:', error);
              onError && onError(error);
            }}
            className="flex justify-center"
          >
            <Page 
              pageNumber={pageNumber} 
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="pdf-page"
            />
          </Document>
          
          {numPages && (
            <div className="sticky bottom-0 left-0 right-0 flex justify-center gap-4 mt-4 p-4 bg-white/80 backdrop-blur-sm">
              <button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
                className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
              <span className="flex items-center">
                Page {pageNumber} of {numPages}
              </span>
              <button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
                className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomPDFViewer;
