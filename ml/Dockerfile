# ml/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for OpenCV and other libraries
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libglib2.0-dev \
    libavcodec59 \
    libavformat59 \
    libswscale6 \
    libgtk-3-0 \
    libcanberra-gtk3-module \
    curl \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN pip install uv

# Copy uv configuration files first for better caching
COPY pyproject.toml uv.lock* ./

# Install Python dependencies with uv
RUN uv sync --frozen

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p temp

# Expose the port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

# Start the FastAPI application using uv
CMD ["uv", "run", "uvicorn", "fastapi_service:app", "--host", "0.0.0.0", "--port", "5001", "--reload"]