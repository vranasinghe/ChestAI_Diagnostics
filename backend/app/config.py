from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_FROM_NAME: str = "Wedakam Medical Report System"
    
    GEMINI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""

    class Config:
        import os
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

    def __init__(self, **values):
        super().__init__(**values)
        # Strip any mistakenly pasted outer quotes or whitespaces
        self.DATABASE_URL = self.DATABASE_URL.strip().strip("'").strip('"')
        
        # If the user pasted 'DATABASE_URL=postgresql://...' by mistake, strip the prefix
        if self.DATABASE_URL.startswith("DATABASE_URL="):
            self.DATABASE_URL = self.DATABASE_URL.replace("DATABASE_URL=", "", 1).strip()
        
        # Resolve postgres:// to postgresql://
        if self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)

        # Print masked version of the URL to the logs for safety and debugging
        url_preview = self.DATABASE_URL
        if len(url_preview) > 15:
            url_preview = url_preview[:15] + "..."
        print(f"DATABASE_URL Loaded: '{url_preview}' (length: {len(self.DATABASE_URL)})")


settings = Settings()
