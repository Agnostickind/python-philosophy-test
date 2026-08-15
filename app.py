from flask import Flask, request

app = Flask(__name__)

philosophers = {
    "plato": "Plato was an ancient Greek philosopher and a student of Socrates.",
    "socrates": "Socrates was an ancient Greek philosopher known for the Socratic method of questioning.",
    "aristotle": "Aristotle was a Greek philosopher and student of Plato who wrote on logic, ethics, politics, and natural philosophy.",
    "nietzsche": "Friedrich Nietzsche was a German philosopher known for his work on morality, culture, and the idea of the Übermensch.",
    "kant": "Immanuel Kant was a German philosopher whose work strongly influenced modern epistemology and ethics.",
}

@app.route("/")
def home():
    name = request.args.get("name", "").strip().lower()

    result = ""

    if name:
        result = philosophers.get(
            name,
            "I don't have information about that philosopher yet."
        )

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Python Philosophy Explorer</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                max-width: 700px;
                margin: 80px auto;
                padding: 20px;
                line-height: 1.6;
            }}

            input {{
                padding: 10px;
                width: 60%;
                font-size: 16px;
            }}

            button {{
                padding: 10px 18px;
                font-size: 16px;
                cursor: pointer;
            }}

            .result {{
                margin-top: 30px;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
            }}
        </style>
    </head>

    <body>

        <h1>Python Philosophy Explorer</h1>

        <p>
            This page is powered by Python and Flask.
        </p>

        <form method="GET">
            <input
                type="text"
                name="name"
                placeholder="Enter a philosopher..."
                value="{name}"
            >

            <button type="submit">Search</button>
        </form>

        {"<div class='result'><strong>" + name.title() + "</strong><p>" + result + "</p></div>" if name else ""}

    </body>
    </html>
    """


if __name__ == "__main__":
    app.run()
