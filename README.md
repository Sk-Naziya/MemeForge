# MemeForge

A premium meme generator built with HTML, CSS, and JavaScript on the frontend, and a minimal Express backend for health and template API routes.

## Features

- Built-in template gallery with search and category filters
- Upload custom images or choose a template
- Add, edit, remove, and position custom text layers
- Live meme preview
- Download final memes as PNG files
- Responsive design for desktop, tablet, and mobile

## Project structure

```text
memeforge/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── assets/
│       └── images/
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       └── app.js
├── .gitignore
└── README.md
```

## Installation

```bash
cd memeforge/backend
npm install
```

## Run the app

```bash
cd memeforge/backend
npm start
```

Then open http://localhost:3000 in your browser.

## Optional MongoDB configuration

This app does not require MongoDB to create or download memes. The core flow works without a database connection. A MongoDB URI is included in `.env.example` only as a placeholder for any future saved-meme feature, such as storing user-generated meme records or template metadata persistently.

## Notes

- The app validates upload types and file sizes in the browser.
- The backend exposes a health endpoint at `/api/health` and template metadata at `/api/templates`.
- The frontend loads template images from available public URLs and will still function even if a third-party image host is unavailable.
