import sys
import os

# Add root directory to sys.path so backend modules can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app

# Vercel Serverless WSGI/ASGI entry point
handler = app
