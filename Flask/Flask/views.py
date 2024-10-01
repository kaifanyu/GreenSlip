from flask import Flask, Blueprint, request, jsonify, session
from werkzeug.utils import secure_filename
from .LLM.process import process
import os
import time
import pandas as pd
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth
from flask_cors import CORS
from pdf2image import convert_from_path
import tempfile

app = Flask(__name__)
views = Blueprint('views', __name__)
CORS(app)


UPLOAD_FOLDER = 'Flask/files'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER + "/Receipts", exist_ok=True) # Ensure the receipts folder exists


current_file_directory = os.path.dirname(os.path.abspath(__file__))
service_account_path = os.path.join(current_file_directory, 'greenslip-6e16b-firebase-adminsdk-6ufg4-3d521aff9f.json')
# Initialize the credentials
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

@views.route('/upload', methods=['POST'])
def file_upload():
    # Verify Firebase Auth ID token
    id_token = request.headers.get('Authorization').split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
    except Exception as e:
        return jsonify({'message': 'Unauthorized - Invalid token'}), 401

    if 'files' not in request.files:
        return jsonify({'message': 'No files provided'}), 400

    files = request.files.getlist('files')  # Get multiple files
    results = []

    for file in files:
        if file.filename == '':
            continue  # Skip empty filenames
        filename = secure_filename(file.filename)
        if filename.lower().endswith('.pdf'):
            file_path = os.path.join(UPLOAD_FOLDER, "Receipts", filename)
            file.save(file_path)  # Save the file whether it's PDF or not

            with tempfile.TemporaryDirectory() as path:
                # Convert PDF to images
                images = convert_from_path(file_path, output_folder=path)
                for image in images:
                    image_filename = f"{filename}_page_{images.index(image) + 1}.png"
                    image_path = os.path.join(path, image_filename)
                    image.save(image_path, 'PNG')
                    # Process each image
                    print("IMG: ", image_path)
                    processed_data = process(image_path)  # Assuming process() is defined elsewhere
                    entry_ref = db.collection('Users').document(uid).collection('Products').add(processed_data)
                    results.append({'filename': image_filename, 'entryID': entry_ref[1].id})
        else:
            # Process non-PDF files directly
            script_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(script_dir, "files", "Receipts", filename)
            file.save(file_path)
            processed_data = process(file_path)
            entry_ref = db.collection('Users').document(uid).collection('Products').add(processed_data)
            results.append({'filename': filename, 'entryID': entry_ref[1].id})

    return jsonify(results), 200