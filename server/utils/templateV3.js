const generateCVLatexTemplateV3 = (cvData) => {
    // Helper functions
    const escapeLaTeX = (text) => {
        if (!text) return '';
        const str = String(text);
        return str
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/[&%$#_{}~^]/g, '\\$&')
            .replace(/\[/g, '{[}')
            .replace(/\]/g, '{]}');
    };

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

    // Generate LaTeX document header
    const generateHeader = () => `\\documentclass[a4paper,11pt]{article}
\\usepackage{latexsym}
\\usepackage{xcolor}
\\usepackage{float}
\\usepackage{ragged2e}
\\usepackage[empty]{fullpage}
\\usepackage{wrapfig}
\\usepackage{lipsum}
\\usepackage{tabularx}
\\usepackage{titlesec}
\\usepackage{geometry}
\\usepackage{marvosym}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\usepackage{graphicx}
\\usepackage{cfr-lm}
\\usepackage[T1]{fontenc}
\\setlength{\\multicolsep}{0pt} 
\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\geometry{left=1.4cm, top=0.8cm, right=1.2cm, bottom=1cm}

\\usepackage[most]{tcolorbox}
\\tcbset{
    frame code={}
    center title,
    left=0pt,
    right=0pt,
    top=0pt,
    bottom=0pt,
    colback=gray!20,
    colframe=white,
    width=\\dimexpr\\textwidth\\relax,
    enlarge left by=-2mm,
    boxsep=4pt,
    arc=0pt,outer arc=0pt,
}

\\urlstyle{same}
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-7pt}]

% Custom commands
\\newcommand{\\resumeItem}[2]{
  \\item{
    \\textbf{#1}{\\hspace{0.5mm}#2 \\vspace{-0.5mm}}
  }
}

\\newcommand{\\resumePOR}[3]{
\\vspace{0.5mm}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1}\\hspace{0.3mm}#2 & \\textit{\\small{#3}} 
    \\end{tabular*}
    \\vspace{-2mm}
}

\\newcommand{\\resumeSubheading}[4]{
\\vspace{0.5mm}\\item
    \\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1} & \\textit{\\footnotesize{#4}} \\\\
        \\textit{\\footnotesize{#3}} &  \\footnotesize{#2}\\\\
    \\end{tabular*}
    \\vspace{-2.4mm}
}

\\newcommand{\\resumeProject}[4]{
\\vspace{0.5mm}\\item
    \\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1} & \\textit{\\footnotesize{#3}} \\\\
        \\footnotesize{\\textit{#2}} & \\footnotesize{#4}
    \\end{tabular*}
    \\vspace{-2.4mm}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-4pt}}
\\renewcommand{\\labelitemi}{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*,labelsep=0mm]}
\\newcommand{\\resumeHeadingSkillStart}{\\begin{itemize}[leftmargin=*,itemsep=1.7mm, rightmargin=2ex]}
\\newcommand{\\resumeItemListStart}{\\begin{justify}\\begin{itemize}[leftmargin=3ex, rightmargin=2ex, noitemsep,labelsep=1.2mm,itemsep=0mm]\\small}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}\\vspace{2mm}}
\\newcommand{\\resumeHeadingSkillEnd}{\\end{itemize}\\vspace{-2mm}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\end{justify}\\vspace{-2mm}}
\\newcommand{\\cvsection}[1]{%
\\vspace{2mm}
\\begin{tcolorbox}
    \\textbf{\\large #1}
\\end{tcolorbox}
    \\vspace{-4mm}
}
\\newcolumntype{L}{>{\\raggedright\\arraybackslash}X}%
\\newcolumntype{R}{>{\\raggedleft\\arraybackslash}X}%
\\newcolumntype{C}{>{\\centering\\arraybackslash}X}%

\\begin{document}
\\fontfamily{cmr}\\selectfont`;

    // Section generators
    const sectionGenerators = {
        header: () => {
            const header = cvData.cv_template.sections.header;
            if (!header) return '';

            const name = header.name || '';
            const email = header.contact_info?.email?.value || '';
            const phone = header.contact_info?.phone?.value || '';
            const linkedin = header.contact_info?.linkedin?.value || '';
            const github = header.contact_info?.github?.value || '';
            const degree = header.degree || 'Bachelor of Technology';
            const institution = header.institution || '';

            return `
{
\\begin{tabularx}{\\linewidth}{L r} \\\\
  \\textbf{\\Large ${escapeLaTeX(name)}} & {\\raisebox{0.0\\height}{\\footnotesize \\faPhone}\\ +${escapeLaTeX(phone)}}\\\\
  ${degree} & \\href{mailto:${email}}{\\raisebox{0.0\\height}{\\footnotesize \\faEnvelope}\\ ${escapeLaTeX(email)}} \\\\
  ${institution ? `${escapeLaTeX(institution)}` : ''} & ${github ? `\\href{${github}}{\\raisebox{0.0\\height}{\\footnotesize \\faGithub}\\ GitHub Profile}` : ''} \\\\
  ${linkedin ? `& \\href{${linkedin}}{\\raisebox{0.0\\height}{\\footnotesize \\faLinkedin}\\ LinkedIn Profile}` : ''}
\\end{tabularx}
}`;
        },

        education: () => {
            const education = cvData.cv_template.sections.education;
            if (!education?.items?.length) return '';

            const educationItems = education.items.map(edu => {
                const startDate = formatDate(edu.dates?.start);
                const endDate = formatDate(edu.dates?.end);
                const dateRange = `${startDate}-${endDate}`;
                const gpa = edu.gpa ? `CGPA: ${edu.gpa}` : '';

                return `    \\resumeSubheading
      {${escapeLaTeX(edu.degree || '')}}{${gpa}}
      {${escapeLaTeX(edu.institution || '')}}{${dateRange}}`;
            }).join('\n');

            return `
\\section{\\textbf{${escapeLaTeX(education.section_title || 'Education')}}}
  \\resumeSubHeadingListStart
${educationItems}
  \\resumeSubHeadingListEnd
\\vspace{-5.5mm}`;
        },

        // Add other section generators here...
    };

    // Get the section order from metadata
    const sectionOrder = cvData.cv_template.metadata.section_order || [];

    // Generate content based on metadata order
    const content = sectionOrder
        .map(sectionName => {
            if (!sectionGenerators[sectionName]) return '';
            return sectionGenerators[sectionName]();
        })
        .filter(section => section.trim() !== '')
        .join('\n\n');

    // Combine everything
    return `${generateHeader()}

${content}

\\end{document}`;
};

export { generateCVLatexTemplateV3 };
