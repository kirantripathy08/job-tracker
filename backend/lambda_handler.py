"""
Lambda entrypoint. Mangum translates API Gateway's event/response format
into the ASGI format FastAPI expects — so `main.py` itself needs ZERO changes
to run in Lambda vs. locally under uvicorn. This is the whole point of Mangum.
"""
from mangum import Mangum
from main import app

handler = Mangum(app)
