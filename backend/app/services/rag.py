import os
import time
from typing import Generator
from app.config import settings
from langchain_core.embeddings import Embeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from sklearn.feature_extraction.text import TfidfVectorizer
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Custom local TF-IDF embedding class (no network download, fits in memory, 100% reliable)
class LocalTfidfEmbeddings(Embeddings):
    def __init__(self):
        self.vectorizer = TfidfVectorizer(token_pattern=r"(?u)\b\w+\b")
        # Initialize with sample vocabulary
        self.vectorizer.fit(["pneumonia", "cardiomegaly", "pneumothorax", "atelectasis", "cough", "treatment", "protocol"])
        self.dimension = len(self.vectorizer.get_feature_names_out())

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        # Fit vectorizer dynamically on the actual corpus to ensure vocabulary coverage
        try:
            self.vectorizer.fit(texts)
            self.dimension = len(self.vectorizer.get_feature_names_out())
        except Exception:
            pass
        vectors = self.vectorizer.transform(texts).toarray()
        return vectors.tolist()

    def embed_query(self, text: str) -> list[float]:
        try:
            vector = self.vectorizer.transform([text]).toarray()[0]
            return vector.tolist()
        except Exception:
            return [0.0] * self.dimension

# Singleton initialization of vectorstore
db_path = "/storage/chromadb"
embeddings = LocalTfidfEmbeddings()
vectorstore = None

def init_rag_system():
    global vectorstore
    # Create persistent directory
    os.makedirs(db_path, exist_ok=True)
    
    # Load guidelines from file
    guidelines_file = "backend/app/guidelines/guidelines.txt"
    if not os.path.exists(guidelines_file):
        guidelines_file = "app/guidelines/guidelines.txt"

    docs = []
    if os.path.exists(guidelines_file):
        with open(guidelines_file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Split by paragraph / guidelines blocks
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        for i, para in enumerate(paragraphs):
            docs.append(Document(page_content=para, metadata={"source": "WEDAKAM Guidelines", "chunk": i}))
    else:
        docs = [Document(page_content="No clinical guidelines loaded.", metadata={"source": "fallback"})]

    # Initialize Chroma
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=db_path
    )

def query_rag_stream(query: str) -> Generator[str, None, None]:
    global vectorstore
    if vectorstore is None:
        init_rag_system()

    # 1. Similarity Search
    relevant_docs = vectorstore.similarity_search(query, k=2)
    context = "\n\n".join([doc.page_content for doc in relevant_docs])

    # 2. Check for Gemini API Key from Pydantic Settings
    gemini_key = settings.GEMINI_API_KEY or os.getenv("GOOGLE_API_KEY")
    if gemini_key:
        try:
            prompt = ChatPromptTemplate.from_template(
                "You are Wedakam Health AI, a clinical assistant for the Wedakam Chest AI Diagnostics platform.\n"
                "Wedakam allows clinicians to upload chest X-ray scans, run ML disease detection, generate clinical reports, and manage patient portfolios.\n\n"
                "Guidelines Context:\n{context}\n\n"
                "Instructions:\n"
                "- If the user's input is a greeting, introduction, or general question about the platform/website, respond in a friendly, professional manner without citing clinical guidelines.\n"
                "- If the question is clinical or diagnostic, answer professionally using the guidelines context provided above and cite the reference sections.\n\n"
                "User Question: {question}"
            )
            llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_key)
            chain = prompt | llm | StrOutputParser()
            
            for chunk in chain.stream({"context": context, "question": query}):
                yield chunk
            return
        except Exception as e:
            yield f"[Gemini LLM Error: {e}. Trying Anthropic or fallback...]\n\n"

    # Check for Anthropic API Key from Pydantic Settings
    api_key = settings.ANTHROPIC_API_KEY
    if api_key:
        try:
            prompt = ChatPromptTemplate.from_template(
                "You are Wedakam Health AI, a clinical assistant for the Wedakam Chest AI Diagnostics platform.\n"
                "Wedakam allows clinicians to upload chest X-ray scans, run ML disease detection, generate clinical reports, and manage patient portfolios.\n\n"
                "Guidelines Context:\n{context}\n\n"
                "Instructions:\n"
                "- If the user's input is a greeting, introduction, or general question about the platform/website, respond in a friendly, professional manner without citing clinical guidelines.\n"
                "- If the question is clinical or diagnostic, answer professionally using the guidelines context provided above and cite the reference sections.\n\n"
                "User Question: {question}"
            )
            llm = ChatAnthropic(model="claude-3-5-sonnet-20241022", anthropic_api_key=api_key)
            chain = prompt | llm | StrOutputParser()
            
            for chunk in chain.stream({"context": context, "question": query}):
                yield chunk
            return
        except Exception as e:
            yield f"[Anthropic LLM Error: {e}. Falling back to offline engine...]\n\n"

    # 3. Clean fallback response generator with Local Intent Routing
    lowered_query = query.lower()
    
    # Check for Greetings / Introductions
    if any(g in lowered_query for g in ["hello", "hi", "hey", "greetings", "i am", "im ", "i'm", "my name is", "good morning", "good afternoon"]):
        response_template = (
            "Hello! I am your Wedakam Clinical Assistant. How can I help you today?\n\n"
            "I can assist you with clinical guidelines for chest diseases (such as pneumonia treatment protocol, cardiomegaly management, or pneumothorax guidelines). "
            "What clinical topic or system protocol can I help you with?"
        )
    # Check for Website / App info queries
    elif any(a in lowered_query for a in ["website", "web site", "app", "system", "what is this", "about this", "wedakam", "do"]):
        response_template = (
            "Wedakam Chest AI Diagnostics is a clinical support platform designed for radiologists and healthcare providers.\n\n"
            "Key capabilities of the system include:\n"
            "1. **Scans Analysis**: Upload chest X-rays in PNG or DICOM format and run PyTorch model predictions.\n"
            "2. **Visual Heatmaps**: View Grad-CAM attention visualizations outlining abnormal clinical regions.\n"
            "3. **Patient Archives**: Create, update, and soft-delete patient portfolios and manage historical comparison lists.\n"
            "4. **Report Management**: Generate and update status reports (Draft -> Pending Review -> Finalized -> Amended).\n\n"
            "How can I assist you with using the platform or checking clinical protocols?"
        )
    # Default fallback clinical summary
    else:
        response_template = (
            f"Based on the Wedakam clinical guidelines registry, here is the relevant protocol:\n\n"
            f"{context}\n\n"
            f"---\n"
            f"*Note: Please consult with the senior radiologist to confirm action plans based on these guidelines.*"
        )
    
    # Simulate streaming
    for word in response_template.split(" "):
        yield word + " "
        time.sleep(0.05)
