# 💬 Chat-Bot

A full-stack chatbot application with a **Python backend** and a **React frontend**.  
It provides an interactive chat interface and integrates with external APIs (like Groq).

---

## 🚀 Features
- Frontend built with **React.js**
- Backend powered by **Python (Flask/FastAPI)**
- Real-time chatbot interface
- Sample questions for quick interactions
- Secure API key management using `.env`

---

## 📂 Project Structure
```
Chat-bot-master/
│── backend/              # Python backend
│   ├── app.py            # Main backend server
│   ├── requirements.txt  # Backend dependencies
│
│── frontend/applechatbot/ # React frontend
│   ├── src/              # React source code
│   ├── public/           # Static files
│   ├── package.json      # Frontend dependencies
│
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/Chat-bot.git
cd Chat-bot
```

---

### 2️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows

pip install -r requirements.txt
```

Create a `.env` file inside `backend/` and add your API keys:
```
GROQ_API_KEY=your_api_key_here
```

Run the backend:
```bash
python app.py
```

---

### 3️⃣ Frontend Setup
```bash
cd frontend/applechatbot
npm install
npm start
```

The React app will run at **http://localhost:3000**.

---

## 🔒 Environment Variables
Make sure you have a `.env` file in your `backend/` folder:
```
GROQ_API_KEY=your_api_key_here
```
⚠️ Never commit `.env` to GitHub (already ignored via `.gitignore`).

---

## 📸 Screenshots
*(Add screenshots of your chatbot UI here)*

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License
This project is licensed under the MIT License.
