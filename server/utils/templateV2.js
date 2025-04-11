const generateCVLatexTemplateV2 = (cvData) => {
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
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch {
            return '';
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
    const generateHeader = () => `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabularx}{\\textwidth}{X r}
      \\textbf{#1} \\newline \\textit{\\small #3} & \\textbf{\\small #2} \\newline 
      \\textit{\\small #4} \\\\
    \\end{tabularx}\\vspace{-7pt}
}

\\newcommand{\\projectEntry}[2]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeParagraph}[1]{
  \\item\\small{
    \\begin{flushleft}
      #1
    \\end{flushleft}
    \\vspace{-10pt}
  }
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}
\\sloppy`;

    // All section generator functions
    const sectionGenerators = {
        header: () => {
            const header = cvData.cv_template.sections.header;
            if (!header) return '';

            // Safely extract values with fallbacks
            const email = header.contact_info?.email?.value || '';
            const phone = header.contact_info?.phone?.value || '';
            const linkedin = header.contact_info?.linkedin?.value || '';
            const portfolio = header.contact_info?.portfolio?.value || '';
            const github = header.contact_info?.github?.value || '';
            const location = header.contact_info?.location?.value || '';
            const name = header.name || 'Name Not Provided';

            // Helper function to create safe hyperlinks
            const createSafeLink = (text, link) => {
                if (!text || !link) return '';
                const cleanLink = link.replace(/^https?:\/\//, ''); // Remove protocol if exists
                return `\\href{${link}}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{${escapeLaTeX(cleanLink)}}}`;
            };

            // Build contact sections conditionally
            const contactSections = [];

            if (phone) {
                contactSections.push(`\\raisebox{-0.1\\height}\\faPhone\\ ${escapeLaTeX(phone)}`);
            }

            if (email) {
                contactSections.push(`\\href{mailto:${email}}{\\raisebox{-0.2\\height}\\faEnvelope\\  \\underline{${escapeLaTeX(email)}}}`);
            }

            if (linkedin) {
                const linkedinLink = linkedin.startsWith('http') ? linkedin : `https://${linkedin}`;
                contactSections.push(createSafeLink(linkedin, linkedinLink));
            }
            if (portfolio) {
                const portfolioLink = portfolio.startsWith('http') ? portfolio : `https://${portfolio}`;
                contactSections.push(`\\href{${portfolioLink}}{\\raisebox{-0.2\\height}\\faGlobe\\ \\underline{${escapeLaTeX(portfolio)}}}`);
            }

            if (github) {
                const githubLink = github.startsWith('http') ? github : `https://${github}`;
                const cleanGithubLink = githubLink.replace(/^https?:\/\//, '');
                contactSections.push(`\\href{${githubLink}}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{${escapeLaTeX(cleanGithubLink)}}}`);
            }

            return `
\\begin{center}
    {\\Huge \\scshape ${escapeLaTeX(name)}} \\\\ \\vspace{1pt}
    ${location ? `${escapeLaTeX(location)} \\\\ \\vspace{1pt}` : ''}
    ${contactSections.length ? `\\small ${contactSections.join(' ~ ')}` : ''}
    \\vspace{-8pt}
\\end{center}`;
        },

        summary: () => {
            const summary = cvData.cv_template.sections.summary;
            if (!summary || !summary.content) return '';

            return `
  \\section{${escapeLaTeX(summary.section_title)}}
\\resumeSubHeadingListStart
    \\resumeParagraph{${escapeLaTeX(summary.content)}}
\\resumeSubHeadingListEnd`;
        },

        experience: () => {
            const experience = cvData.cv_template.sections.experience;
            if (!experience?.items?.length) return '';

            const experienceItems = experience.items.map(job => {
                if (!job) return '';

                const startDate = formatDate(job.dates?.start);
                const endDate = job.dates?.is_current ? 'Present' : formatDate(job.dates?.end);
                const company = job.company || 'Company Not Specified';
                const title = job.title || 'Position Not Specified';
                const location = job.location || '';

                return `    \\resumeSubheading
      {${escapeLaTeX(company)}}{${startDate} -- ${endDate}}
      {${escapeLaTeX(title)}}{${escapeLaTeX(location)}}
      ${job.achievements?.length ? `\\resumeItemListStart
        ${job.achievements.map(achievement =>
                    `\\resumeItem{${escapeLaTeX(achievement || '')}}`
                ).join('\n        ')}
      \\resumeItemListEnd` : ''}`
            }).filter(Boolean).join('\n\n');

            if (!experienceItems) return '';

            return `
\\section{${escapeLaTeX(experience.section_title || 'Experience')}}
  \\resumeSubHeadingListStart
${experienceItems}
  \\resumeSubHeadingListEnd`;
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
            if (!skills?.categories?.length) return '';

            // Only include categories that have items
            const validCategories = skills.categories.filter(category =>
                category?.items?.length && category.items.some(item => item && item.trim())
            );

            if (!validCategories.length) return '';

            const skillCategories = validCategories.map(category => `
  \\subsection*{${escapeLaTeX(category.name)}}
  ${category.description ? `${escapeLaTeX(category.description)}\\\\[0.5em]` : ''}
  ${category.items.filter(Boolean).map(skill => escapeLaTeX(skill)).join(' | ')}`
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
                const endDate = cert.date?.end ? formatDate(cert.date.end) : '';
                const dateStr = startDate || endDate ? ` (${startDate}${startDate && endDate ? ' - ' : ''}${endDate})` : '';

                return `    \\item ${createHyperlink(cert.title || '', cert.url || '')} -- ${escapeLaTeX(cert.institution || '')}${dateStr}`;
            }).join('\n');

            return `
\\section{${escapeLaTeX(certifications.section_title || 'Certifications')}}
\\begin{itemize}[leftmargin=*]
${certItems}
\\end{itemize}`;
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
                    const endDate = course.dates?.end ? formatDate(course.dates.end) : '';
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
                `    \\item ${escapeLaTeX(lang.name)} -- ${escapeLaTeX(lang.proficiency)}`
            ).join('\n');

            return `
\\section{${escapeLaTeX(languages.section_title)}}
\\begin{itemize}[leftmargin=*]
${languageItems}
\\end{itemize}`;
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

            const awardItems = awards.items.map(award => `
    \\resumeSubheading
      {${escapeLaTeX(award.organization)}}{${formatDate(award.date)}}
      {${escapeLaTeX(award.description)}}{}
    `).join('\n');

            return `
\\section{${escapeLaTeX(awards.section_title)}}
\\resumeSubHeadingListStart
${awardItems}
\\resumeSubHeadingListEnd`;
        },

        publications: () => {
            const publications = cvData.cv_template.sections.publications;
            if (!publications || !publications.items || !publications.items.length) return '';

            const pubItems = publications.items.map(pub => {
                const date = formatDate(pub.date);
                return `    \\item ${createHyperlink(pub.title || '', pub.url || '')}${date ? ` (${date})` : ''}`;
            }).join('\n');

            return `
\\section{${escapeLaTeX(publications.section_title || 'Publications')}}
\\begin{itemize}[leftmargin=*]
${pubItems}
\\end{itemize}`;
        },

        interests: () => {
            const interests = cvData.cv_template.sections.interests;
            if (!interests?.items?.length) return '';

            // Filter out empty, null, or non-string items and ensure strings
            const validItems = interests.items
                .filter(item => item && typeof item === 'string' && item.trim().length > 0);

            if (!validItems.length) return '';

            return `
  \\section{${escapeLaTeX(interests.section_title)}}
  ${validItems.map(interest => escapeLaTeX(interest)).join(' | ')}`;
        },

        references: () => {
            const references = cvData.cv_template.sections.references;
            if (!references || !references.items || !references.items.length) return '';

            const refItems = references.items.map(ref => `
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{${escapeLaTeX(ref.name)}} & ${escapeLaTeX(ref.title)} \\\\
      ${escapeLaTeX(ref.company)} & ${ref.email ? `Email: ${escapeLaTeX(ref.email.value)}` : ''}${ref.phone ? ` | Phone: ${escapeLaTeX(ref.phone)}` : ''} \\\\
    \\end{tabular*}`).join('\n\n');

            return `
\\section{${escapeLaTeX(references.section_title)}}
${refItems}`;
        },

        achievements: () => {
            const achievements = cvData.cv_template.sections.achievements;
            if (!achievements || !achievements.items || !achievements.items.length) return '';


            const achievementItems = achievements.items.map(achievement => `
    \\resumeSubheading
      {${escapeLaTeX(achievement.organization)}}{${formatDate(achievement.date)}}
      {${escapeLaTeX(achievement.description)}}{}
    `).join('\n');

            return `
\\section{${escapeLaTeX(achievements.section_title)}}
\\resumeSubHeadingListStart
${achievementItems}
\\resumeSubHeadingListEnd`;
        },

        patents: () => {
            const patents = cvData.cv_template.sections.patents;
            if (!patents || !patents.items || !patents.items.length) return '';

            const patentItems = patents.items.map(patent => `
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      ${createHyperlink(patent.title, patent.url)} & ${formatDate(patent.date)} \\\\
      Patent Number: ${escapeLaTeX(patent.number)} & \\\\
    \\end{tabular*}`).join('\n\n');

            return `
\\section{${escapeLaTeX(patents.section_title)}}
${patentItems}`;
        },

        research: () => {
            const research = cvData.cv_template.sections.research;
            if (!research || !research.items || !research.items.length) return '';

            const researchItems = research.items.map(item => `
    \\resumeSubheading
      {${createHyperlink(item.title, item.url)}}{${formatDate(item.date)}}
      {${escapeLaTeX(item.description)}}{}
    `).join('\n');

            return `
\\section{${escapeLaTeX(research.section_title)}}
\\resumeSubHeadingListStart
${researchItems}
\\resumeSubHeadingListEnd`;
        },

        custom: () => {
            const custom = cvData.cv_template.sections.custom;
            if (!custom || !custom.items || !custom.items.length) return '';

            const customItems = custom.items.map(item => `
    \\resumeSubheading
      {${createHyperlink(item.title, item.url)}}{${formatDate(item.date)}}
      {${escapeLaTeX(item.description)}}{}
    `).join('\n');

            return `
\\section{${escapeLaTeX(custom.section_title)}}
\\resumeSubHeadingListStart
${customItems}
\\resumeSubHeadingListEnd`;
        }
    };

    // Get the section order from metadata
    const sectionOrder = cvData.cv_template.metadata.section_order || [];

    // Generate content based on metadata order
    const content = sectionOrder
        .map(sectionName => {
            if (!sectionGenerators[sectionName]) return '';

            const sectionData = cvData.cv_template.sections[sectionName];
            if (!sectionData) return '';

            // More strict validation for each section type
            if (sectionName === 'header') {
                const header = sectionData;
                const hasContactInfo = header.contact_info &&
                    Object.values(header.contact_info).some(info => info?.value?.trim());
                const hasName = header.name?.trim();
                if (!hasContactInfo && !hasName) return '';
            }

            if (sectionName === 'summary') {
                if (!sectionData.content?.trim()) return '';
            }

            if (Array.isArray(sectionData.items)) {
                // For sections with items array, ensure there are valid items
                const hasValidItems = sectionData.items?.some(item => {
                    if (!item) return false;
                    // For text-only items
                    if (typeof item === 'string') return item.trim().length > 0;
                    // For object items, check if they have any non-empty required fields
                    return Object.values(item).some(val =>
                        val && (typeof val === 'string' ? val.trim().length > 0 : true)
                    );
                });
                if (!hasValidItems) return '';
            }

            return sectionGenerators[sectionName]();
        })
        .filter(section => section.trim() !== '') // Remove empty sections
        .join('\n\n');

    // Combine everything
    return `${generateHeader()}
  
  ${content}
  
  \\end{document}`;
};

// Export the function
export { generateCVLatexTemplateV2 };