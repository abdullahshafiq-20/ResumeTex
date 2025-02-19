FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install

# Install required TeX Live packages
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-xetex \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-recommended \
    texlive-luatex \
    texlive-font-utils \
    lmodern \
    && rm -rf /var/lib/apt/lists/*

# Ensure the fullpage.sty and marvosym packages are available
RUN tlmgr init-usertree || true && \
    tlmgr install fullpage marvosym || true

# Create pdfs directory
RUN mkdir -p pdfs && chmod 777 pdfs

# Copy application files
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]