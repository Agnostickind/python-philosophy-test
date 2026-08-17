from flask import Flask, render_template, abort, send_from_directory
import os

app = Flask(
    __name__,
    static_folder="static",
    static_url_path=""
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/<page>.html")
def page(page):
    template_name = page + ".html"
    template_path = os.path.join(app.template_folder, template_name)

    if not os.path.isfile(template_path):
        abort(404)

    return render_template(template_name)


@app.route("/<path:filename>")
def static_files(filename):
    file_path = os.path.join(app.static_folder, filename)

    if not os.path.isfile(file_path):
        abort(404)

    return send_from_directory(app.static_folder, filename)


if __name__ == "__main__":
    app.run(debug=True)