# 🎭 MemeForge — Create Memes, Share the Fun!

MemeForge is a fun and easy-to-use **Meme Generator Web Application** that lets users create memes using their own images and text. It aims to make meme creation simple, creative, and enjoyable through a user-friendly interface.

## ✨ Features

- 🎨 **Meme Creation:** Create custom memes by adding text to images.
- 🖼️ **Image Support:** Use images as the base for your memes.
- ✏️ **Text Customization:** Add and personalize meme captions.
- 🎉 **Interactive Interface:** Enjoy a simple and engaging meme-making experience.
- 💾 **Meme Storage:** Uses a Flask backend and SQLite database for meme-related data.
- 🌐 **Web-Based Application:** Access the application through a web browser.

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Python
- Flask

**Database**
- SQLite

## 📁 Project Structure

```text
MemeForge/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── studio.html
│   ├── finish.html
│   ├── style.css
│   └── script.js
├── .gitignore
└── README.md
```

## 🚀 Run the Project Locally

### Prerequisites

Install Python and Git on your computer.

### 1. Clone the repository

```bash
git clone https://github.com/Sk-Naziya/MemeForge.git
```

### 2. Open the project folder

```bash
cd MemeForge
```

### 3. Create a virtual environment

```bash
python -m venv .venv
```

### 4. Activate the virtual environment

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

### 5. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 6. Start the Flask backend

```bash
python app.py
```

The backend will run at the local address configured in `app.py`, typically:

```text
http://127.0.0.1:5000
```

### 7. Open the frontend

Open `frontend/index.html` in your browser, or use a local development server if your application requires one.

**Note:** The frontend and backend must be configured to communicate with each other. Some features may not work until the backend is running.

## 📌 Project Goals

- Make meme creation accessible to everyone.
- Provide an enjoyable and creative user experience.
- Practice frontend development and Python backend integration.
- Explore storing and managing application data with SQLite.

## 🔮 Future Improvements

- Add more animations and visual effects.
- Introduce additional meme templates.
- Improve text styling and customization.
- Add more interactive features.
- Make the application responsive across mobile and desktop devices.
- Deploy the complete application online.

## 👩‍💻 Developer

**Shaik Naziya**

GitHub: [Sk-Naziya](https://github.com/Sk-Naziya)

## 📄 License

No license has been specified yet.
