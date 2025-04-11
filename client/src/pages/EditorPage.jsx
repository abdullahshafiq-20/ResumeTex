import React, { useState, useEffect } from 'react';

const DEFAULT_RESUME_TEMPLATE = {
  metadata: {
    section_order: [
      "header", "summary", "experience", "education", "skills", "projects", 
      "certifications", "courses", "languages", "volunteer", "achievements", 
      "publications", "interests", "references", "patents", "research", "custom"
    ]
  },
  sections: {
    header: {
      name: "",
      title: "",
      contact_info: {
        email: { value: "", link: "" },
        phone: { value: "", link: "" },
        portfolio: { value: "", link: "" },
        linkedin: { value: "", link: "" },
        location: { value: "" }
      }
    },
    summary: {
      section_title: "Summary",
      content: ""
    },
    // All other sections pre-initialized with empty values
  },
  rendering_rules: {
    date_format: "MMM YYYY",
    hide_empty_sections: true,
    max_items_per_section: "No limit for now",
    truncate_descriptions_at: 600
  }
};

const EditorPage = () => {
  const [resume, setResume] = useState(DEFAULT_RESUME_TEMPLATE);
  const [activeSections, setActiveSections] = useState(["header"]);
  const [modalOpen, setModalOpen] = useState(false);
  
  // All available sections with their display names
  const availableSections = [
    { id: "header", name: "Personal Information" },
    { id: "summary", name: "Summary" },
    { id: "experience", name: "Professional Experience" },
    { id: "education", name: "Education" },
    { id: "skills", name: "Skills" },
    { id: "projects", name: "Projects" },
    { id: "certifications", name: "Certifications" },
    { id: "courses", name: "Courses" },
    { id: "languages", name: "Languages" },
    { id: "volunteer", name: "Volunteer Experience" },
    { id: "achievements", name: "Awards & Achievements" },
    { id: "publications", name: "Publications" },
    { id: "interests", name: "Interests" },
    { id: "references", name: "References" },
    { id: "patents", name: "Patents" },
    { id: "research", name: "Research" },
    { id: "custom", name: "Custom Section" }
  ];

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleAddSection = (sectionId) => {
    if (!activeSections.includes(sectionId)) {
      setActiveSections([...activeSections, sectionId]);
    }
    handleCloseModal();
  };
  
  const updateResumeField = (section, field, value) => {
    setResume(prev => {
      const newResume = {...prev};
      
      // Handle nested fields using dot notation (e.g., "contact_info.email.value")
      if (field.includes('.')) {
        const fields = field.split('.');
        let current = newResume.sections[section];
        
        // Navigate to the last parent object
        for (let i = 0; i < fields.length - 1; i++) {
          current = current[fields[i]];
        }
        
        // Set the value
        current[fields[fields.length - 1]] = value;
      } else {
        // Handle direct field update
        newResume.sections[section][field] = value;
      }
      
      return newResume;
    });
  };

  // Render the appropriate editor for each section type
  const renderSectionEditor = (sectionId) => {
    switch (sectionId) {
      case "header":
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resume.sections.header.name}
                onChange={(e) => updateResumeField("header", "name", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resume.sections.header.title}
                onChange={(e) => updateResumeField("header", "title", e.target.value)}
              />
            </div>
            <h4 className="text-md font-semibold mb-2">Contact Information</h4>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={resume.sections.header.contact_info.email.value}
                onChange={(e) => updateResumeField("header", "contact_info.email.value", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resume.sections.header.contact_info.phone.value}
                onChange={(e) => updateResumeField("header", "contact_info.phone.value", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resume.sections.header.contact_info.location.value}
                onChange={(e) => updateResumeField("header", "contact_info.location.value", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resume.sections.header.contact_info.linkedin.value}
                onChange={(e) => updateResumeField("header", "contact_info.linkedin.value", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio Website
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resume.sections.header.contact_info.portfolio.value}
                onChange={(e) => updateResumeField("header", "contact_info.portfolio.value", e.target.value)}
              />
            </div>
          </div>
        );
      
      case "summary":
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Summary
              </label>
              <textarea
                rows="4"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={resume.sections.summary.content}
                onChange={(e) => updateResumeField("summary", "content", e.target.value)}
              ></textarea>
            </div>
          </div>
        );
      
      // Add more section editors here
      
      default:
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {availableSections.find(s => s.id === sectionId)?.name || sectionId}
            </h3>
            <p className="text-sm text-gray-500">
              Editor for this section type is not yet implemented.
            </p>
          </div>
        );
    }
  };

  // Generate the preview HTML
  const generatePreview = () => {
    return (
      <div className="p-4">
        {/* Header Section */}
        {activeSections.includes("header") && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">
              {resume.sections.header.name || "Your Name"}
            </h1>
            {resume.sections.header.title && (
              <h2 className="text-lg font-medium">{resume.sections.header.title}</h2>
            )}
            
            <div className="flex justify-center mt-2">
              {resume.sections.header.contact_info.email.value && (
                <span className="mx-2 text-sm">
                  {resume.sections.header.contact_info.email.value}
                </span>
              )}
              {resume.sections.header.contact_info.phone.value && (
                <span className="mx-2 text-sm">
                  {resume.sections.header.contact_info.phone.value}
                </span>
              )}
              {resume.sections.header.contact_info.location.value && (
                <span className="mx-2 text-sm">
                  {resume.sections.header.contact_info.location.value}
                </span>
              )}
            </div>
            
            <div className="flex justify-center">
              {resume.sections.header.contact_info.linkedin.value && (
                <span className="mx-2 text-sm">
                  LinkedIn: {resume.sections.header.contact_info.linkedin.value}
                </span>
              )}
              {resume.sections.header.contact_info.portfolio.value && (
                <span className="mx-2 text-sm">
                  Portfolio: {resume.sections.header.contact_info.portfolio.value}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Summary Section */}
        {activeSections.includes("summary") && resume.sections.summary.content && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">
              {resume.sections.summary.section_title}
            </h2>
            <div className="w-full h-0.5 bg-gray-300 mb-3"></div>
            <p className="text-sm">
              {resume.sections.summary.content}
            </p>
          </div>
        )}
        
        {/* Placeholder for other sections */}
        {activeSections
          .filter(section => section !== "header" && section !== "summary")
          .map(section => (
            <div key={section} className="mb-6">
              <h2 className="text-xl font-semibold mb-1">
                {availableSections.find(s => s.id === section)?.name || section}
              </h2>
              <div className="w-full h-0.5 bg-gray-300 mb-3"></div>
              <p className="text-sm text-gray-500">
                This section preview will be generated based on your entries.
              </p>
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Resume Builder</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editor Section - 50% width */}
        <div className="bg-white shadow-md rounded-lg p-6 h-[calc(100vh-150px)] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Resume Editor</h2>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded flex items-center"
              onClick={handleOpenModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Section
            </button>
          </div>
          
          <div className="w-full h-0.5 bg-gray-200 mb-6"></div>
          
          {/* Section editors */}
          {activeSections.map(sectionId => (
            <div key={sectionId}>
              {renderSectionEditor(sectionId)}
              <div className="w-full h-0.5 bg-gray-200 my-4"></div>
            </div>
          ))}
        </div>
        
        {/* Preview Section - 50% width */}
        <div className="bg-gray-50 shadow-md rounded-lg p-6 h-[calc(100vh-150px)] overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="w-full h-0.5 bg-gray-200 mb-6"></div>
          
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 min-h-[80vh]">
            {generatePreview()}
          </div>
        </div>
      </div>
      
      {/* Section selection modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Resume Section</h2>
            <div className="max-h-60 overflow-y-auto">
              {availableSections.filter(section => !activeSections.includes(section.id)).length > 0 ? (
                <ul className="space-y-2">
                  {availableSections.filter(section => !activeSections.includes(section.id)).map(section => (
                    <li 
                      key={section.id}
                      className="border border-gray-300 rounded p-2 cursor-pointer hover:bg-blue-50"
                      onClick={() => handleAddSection(section.id)}
                    >
                      {section.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">All available sections have been added.</p>
              )}
            </div>
            <div className="mt-6 text-right">
              <button 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;