from flask import Flask, request, send_file, jsonify, abort
import subprocess
import os
import uuid
import logging
import ffmpeg
from werkzeug.utils import secure_filename
from pathlib import Path
#Simple commentaire
# Configuration
app = Flask(__name__)
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}
TEMP_DIR = "temp_files"
os.makedirs(TEMP_DIR, exist_ok=True)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_audio(text, output_path):
    """Génère un fichier audio à partir du texte avec pyttsx3"""
    try:
        # Version sécurisée avec vérification du chemin
        output_path = str(Path(output_path).resolve())
        cmd = [
            'python',
            '-c',
            f'import pyttsx3; engine = pyttsx3.init(); engine.save_to_file(r"{text}", r"{output_path}"); engine.runAndWait()'
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        if not os.path.exists(output_path):
            raise RuntimeError("Le fichier audio n'a pas été généré")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Erreur pyttsx3: {e.stderr}")
        return False
    
    
def convert_audio(input_path, output_path):
    """Convertit un fichier audio en 16kHz mono"""
    try:
        ffmpeg.input(input_path).output(output_path, ar=16000, ac=1).run()
        return True
    except ffmpeg.Error as e:
        print(f"Erreur FFmpeg: {e.stderr.decode()}")
        return False
if __name__ == "__main__":
    convert_audio("audio.wav", "audio_16k.wav")

def run_wav2lip(face_path, audio_path, output_path):
    """Exécute Wav2Lip de manière sécurisée"""

    try:
        subprocess.run(["ffmpeg", "-version"], check=True, capture_output=True)
    except FileNotFoundError:
        print("Erreur : FFmpeg n'est pas installé. Suivez les instructions ci-dessus.")
        exit(1)

    try:
        cmd = [
            'python',
            'Wav2Lip/inference.py',
            '--checkpoint_path', 'checkpoints/wav2lip_gan.pth',
            '--face', face_path,
            '--audio', audio_path,
            '--outfile', output_path,
            '--device', 'cpu'  # Force l'utilisation du CPU
            '--pads', '0', '10', '0', '0'
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Erreur Wav2Lip: {e.stderr}")
        return False

def cleanup_files(*paths):
    """Nettoie les fichiers temporaires en silence"""
    for path in paths:
        try:
            if path and os.path.exists(path):
                os.remove(path)
                logger.info(f"Fichier supprimé: {path}")
        except Exception as e:
            logger.error(f"Échec suppression {path}: {str(e)}")

@app.route('/lip-sync', methods=['POST'])
def lip_sync():
    # Vérification des entrées
    if 'text' not in request.form or 'video' not in request.files:
        abort(400, description="Requête invalide: texte ou vidéo manquant")
    
    # 1. Prétraitement audio
    processed_audio = "processed_audio.wav"
    convert_audio(audio_path, processed_audio)

    text = request.form['text']
    video = request.files['video']
    
    if not text or not video:
        abort(400, description="Texte ou vidéo vide")
    
    if not allowed_file(video.filename):
        abort(400, description="Format vidéo non supporté")

    # Création des chemins uniques
    session_id = str(uuid.uuid4())
    video_path = os.path.join(TEMP_DIR, f"{session_id}_input.mp4")
    audio_path = os.path.join(TEMP_DIR, f"{session_id}_audio.wav")
    output_path = os.path.join(TEMP_DIR, f"{session_id}_output.mp4")

    try:
        # Sauvegarde sécurisée de la vidéo
        video.save(video_path)
        
        # Génération audio
        if not generate_audio(text, audio_path):
            abort(500, "Échec de la synthèse vocale")
        
        # Exécution Wav2Lip
        subprocess.run([
        "python", "Wav2Lip/inference.py",
        "--face", video_path,
        "--audio", processed_audio,
        "--outfile", "output.mp4"
    ])
        
        if not run_wav2lip(video_path, audio_path, output_path):
            abort(500, "Échec de la synchronisation labiale")
        
        # Envoi du fichier avec suppression différée
        def cleanup_after_send():
            cleanup_files(video_path, audio_path, output_path)
        
        response = send_file(
            output_path,
            mimetype='video/mp4',
            as_attachment=True,
            download_name='lip_sync_result.mp4'
        )
        response.call_on_close(cleanup_after_send)
        
        return response

    except Exception as e:
        cleanup_files(video_path, audio_path, output_path)
        logger.exception("Erreur critique")
        abort(500, description="Erreur interne du serveur")
 # 3. Nettoyage
    os.remove(processed_audio)
#les permit
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)