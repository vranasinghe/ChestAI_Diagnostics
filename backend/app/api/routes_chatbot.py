from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.rag import query_rag_stream

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

@router.get("/stream")
def chatbot_stream(query: str):
    def event_generator():
        try:
            for chunk in query_rag_stream(query):
                # Replace newlines so SSE stays valid (each data: line must be single-line)
                safe_chunk = chunk.replace("\n", " \\n ")
                yield f"data: {safe_chunk}\n\n"
        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"
        finally:
            # Send the termination sentinel then close the event stream
            yield "data: [DONE]\n\n"
            yield "event: done\ndata: stream_complete\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # Disable Nginx buffering for real-time streaming
        }
    )
