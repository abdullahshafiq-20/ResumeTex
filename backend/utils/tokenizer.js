export function formatResumeToLatex(text) {
    const lines = text.split('\n');
    let latex = [];
    let currentSection = '';
    
    // Define section handlers
    const sectionHandlers = {
        'section': (title) => `\\section*{${title}}`,
        'subsection': (title) => `\\subsection*{${title}}`,
        'profile': (content) => `\\section*{Profile}\n${content}`,
        'professional experience': (content) => `\\section*{Professional Experience}\n${content}`,
        'education': (content) => `\\section*{Education}\n${content}`,
        'skills': (content) => `\\section*{Skills}\n${content}`,
        'projects': (content) => `\\section*{Projects}\n${content}`,
        'courses': (content) => `\\section*{Courses}\n${content}`
    };

    const processLine = (line) => {
        line = line.replace(/\\hlink{([^}]+)}/g, '\\href{$1}{\\nolinkurl{$1}}');
        
        // Handle section headers
        if (line.startsWith('\\section')) {
            const sectionName = line.match(/{(.+)}/)[1];
            currentSection = sectionName.toLowerCase();
            return sectionHandlers[currentSection]?.(sectionName) || line;
        }
        
        // Handle subsection headers
        if (line.startsWith('\\subsection')) {
            const subsectionName = line.match(/{(.+)}/)[1];
            return `\\subsection*{${subsectionName}}`;
        }
        
        // Handle experience/education/project entries
        if (line.includes('\\hfill')) {
            const parts = line.split('\\hfill').map(p => p.trim());
            return parts.join(' \\hfill ');
        }
        
        // Handle list items
        if (line.trim().startsWith('\\item')) {
            return line.replace('\\item', '•');
        }
        
        return line;
    };

    // Process all lines
    lines.forEach(line => {
        if (line.trim() === '') return;
        const processed = processLine(line);
        latex.push(processed);
    });

    // Add header and footer
    return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{hyperref}
\\usepackage[margin=1in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}

\\definecolor{primary}{RGB}{0, 51, 102}
\\definecolor{linkcolor}{RGB}{0, 102, 204}

\\hypersetup{
    colorlinks=true,
    linkcolor=linkcolor,
    urlcolor=linkcolor
}

\\titleformat{\\section}
    {\\Large\\bfseries\\color{primary}}
    {}{0em}{}[\\titlerule]

\\begin{document}

${latex.join('\n\n')}

\\end{document}`;
}