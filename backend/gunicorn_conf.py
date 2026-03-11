import multiprocessing

# Bind to 0.0.0.0 on port 8000
bind = "0.0.0.0:8000"

# Number of workers based on CPU cores
workers = multiprocessing.cpu_count() * 2 + 1

# Uvicorn worker class for ASGI apps
worker_class = "uvicorn.workers.UvicornWorker"

# Timeouts
timeout = 120
keepalive = 5

# Logging
loglevel = "info"
accesslog = "-"
errorlog = "-"
