const generateCVLatexTemplateV1 = (cvData) => {
    // Helper function to escape LaTeX special characters
    const escapeLaTeX = (text) => {
        if (!text) return '';
        // Convert to string if text is not already a string
        const str = String(text);
        return str
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/[&%$#_{}~^]/g, '\\$&')
            .replace(/\[/g, '{[}')
            .replace(/\]/g, '{]}');
    };

    // Helper function to format dates
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Present';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Present';
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch {
            return 'Present';
        }
    };

    // Helper function to create hyperlinks
    const createHyperlink = (text, url) => {
        if (!text || !url) return escapeLaTeX(text || '');
        return `\\href{${escapeLaTeX(url)}}{${escapeLaTeX(text)}}`;
    };

    // Helper function to create list items
    const createListItems = (items) => {
        if (!items || !items.length) return '';
        return items.map(item => `  \\item ${escapeLaTeX(item)}`).join('\n');
    };

    // Generate LaTeX document header
    const generateHeader = () => `\\documentclass[11pt,a4paper]{article}
  
  % Required packages
  \\usepackage[utf8]{inputenc}
  \\usepackage[T1]{fontenc}
  \\usepackage{hyperref}
  \\usepackage{geometry}
  \\usepackage{enumitem}
  \\usepackage{titlesec}
  \\usepackage{xcolor}
  
  % Configure page margins
  \\geometry{
    top=1cm,
    bottom=1cm,
    left=1cm,
    right=1cm,
    includehead,
    includefoot
  }
  
  % Configure spacing
  \\setlength{\\parindent}{0pt}
  \\setlength{\\parskip}{6pt}
  \\setlength{\\itemsep}{3pt}
  \\setlength{\\parsep}{0pt}
  \\setlength{\\headsep}{24pt}
  \\setlength{\\footskip}{24pt}
  
  % Configure section spacing and formatting
  \\titleformat{\\section}{\\Large\\bfseries}{}{0em}{}[\\titlerule]
  \\titlespacing*{\\section}
    {0pt}  % left margin
    {18pt} % space before
    {8pt}  % space after
  
  % Configure subsection spacing and formatting
  \\titleformat{\\subsection}
    {\\bfseries}  % format
    {}            % label
    {0em}         % sep
    {}            % before-code
  \\titlespacing*{\\subsection}
    {0pt}   % left margin
    {12pt}  % space before
    {6pt}   % space after
  
  % List spacing configuration
  \\setlist[itemize]{
    topsep=4pt,
    itemsep=2pt,
    parsep=2pt,
    leftmargin=1.5em
  }
  
  % Configure hyperlinks
  \\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,
    urlcolor=cyan,
    pdfborder={0 0 0}
  }
  
  % Custom commands
  \\newcommand{\\cvitem}[2]{\\textbf{#1}: #2\\\\[4pt]}
  \\newcommand{\\daterange}[2]{#1 -- #2}
  
  \\begin{document}`;

    // All section generator functions
    const sectionGenerators = {
        header: () => {
            const header = cvData.cv_template.sections.header;
            if (!header) return '';

            const contactParts = [];
            if (header.contact_info.email?.value) contactParts.push(createHyperlink(header.contact_info.email.value, header.contact_info.email.link));
            if (header.contact_info.phone?.value) contactParts.push(createHyperlink(header.contact_info.phone.value, header.contact_info.phone.link));
            if (header.contact_info.linkedin?.value) contactParts.push(createHyperlink(header.contact_info.linkedin.value, header.contact_info.linkedin.link));
            if (header.contact_info.portfolio?.value) contactParts.push(createHyperlink(header.contact_info.portfolio.value, header.contact_info.portfolio.link));
            if (header.contact_info.location?.value) contactParts.push(escapeLaTeX(header.contact_info.location.value));

            return `
  \\begin{center}
  \\textbf{\\huge ${escapeLaTeX(header.name)}}\\\\[0.5em]
  \\textit{\\large ${escapeLaTeX(header.title)}}\\\\[0.5em]
  ${contactParts.join(' | ')}
  \\end{center}`;
        },

        summary: () => {
            const summary = cvData.cv_template.sections.summary;
            if (!summary || !summary.content) return '';

            return `
  \\section{${escapeLaTeX(summary.section_title)}}
  ${escapeLaTeX(summary.content)}`;
        },

        experience: () => {
            const experience = cvData.cv_template.sections.experience;
            if (!experience || !experience.items || !experience.items.length) return '';

            const experienceItems = experience.items.map(job => {
                const startDate = job.dates?.start ? formatDate(job.dates.start) : '';
                const endDate = job.dates?.is_current ? 'Present' : (job.dates?.end ? formatDate(job.dates.end) : '');

                return `
\\subsection*{${createHyperlink(job.company || '', job.url || '')}${job.location ? ` -- ${escapeLaTeX(job.location)}` : ''}}
\\textit{${escapeLaTeX(job.title || '')}} \\hfill ${startDate}${startDate || endDate ? ' -- ' : ''}${endDate}

${job.achievements?.length ? `\\begin{itemize}[leftmargin=*]
${createListItems(job.achievements)}
\\end{itemize}` : ''}

${job.technologies?.length ? `\\textbf{Technologies:} ${job.technologies.map(tech => escapeLaTeX(tech || '')).join(' | ')}` : ''}`
            }).join('\n\n');

            return `
  \\section{${escapeLaTeX(experience.section_title || 'Experience')}}
  ${experienceItems}`;
        },

        education: () => {
            const education = cvData.cv_template.sections.education;
            if (!education || !education.items || !education.items.length) return '';

            const educationItems = education.items.map(edu => {
                const startDate = edu.dates?.start ? formatDate(edu.dates.start) : '';
                const endDate = edu.dates?.end ? formatDate(edu.dates.end) : '';

                return `
\\subsection*{${createHyperlink(edu.institution || '', edu.url || '')}${edu.location ? ` -- ${escapeLaTeX(edu.location)}` : ''}}
\\textit{${escapeLaTeX(edu.degree || '')}} \\hfill ${startDate}${startDate || endDate ? ' -- ' : ''}${endDate}
${edu.gpa ? `\\\\GPA: ${escapeLaTeX(edu.gpa)}` : ''}
${edu.honors?.length ? `\\begin{itemize}[leftmargin=*]
${createListItems(edu.honors)}
\\end{itemize}` : ''}`
            }).join('\n\n');

            return `
  \\section{${escapeLaTeX(education.section_title || 'Education')}}
  ${educationItems}`;
        },

        skills: () => {
            const skills = cvData.cv_template.sections.skills;
            if (!skills || !skills.categories || !skills.categories.length) return '';

            const skillCategories = skills.categories.map(category => `
  \\subsection*{${escapeLaTeX(category.name)}}
  ${category.description ? `${escapeLaTeX(category.description)}\\\\[0.5em]` : ''}
  ${category.items && category.items.length ? category.items.map(skill => escapeLaTeX(skill)).join(' | ') : ''}`
            ).join('\n\n');

            return `
  \\section{${escapeLaTeX(skills.section_title)}}
  ${skillCategories}`;
        },

        projects: () => {
            const projects = cvData.cv_template.sections.projects;
            if (!projects || !projects.items || !projects.items.length) return '';

            const projectItems = projects.items.map(project => {
                // Add null checks for dates
                const startDate = project.dates?.start ? formatDate(project.dates.start) : '';
                const endDate = project.dates?.end ? formatDate(project.dates.end) : '';
                const dateString = (startDate || endDate) ? `${startDate}${startDate && endDate ? ' -- ' : ''}${endDate}` : '';
                
                return `
\\subsection*{${createHyperlink(project.title || '', project.url || '')}}`
+ (dateString ? `\n${dateString}` : '') + `

\\raggedright
${escapeLaTeX(project.description || '')}

${project.key_contributions?.length ? `\\begin{itemize}[leftmargin=*]
${createListItems(project.key_contributions)}
\\end{itemize}` : ''}

${project.technologies?.length ? `\\textbf{Technologies:} ${project.technologies.map(tech => escapeLaTeX(tech || '')).join(' | ')}` : ''}`
            }).join('\n\n');

            return `
\\section{${escapeLaTeX(projects.section_title || 'Projects')}}
${projectItems}`;
        },

        certifications: () => {
            const certifications = cvData.cv_template.sections.certifications;
            if (!certifications || !certifications.items || !certifications.items.length) return '';

            const certItems = certifications.items.map(cert => {
                const startDate = cert.date?.start ? formatDate(cert.date.start) : '';
                const endDate = cert.date?.end ? formatDate(cert.date.end) : 'Present';

                return `\\cvitem{${createHyperlink(cert.title || '', cert.url || '')}}{${escapeLaTeX(cert.institution || '')}${startDate || endDate ? ` (${startDate}${startDate && endDate ? ' - ' : ''}${endDate})` : ''}}`
            }).join('\n');

            return `
\\section{${escapeLaTeX(certifications.section_title || 'Certifications')}}
${certItems}`;
        },

        courses: () => {
            const courses = cvData.cv_template.sections.courses;
            if (!courses?.items?.length) return '';
            
            // Filter out invalid items and format each course
            const validCourses = courses.items
                .filter(course => course && typeof course === 'object')
                .map(course => {
                    const title = escapeLaTeX(course.title || '');
                    const institution = course.institution ? ` at ${escapeLaTeX(course.institution)}` : '';
                    const location = course.location ? ` - ${escapeLaTeX(course.location)}` : '';
                    const startDate = course.dates?.start ? formatDate(course.dates.start) : '';
                    const endDate = course.dates?.end ? formatDate(course.dates.end) : 'Present';
                    const dates = startDate ? ` (${startDate} -- ${endDate})` : '';
                    
                    return `    \\item ${title}${institution}${location}${dates}`;
                });
                
            if (!validCourses.length) return '';

            return `
  \\section{${escapeLaTeX(courses.section_title || 'Courses')}}
  \\begin{itemize}[leftmargin=*]
${validCourses.join('\n')}
  \\end{itemize}`;
        },

        languages: () => {
            const languages = cvData.cv_template.sections.languages;
            if (!languages || !languages.items || !languages.items.length) return '';

            const languageItems = languages.items.map(lang =>
                `\\cvitem{${escapeLaTeX(lang.name)}}{${escapeLaTeX(lang.proficiency)}}`
            ).join('\n');

            return `
  \\section{${escapeLaTeX(languages.section_title)}}
  ${languageItems}`;
        },

        volunteer: () => {
            const volunteer = cvData.cv_template.sections.volunteer;
            if (!volunteer || !volunteer.items || !volunteer.items.length) return '';

            const volunteerItems = volunteer.items.map(vol => {
                const startDate = vol.dates?.start ? formatDate(vol.dates.start) : '';
                const endDate = vol.dates?.end ? formatDate(vol.dates.end) : '';

                return `
\\subsection*{${escapeLaTeX(vol.organization || '')}${vol.location ? ` -- ${escapeLaTeX(vol.location)}` : ''}}
\\textit{${escapeLaTeX(vol.title || '')}} \\hfill ${startDate}${startDate || endDate ? ' -- ' : ''}${endDate}

${vol.achievements?.length ? `\\begin{itemize}[leftmargin=*]
${createListItems(vol.achievements)}
\\end{itemize}` : ''}`
            }).join('\n\n');

            return `
  \\section{${escapeLaTeX(volunteer.section_title || 'Volunteer Experience')}}
  ${volunteerItems}`;
        },

        awards: () => {
            const awards = cvData.cv_template.sections.awards;
            if (!awards || !awards.items || !awards.items.length) return '';

            return `
  \\section{${escapeLaTeX(awards.section_title)}}
  \\begin{itemize}[leftmargin=*]
  ${createListItems(awards.items)}
  \\end{itemize}`;
        },

        publications: () => {
            const publications = cvData.cv_template.sections.publications;
            if (!publications || !publications.items || !publications.items.length) return '';

            const pubItems = publications.items.map(pub =>
                `\\cvitem{${createHyperlink(pub.title, pub.url)}}{${formatDate(pub.date)}}`
            ).join('\n');

            return `
  \\section{${escapeLaTeX(publications.section_title)}}
  ${pubItems}`;
        },

        interests: () => {
            const interests = cvData.cv_template.sections.interests;
            if (!interests || !interests.items || !interests.items.length) return '';

            return `
  \\section{${escapeLaTeX(interests.section_title)}}
  ${interests.items.map(interest => escapeLaTeX(interest)).join(' | ')}`;
        },

        references: () => {
            const references = cvData.cv_template.sections.references;
            if (!references || !references.items || !references.items.length) return '';

            const refItems = references.items.map(ref => `
  \\cvitem{${escapeLaTeX(ref.name)}}{
    ${escapeLaTeX(ref.title)}${ref.company ? `, ${escapeLaTeX(ref.company)}` : ''}\\\\
    ${ref.email ? `Email: ${escapeLaTeX(ref.email)}` : ''}${ref.phone ? ` | Phone: ${escapeLaTeX(ref.phone)}` : ''}
  }`).join('\n\n');

            return `
  \\section{${escapeLaTeX(references.section_title)}}
  ${refItems}`;
        }
    };

    // Get the section order from metadata
    const sectionOrder = cvData.cv_template.metadata.section_order || [];

    // Generate content based on metadata order
    const content = sectionOrder
        .map(sectionName => {
            const generator = sectionGenerators[sectionName];
            return generator ? generator() : '';
        })
        .filter(section => section !== '')
        .join('\n\n');

    // Combine everything
    return `${generateHeader()}
  
  ${content}
  
  \\end{document}`;
};

// Export the function
export { generateCVLatexTemplateV1 };