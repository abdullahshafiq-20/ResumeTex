import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 text-center text-gray-600">
      <p className='text-sm'>
        I'm open source✨ Check out my code on{' '}
        <a 
          href="https://github.com/abdullahshafiq-20/ResumeConvertorLatex" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#2563EB] hover:underline"
        >
          GitHub
        </a>
      </p>
      <p className= 'text-sm' >
      All uploaded files are securely stored for a limited duration and automatically deleted from the server after <b>five</b> minutes. No data is retained, ensuring complete privacy and security.
      </p>
    </footer>
  );
};

export default Footer; 