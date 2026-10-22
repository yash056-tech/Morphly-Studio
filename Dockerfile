# Multi-stage production Dockerfile with Node.js and Python for OmniTools
FROM node:18-alpine AS base

# Install Python3, pip, and system dependencies for PyMuPDF/OpenCV
RUN apk add --no-cache python3 py3-pip build-base libffi-dev

WORKDIR /app

# Install Python requirements
COPY backend/requirements.txt ./backend/
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r backend/requirements.txt

# Install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build Next.js application
RUN npm run build

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["npm", "start"]
