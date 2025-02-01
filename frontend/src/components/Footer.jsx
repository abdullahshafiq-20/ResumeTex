import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 text-center text-gray-600">
      <p>
        I'm open source✨ Check out my code on{' '}
        <a 
          href="https://github.com/yourusername/resumetex" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#2563EB] hover:underline"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer; 