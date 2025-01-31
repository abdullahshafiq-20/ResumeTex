export function generateLatexCV(cvDataString) {
    // Parse the JSON string and extract cv_template
    let cvData;
    try {
        // Clean the string by removing markdown code block markers and any leading/trailing whitespace
        const cleanJsonString = cvDataString
            .replace(/^```json\s*/, '')  // Remove opening code block
            .replace(/\s*```$/, '')      // Remove closing code block
            .trim();                     // Remove any extra whitespace
            
        const parsed = JSON.parse(cleanJsonString);
        cvData = parsed.cv_template;
    } catch (error) {
        console.error('Error parsing CV data:', error);
        console.error('Received data:', cvDataString); // Log the received data for debugging
        return '';
    }

    // Helper function to check if a string is empty or undefined
    const isEmpty = (str) => !str || str.trim().length === 0;
    
    // Helper function to check if an array is empty
    const isEmptyArray = (arr) => !Array.isArray(arr) || arr.length === 0;
    
    // Helper function to check if an object is empty
    const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;
  
    // Helper function to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'ongoing') return 'Present';
        return dateStr; // Dates are already in MMM YYYY format from the JSON
    };
  
    // Helper function to create contact info line
    const createContactInfo = (contactInfo) => {
        if (isEmptyObject(contactInfo)) return '';
        
        const parts = [];
        Object.entries(contactInfo).forEach(([key, data]) => {
            if (!isEmptyObject(data) && !isEmpty(data.value)) {
                switch(key) {
                    case 'email':
                        parts.push(`\\href{${data.link}}{\\faEnvelope~${data.value}}`);
                        break;
                    case 'phone':
                        parts.push(`\\href{${data.link}}{\\faPhone~${data.value}}`);
                        break;
                    case 'portfolio':
                        parts.push(`\\href{${data.link}}{\\faGlobe~Portfolio}`);
                        break;
                    case 'linkedin':
                        if (data.link) {
                            parts.push(`\\href{${data.link}}{\\faLinkedin~LinkedIn}`);
                        }
                        break;
                    case 'location':
                        parts.push(`\\faMapMarker~${data.value}`);
                        break;
                }
            }
        });
        
        return parts.length > 0 ? parts.join(' \\hspace{1em} ') : '';
    };
  
    // Helper function to generate a section
    const generateSection = (sectionData, sectionType) => {
      if (isEmptyObject(sectionData)) return '';
      
      let content = '';
      
      switch(sectionType) {
        case 'summary':
        case 'profile':
          if (!isEmpty(sectionData.text)) {
            content = sectionData.text;
          }
          break;

        case 'experience':
          if (!isEmptyArray(sectionData.items)) {
            content = sectionData.items.map(job => {
              if (isEmptyObject(job)) return '';
              
              let jobContent = '';
              if (!isEmpty(job.company) || !isEmpty(job.title)) {
                jobContent = `\\entry{${job.company || ''}}{${formatDate(job.dates?.start)} -- ${job.dates?.is_current ? 'Present' : formatDate(job.dates?.end)}}
                  {${job.title || ''}}{${job.location || ''}}`;
              }
              
              if (!isEmptyArray(job.achievements)) {
                jobContent += `\n${job.achievements.map(achievement => 
                  `\\noindent$\\bullet$ ${achievement}`).join('\\\\\n')}`;
              }
              
              if (!isEmptyArray(job.technologies)) {
                jobContent += `\n\\vspace{0.3em}\\noindent\\textit{Technologies: ${job.technologies.join(', ')}}`;
              }
              
              return jobContent;
            }).filter(Boolean).join('\n\\vspace{1em}\n');
          }
          break;
          
        case 'education':
          if (!isEmptyArray(sectionData.items)) {
            content = sectionData.items.map(edu => {
              if (isEmptyObject(edu)) return '';
              
              let eduContent = '';
              if (!isEmpty(edu.institution) || !isEmpty(edu.degree)) {
                eduContent = `\\entry{${edu.institution || ''}}{${formatDate(edu.dates?.start)} -- ${formatDate(edu.dates?.end)}}
                  {${edu.degree || ''}}{${edu.location || ''}}`;
              }
              
              if (!isEmptyArray(edu.honors)) {
                eduContent += `\n\\noindent${edu.honors.join(', ')}`;
              }
              
              if (!isEmpty(edu.gpa)) {
                eduContent += `\\\\[-0.5em]GPA: ${edu.gpa}`;
              }
              
              return eduContent;
            }).filter(Boolean).join('\n\\vspace{0.5em}\n');
          }
          break;
          
        case 'skills':
          if (!isEmptyArray(sectionData.categories)) {
            content = sectionData.categories.map(category => {
              if (isEmptyObject(category) || isEmptyArray(category.items)) return '';
              return `\\textbf{${category.name || 'Skills'}:} ${category.items.join(', ')}`;
            }).filter(Boolean).join('\\\\\n');
          }
          break;
          
        case 'projects':
          if (!isEmptyArray(sectionData.items)) {
            content = sectionData.items.map(project => {
              if (isEmptyObject(project)) return '';
              
              let projectContent = '';
              if (!isEmpty(project.title)) {
                projectContent = `\\textbf{${project.title}} ${!isEmpty(project.url) ? `\\href{${project.url}}{\\faExternalLinkAlt}` : ''} \\hfill ${formatDate(project.dates?.start)}${project.dates?.end ? ` -- ${formatDate(project.dates?.end)}` : ''}`;
              }
              
              if (!isEmpty(project.description)) {
                projectContent += `\\\\\n${project.description}`;
              }
              
              if (!isEmptyArray(project.key_contributions)) {
                projectContent += `\\\\\n${project.key_contributions.map(contribution => 
                  `\\noindent$\\bullet$ ${contribution}`).join('\\\\\n')}`;
              }
              
              if (!isEmptyArray(project.technologies)) {
                projectContent += `\n\\vspace{0.3em}\\noindent\\textit{Technologies: ${project.technologies.join(', ')}}`;
              }
              
              return projectContent;
            }).filter(Boolean).join('\n\\vspace{1em}\n');
          }
          break;

        case 'courses':
          if (!isEmptyArray(sectionData.items)) {
            content = sectionData.items.map(course => {
              let courseContent = `\\entry{${course.name || ''}}{${formatDate(course.dates?.start)} -- ${formatDate(course.dates?.end)}}
                {${course.institution || ''}}{${course.location || ''}}`;
              
              // Add additional course information if available
              if (!isEmpty(course.description)) {
                courseContent += `\\\\\n${course.description}`;
              }
              if (!isEmptyArray(course.achievements)) {
                courseContent += `\\\\\n${course.achievements.map(achievement => 
                  `\\noindent$\\bullet$ ${achievement}`).join('\\\\\n')}`;
              }
              if (!isEmpty(course.certification_url)) {
                courseContent += `\\\\\n\\href{${course.certification_url}}{View Certificate}`;
              }
              
              return courseContent;
            }).join('\n\\vspace{0.5em}\n');
          }
          break;
      }
      
      return content ? `\\section{${sectionData.section_title || sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}}\n${content}\n` : '';
    };
  
    // Add this new helper function
    const getSafe = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj) || {};
    };
  
    // Generate LaTeX document
    const latexTemplate = `\\documentclass[11pt,a4paper]{article}

% Required packages
\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}
\\usepackage{hyperref}
\\usepackage{fontawesome5}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{tabularx}

% Colors
\\definecolor{primary}{RGB}{70,70,70}
\\definecolor{accent}{RGB}{0,90,160}

% Custom section styling with horizontal line
\\titleformat{\\section}
  {\\Large\\bfseries\\color{accent}}
  {}
  {0pt}
  {\\raggedright}
\\titlespacing*{\\section}{0pt}{12pt}{8pt}

% Add horizontal rule after section titles
\\newcommand{\\sectionline}{\\par\\nobreak\\vspace{\\dimexpr-\\parskip-\\baselineskip}\\rule{\\textwidth}{0.4pt}\\vspace{0.5em}}

% Custom commands
\\newcommand{\\entry}[4]{
  {\\noindent\\textbf{#1}} \\hfill {\\textit{#2}}\\\\[-0.1em]
  {\\noindent\\textit{#3}} \\hfill {#4}\\\\[0.2em]
}

% Hyperlink styling
\\hypersetup{
  colorlinks=true,
  linkcolor=accent,
  filecolor=accent,
  urlcolor=accent,
}

\\begin{document}

% Header
${(() => {
  const header = getSafe(cvData, 'sections.header');
  return (!isEmpty(header.name) || !isEmpty(header.title)) ? 
    `{\\centering
    ${!isEmpty(header.name) ? `\\textbf{\\LARGE ${header.name}}\\\\[0.5em]` : ''}
    ${!isEmpty(header.title) ? `{\\large ${header.title}}\\\\[0.3em]` : ''}
    ${createContactInfo(header.contact_info)}\\\\[1em]
    }` : '';
})()}

% Sections with horizontal lines
${Object.entries(cvData.sections || {}).map(([sectionType, sectionData]) => {
  if (sectionType === 'header') return '';
  
  let content = generateSection(sectionData, sectionType);
  if (!content) return '';
  
  return `\\section{${sectionData.section_title || sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}}
  \\sectionline
  ${content}
  \\vspace{1em}`;
}).filter(Boolean).join('\n\n')}

% Modified Projects Section
${(() => {
  const projects = getSafe(cvData, 'sections.projects');
  if (isEmptyArray(projects.items)) return '';
  
  return `\\section{${projects.section_title || 'Projects'}}
  \\sectionline
  ${projects.items.map(project => {
    let content = '';
    
    // Date on first line
    content = `\\noindent${formatDate(project.dates?.start)}${project.dates?.end ? 
      ` -- ${formatDate(project.dates?.end)}` : ''}`;
    
    // Title on new line
    if (!isEmpty(project.title)) {
      content += `\\\\\n\\noindent\\textbf{${project.title}}${!isEmpty(project.url) ? 
        ` \\href{${project.url}}{\\faLink}` : ''}`;
    }
    
    // Description
    if (!isEmpty(project.description)) {
      content += `\\\\\n${project.description}`;
    }
    
    // Key contributions
    if (!isEmptyArray(project.key_contributions)) {
      content += `\\\\\n${project.key_contributions.map(contribution => 
        `\\noindent$\\bullet$ ${contribution}`).join('\\\\\n')}`;
    }
    
    // Technologies
    if (!isEmptyArray(project.technologies)) {
      content += `\\\\\n\\vspace{0.3em}\\noindent\\textit{Technologies: ${project.technologies.join(', ')}\\\}`;
    }
    
    return content;
  }).join('\n\\vspace{2em}\n\\noindent')}`;
})()}

\\end{document}`;

return latexTemplate;
}
  
  // Example usage:
  // const cvData = { ... }; // Your CV data
  // const latexCode = generateLatexCV(cvData);