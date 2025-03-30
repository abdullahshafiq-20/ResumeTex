# 📄 ResumeTex - PDF to LaTeX Resume Converter

ResumeTex is an AI-powered tool that transforms standard PDF resumes into professionally formatted LaTeX documents. The project allows users to convert their existing resumes into elegant, structured LaTeX documents without needing to know LaTeX syntax.

![Alt text](https://res.cloudinary.com/dlthjlibc/image/upload/v1741535130/coverResuemTex_cskgiw.png "Optional Title")


---

## 🚀 Project Overview
ResumeTex simplifies resume formatting by leveraging AI to extract and structure content from PDF resumes into LaTeX. Our goal is to provide users with professionally typeset resumes effortlessly.

### ✨ Key Features
- **PDF to LaTeX conversion with AI-powered formatting**
- **Multiple professional resume templates**
- **Tailored resume optimization for specific job applications**
- **Preserves resume structure and content**
- **Download both LaTeX source files and compiled PDFs**
- **No LaTeX knowledge required**
- **100% free to use**

---

## 🏗 Project Structure

The application is structured as a full-stack web application:

### 🖥 Frontend
- React.js with Tailwind CSS for styling
- Responsive UI for all devices

### 🖧 Backend
- Node.js/Express server handling file processing and AI integration
- PDF parsing and data extraction
- AI-powered content structuring using Google Generative AI
- LaTeX document generation with multiple templates
- PDF rendering from LaTeX source
- Email notifications with the generated PDF

---

## 🔧 How to Use

### 1️⃣ Upload Your Resume
Upload your existing resume in PDF format. The clearer the format, the better the results.

### 2️⃣ Select a Template
Choose from our collection of professional LaTeX resume templates.

### 3️⃣ (Optional) Tailor Your Resume
Toggle on "Tailored Resume" and enter the job title and description to optimize your resume for a specific position.

### 4️⃣ Process and Download
Our AI converts your resume to LaTeX format. Download both the LaTeX source files and the compiled PDF.

---

## ⚙️ Technical Implementation

The backend follows these processing steps:
1. Extract text and links from uploaded PDF files
2. Send extracted data to Google's Generative AI for structuring
3. Generate formatted LaTeX code using template engines
4. Compile LaTeX to PDF via `node-latex`
5. Provide both the LaTeX source and PDF to the user

---

## 🔒 Data Privacy
- All uploaded files are **securely stored** for a limited duration (five minutes).
- Files are **automatically deleted** from the server to ensure complete privacy and security.
- **No personal data is permanently stored.**

---

## 📌 Limitations & Restrictions

### ⚠️ File Size Limit
- Maximum file size: **10MB per upload**

### 📂 Supported Formats
- Currently, only **PDF** files are supported.

### 📝 Complex Formatting
- Very complex layouts, tables, or unusual formatting might not convert perfectly.

### 🌍 Language Support
- Best results with **English-language resumes**; limited support for other languages.

### 🛠 Known Issues
- In some cases, the generated PDF may not be produced correctly.
- If that happens, try again or report the issue via the bug report feature.

---

## 💡 Tips for Best Results
- Use clean, well-structured PDF files for better conversion accuracy.
- Provide **detailed job descriptions** when using the tailored resume feature.
- Avoid unusual formatting, **text boxes**, and complex graphics.
- Ensure your PDF is **text-based** (not scanned images).
- Standard section headings (**Experience, Education, Skills**) work best.
- Consider using **bullet points** for better structure recognition.

---

## ❓ Frequently Asked Questions

### Is this service completely free?
Yes, ResumeTex is currently free to use for all users.

### Do I need to know LaTeX to use this tool?
Not at all! Our tool handles all the LaTeX coding for you. Just upload your resume and get the output.

### What is the "Tailored Resume" feature?
This feature optimizes your resume for specific job positions by structuring content based on the job title and description.

### Will my personal data be stored?
No. Files are processed temporarily and deleted after five minutes.

### Can I edit the generated LaTeX code?
Yes! You can download the LaTeX source files and customize them further if you're familiar with LaTeX.

### What if the conversion doesn't look right?
Try uploading a cleaner version of your resume or report the issue using our bug report feature.

---

## 🤝 Contributing
We welcome contributions! If you'd like to contribute:
1. Fork the repository.
2. Create a new branch (`feat-xyz`).
3. Commit and push your changes.
4. Open a pull request.

---


## 📜 License
This project is licensed under the **MIT License**.

---

⭐ **If you like this project, please consider giving it a star on GitHub!** ⭐

