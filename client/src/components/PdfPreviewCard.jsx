import React from "react";

const PdfPreviewCard = ({ url, title = "Document Preview" }) => {
  return (
    <div className="max-w-md rounded-2xl shadow-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="px-4 pt-4 text-lg font-semibold text-gray-800 dark:text-white">
        {title}
      </div>
      <div className="mt-2 h-72">
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
          title="PDF Preview"
          className="w-full h-full rounded-b-2xl"
        />
      </div>
    </div>
  );
};

export default PdfPreviewCard;