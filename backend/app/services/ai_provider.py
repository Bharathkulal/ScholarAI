import os
import logging
import httpx
from abc import ABC, abstractmethod
from typing import Optional

logger = logging.getLogger(__name__)

class BaseAIProvider(ABC):
    """Abstract base class for all AI LLM providers."""
    
    @abstractmethod
    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        pass

class GeminiAIProvider(BaseAIProvider):
    """Google Gemini API Provider implementation."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not configured.")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        
        contents = []
        if system_instruction:
            contents.append({"role": "user", "parts": [{"text": f"System Instruction: {system_instruction}"}]})
        contents.append({"role": "user", "parts": [{"text": prompt}]})

        payload = {"contents": contents}

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                try:
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                except (KeyError, IndexError):
                    raise ValueError("Unexpected response structure from Gemini API.")
            else:
                raise ValueError(f"Gemini API error ({response.status_code}): {response.text}")

class OpenRouterAIProvider(BaseAIProvider):
    """OpenRouter API Provider implementation."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY is not configured.")

        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://scholarai.com",
            "Content-Type": "application/json"
        }

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": "meta-llama/llama-3.1-8b-instruct",
            "messages": messages
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                raise ValueError(f"OpenRouter API error ({response.status_code}): {response.text}")

class GroqAIProvider(BaseAIProvider):
    """Groq Cloud API Provider implementation."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not self.api_key:
            raise ValueError("GROQ_API_KEY is not configured.")

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": "llama3-70b-8192",
            "messages": messages
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                raise ValueError(f"Groq API error ({response.status_code}): {response.text}")

class HeuristicFallbackAIProvider(BaseAIProvider):
    """Domain-specific heuristic AI provider fallback when API keys are absent."""

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        logger.info("Executing Heuristic Fallback AI Provider...")
        p_lower = prompt.lower()
        if "ssp" in p_lower or "karnataka" in p_lower:
            return "Based on ScholarAI Karnataka State Scholarship rules, ensure your income certificate is under ₹2.5 LPA and your SSLC/PUC marks card is verified on the SSP portal."
        if "nsp" in p_lower or "central" in p_lower:
            return "For Central Sector NSP scholarships, maintain a minimum 80% score (8.0 CGPA) and upload your Aadhaar-linked bank passbook."
        return "ScholarAI Smart Assistant recommends verifying your profile completion, uploading all core documents, and reviewing scholarship deadlines."

class AIProviderFactory:
    """Factory selecting primary AI provider with graceful fallback chain."""

    @staticmethod
    def get_provider() -> BaseAIProvider:
        preferred = os.getenv("AI_PROVIDER", "gemini").lower()
        
        if preferred == "gemini" and os.getenv("GEMINI_API_KEY"):
            return GeminiAIProvider()
        elif preferred == "openrouter" and os.getenv("OPENROUTER_API_KEY"):
            return OpenRouterAIProvider()
        elif preferred == "groq" and os.getenv("GROQ_API_KEY"):
            return GroqAIProvider()
        
        # Fallback chain if primary choice is not configured
        if os.getenv("GEMINI_API_KEY"):
            return GeminiAIProvider()
        if os.getenv("OPENROUTER_API_KEY"):
            return OpenRouterAIProvider()
        if os.getenv("GROQ_API_KEY"):
            return GroqAIProvider()

        return HeuristicFallbackAIProvider()
