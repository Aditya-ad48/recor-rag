# 1. BASE IMAGE
# We use a lightweight version of Python 3.10 (slim) to keep the image size small.
FROM python:3.10-slim

# need git for ragatouille
RUN apt-get update && apt-get install -y git

# 2. WORKING DIRECTORY
# Sets the directory inside the container where commands will be run.
WORKDIR /app

# 3. COPY REQUIREMENTS
# We copy just the requirements file first. 
# Docker caches this step; if requirements.txt doesn't change, 
# Docker won't re-run the pip install step below (saving build time).
COPY requirements.txt .

# 4. BUILD STEP (Install Dependencies)
# Install the Python packages listed in requirements.txt.
# --no-cache-dir reduces image size by not saving pip cache.
RUN pip install --no-cache-dir -r requirements.txt

# 5. COPY SOURCE CODE
# Copy the rest of the application files (like main.py) into the container.
COPY . .

# 6. Start Jupyter Lab
# --ip=0.0.0.0: Listen on all network interfaces (required for Docker)
# --allow-root: Required because we are running as root inside container
# --NotebookApp.token='': Disables password for easier local development
EXPOSE 8888
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.token=''"]
