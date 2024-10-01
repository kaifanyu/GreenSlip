from Flask import create_app
from flask import request, Response
from flask_cors import CORS

app = create_app()
# app.config['SECRET_KEY'] = 'superdupersecretkey'

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.before_request
def basic_authentication():
    if request.method == 'OPTIONS':
        return Response()


if __name__ == '__main__':
    app.run(debug=False)