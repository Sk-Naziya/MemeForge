
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database location
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "memes.db")


# Connect to SQLite database
def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


# Create the database table automatically
def initialize_database():
    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS memes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            image_data TEXT,
            created_at TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


# Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Meme Generator backend is running!"
    })


# Save a meme
@app.route("/api/memes", methods=["POST"])
def save_meme():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "status": "error",
            "message": "Please send JSON data."
        }), 400

    title = data.get("title", "My Meme")
    image_data = data.get("image_data", "")

    if not isinstance(title, str) or not title.strip():
        return jsonify({
            "status": "error",
            "message": "Meme title cannot be empty."
        }), 400

    if not isinstance(image_data, str):
        return jsonify({
            "status": "error",
            "message": "Image data must be a string."
        }), 400

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO memes (title, image_data, created_at)
        VALUES (?, ?, ?)
        """,
        (
            title.strip(),
            image_data,
            datetime.now().isoformat(timespec="seconds")
        )
    )

    connection.commit()
    meme_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "status": "success",
        "message": "Meme saved successfully!",
        "meme_id": meme_id
    }), 201


# Get all saved memes
@app.route("/api/memes", methods=["GET"])
def get_memes():
    connection = get_db_connection()

    rows = connection.execute(
        """
        SELECT id, title, created_at
        FROM memes
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    return jsonify({
        "status": "success",
        "memes": [dict(row) for row in rows]
    })


# Get one saved meme, including its image
@app.route("/api/memes/<int:meme_id>", methods=["GET"])
def get_meme(meme_id):
    connection = get_db_connection()

    row = connection.execute(
        "SELECT * FROM memes WHERE id = ?",
        (meme_id,)
    ).fetchone()

    connection.close()

    if row is None:
        return jsonify({
            "status": "error",
            "message": "Meme not found."
        }), 404

    return jsonify({
        "status": "success",
        "meme": dict(row)
    })


# Delete a saved meme
@app.route("/api/memes/<int:meme_id>", methods=["DELETE"])
def delete_meme(meme_id):
    connection = get_db_connection()

    cursor = connection.execute(
        "DELETE FROM memes WHERE id = ?",
        (meme_id,)
    )

    connection.commit()
    deleted = cursor.rowcount > 0
    connection.close()

    if not deleted:
        return jsonify({
            "status": "error",
            "message": "Meme not found."
        }), 404

    return jsonify({
        "status": "success",
        "message": "Meme deleted successfully."
    })


if __name__ == "__main__":
    initialize_database()
    app.run(debug=True, port=5000)
