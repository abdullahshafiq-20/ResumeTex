# Multi-stage build for better optimization
FROM node:18 AS base

# Set working directory
WORKDIR /app

# Install system dependencies and TeX Live packages first (these change rarely)
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-xetex \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-recommended \
    texlive-luatex \
    texlive-publishers \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy package files first for better caching
COPY package*.json ./

# Production stage
FROM base AS production

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Create pdfs directory
RUN mkdir -p pdfs && chmod 777 pdfs

# Copy application files (this should be last to maximize cache hits)
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]