import os
from typing import List, Dict, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("API key for Groq is missing. Please set GROQ_API_KEY in .env")
APPLE_WATCH_KB = {
    "models": {
        "series_10": {
            "name": "Apple Watch Series 10",
            "sizes_mm": [42, 46],
            "displays": {
                "42mm": {"pixels": "374×446", "area_sqmm": 989},
                "46mm": {"pixels": "416×496", "area_sqmm": 1220},
            },
            "highlights": [
                "Thinnest Apple Watch yet; biggest display for Series",
                "New wide-angle LTPO OLED (AOD) with better off-axis brightness",
                "Sleep apnea notifications",
                "Depth and water temperature sensors",
                "Fastest charging Apple Watch (about 80% in ~30 min)",
                "watchOS 11 features: Health status from overnight vitals, improved Smart Stack, more widgets"
            ],
            "materials": ["Aluminum", "Titanium"],
            "chip": "S10",
        },
        "ultra_2": {
            "name": "Apple Watch Ultra 2",
            "notes": [
                "Rugged model with action button, long battery life, dual-band GPS",
                "Still widely sold; black / titanium options depending on region/retailer"
            ]
        },
        "ultra_3": {
            "name": "Apple Watch Ultra 3",
            "status": "anticipated/rumored as of Aug 2025 (check current availability)",
            "rumors": [
                "Larger display retaking ‘screen size crown’ vs Series 10",
                "Potential screen/brightness and battery improvements"
            ]
        }
    },
    "software": {
        "watchos_11": {
            "features": [
                "Daily health status from overnight vitals",
                "Training Load & workout impact over time",
                "Expanded Smart Stack and widgets; Live Activities"
            ]
        }
    },
    "buying_tips": [
        "Series 10 is the best all-around pick for iPhone users; SE for budget; Ultra line for outdoor/endurance use.",
        "If you need long battery life, rugged build, and dive/sport features, consider Ultra 2 (or check Ultra 3 availability)."
    ]
}

SYSTEM_INSTRUCTIONS = f"""
You are a specialist Apple Watch concierge focused ONLY on the latest Apple Watch lineup.
Answer strictly about Apple Watch (especially Series 10, Ultra 2, and the anticipated Ultra 3) and watchOS 11.
If asked anything unrelated, politely say you can only answer questions about the latest Apple Watch.

Ground your answers in this knowledge base (KB). If the KB doesn’t contain the answer, say:
“I’m not fully sure based on my current info, but here’s what’s typical…” and then provide best-effort guidance without inventing specs.

Knowledge Base (verbatim JSON follows):
{APPLE_WATCH_KB}
"""


app = FastAPI(title="Apple Watch Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)

class UserInput(BaseModel):
    message: str
    role: str = "user"
    conversation_id: str
    temperature: Optional[float] = 0.3
    top_p: Optional[float] = 0.9

class Conversation:
    def __init__(self):
        self.messages: List[Dict[str, str]] = [{"role": "system", "content": SYSTEM_INSTRUCTIONS}]
        self.active: bool = True

conversations: Dict[str, Conversation] = {}

def get_or_create_conversation(conversation_id: str) -> Conversation:
    if conversation_id not in conversations:
        conversations[conversation_id] = Conversation()
    return conversations[conversation_id]

def is_on_topic(text: str) -> bool:
    t = text.lower()
    return any(k in t for k in [
        "apple watch", "watchos", "series 10", "ultra 2", "ultra2", "ultra 3", "ultra3",
        "se (apple watch)", "se apple watch", "watch bands", "complications", "ecg", "blood oxygen",
        "sleep apnea", "action button", "gps", "lte"
    ])

def query_groq_api(conversation: Conversation, temperature: float, top_p: float) -> str:
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=conversation.messages,
            temperature=temperature,
            max_tokens=1024,
            top_p=top_p,
            stream=True,
        )
        response = ""
        for chunk in completion:
            response += chunk.choices[0].delta.content or ""
        return response.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error with Groq API: {str(e)}")

@app.post("/chat/")
async def chat(input: UserInput):
    conv = get_or_create_conversation(input.conversation_id)

    if not conv.active:
        raise HTTPException(status_code=400, detail="The chat session has ended. Please start a new session.")

    user_text = input.message.strip()
    if not is_on_topic(user_text):
        return {
            "response": "I can help with questions about the latest Apple Watch (Series 10, Ultra, SE) and watchOS 11. What would you like to know?",
            "conversation_id": input.conversation_id
        }

    conv.messages.append({"role": input.role, "content": user_text})
    answer = query_groq_api(conv, input.temperature, input.top_p)
    conv.messages.append({"role": "assistant", "content": answer})

    return {"response": answer, "conversation_id": input.conversation_id}

@app.post("/reset/")
async def reset_conversation(conversation_id: str):
    conversations[conversation_id] = Conversation()
    return {"status": "reset", "conversation_id": conversation_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
     