import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TestPage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [results, setResults] = useState({
    pdfUrl1: null
  });
  const [formData, setFormData] = useState({
    pdfUrl: '',
    pref1: ''
  });
  const eventSourceRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Connecting to server...');
    setResults({ pdfUrl1: null });
    setError(null);
    
    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // Set up SSE connection with query parameters
      const queryString = `pdfUrl=${encodeURIComponent(formData.pdfUrl)}&pref1=${encodeURIComponent(formData.pref1)}`;
      eventSourceRef.current = new EventSource(`http://localhost:3000/api/onboard-resume?${queryString}`);
      
      // Handle the Extracting data event (matches server event name)
      eventSourceRef.current.addEventListener('Extracting data', (event) => {
        const data = JSON.parse(event.data);
        console.log('Extracting data:', data);
        if (data.status === 'started') {
          setStatus('Extracting data from PDF...');
        } else if (data.status === 'completed') {
          setStatus('PDF data extraction completed');
        }
      });
      
      // Handle the template-specific event with dynamic event name
      const templateEventName = `Fetching data for : ${formData.pref1}`;
      eventSourceRef.current.addEventListener(templateEventName, (event) => {
        const data = JSON.parse(event.data);
        console.log(`Template ${formData.pref1} event:`, data);
        if (data.status === 'started') {
          setStatus(`Processing template: ${formData.pref1}...`);
        } else if (data.status === 'completed') {
          setResults(prev => ({ ...prev, pdfUrl1: data.data.pdfUrl }));
          setStatus(`Template ${formData.pref1} completed`);
        }
      });
      
      // Handle completion event
      eventSourceRef.current.addEventListener('complete', (event) => {
        const data = JSON.parse(event.data);
        console.log('Completion event:', data);
        setResults({
          pdfUrl1: data.pdfUrl1
        });
        setStatus('All processing completed!');
        setLoading(false);
        eventSourceRef.current.close();
      });
      
      // Handle errors
      eventSourceRef.current.onerror = (err) => {
        console.error('EventSource error:', err);
        setError('Connection error. Please try again.');
        setLoading(false);
        eventSourceRef.current.close();
      };
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong');
      setLoading(false);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    }
  };

  // Clean up the event source when component unmounts
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resume Converter</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-3">
          <label className="block mb-1">PDF URL:</label>
          <input 
            type="text" 
            name="pdfUrl" 
            value={formData.pdfUrl} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter URL to your resume PDF"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="block mb-1">LaTeX Template:</label>
          <input 
            type="text" 
            name="pref1" 
            value={formData.pref1} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter template name"
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : 'Convert Resume'}
        </button>
      </form>
      
      {status && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h2 className="font-bold">Status:</h2>
          <p>{status}</p>
          {loading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {results.pdfUrl1 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">Results:</h2>
          
          <div className="mb-4 p-4 border rounded shadow-sm">
            <h3 className="font-bold text-lg">{formData.pref1} Template:</h3>
            <div className="flex items-center gap-4 mt-2">
              <a 
                href={results.pdfUrl1} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View PDF
              </a>
              <a 
                href={results.pdfUrl1} 
                download
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;