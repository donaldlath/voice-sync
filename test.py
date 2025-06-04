import os
import subprocess
from pathlib import Path

# Chemins absolus pour éviter les erreurs
input_video = str(Path("input/votre_video.mp4").resolve())
input_audio = str(Path("input/votre_audio.wav").resolve())
output_file = str(Path("output/resultat.mp4").resolve())

# Commande Wav2Lip
cmd = [
    "python",
    "Wav2Lip/inference.py",
    "--checkpoint_path", "Wav2Lip/checkpoints/wav2lip_gan.pth",
    "--face", input_video,
    "--audio", input_audio,
    "--outfile", output_file,
    "--pads", "5", "5", "5", "5",  # Ajuste les bordures
    "--resize_factor", "2"           # 1=100%, 2=upscale 2x
]

# Exécution
print("⏳ Traitement en cours...")
subprocess.run(cmd)
print(f"✅ Résultat prêt : {output_file}")