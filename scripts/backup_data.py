"""
Script para fazer backup dos dados de treino
Cria cópias com timestamp para histórico
"""

import json
import shutil
from datetime import datetime
from pathlib import Path

DATA_FILE = "public/data/garmin_summary.json"
BACKUP_DIR = "data/backups"


def backup_training_data():
    """Cria backup com timestamp"""
    
    if not Path(DATA_FILE).exists():
        print("⚠️  Nenhum ficheiro de dados encontrado!")
        return
    
    # Cria pasta de backups
    Path(BACKUP_DIR).mkdir(parents=True, exist_ok=True)
    
    # Nome do backup com data
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    backup_file = f"{BACKUP_DIR}/garmin_backup_{timestamp}.json"
    
    # Copia ficheiro
    shutil.copy2(DATA_FILE, backup_file)
    
    # Lê stats
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"✅ Backup criado com sucesso!")
    print(f"📁 Ficheiro: {backup_file}")
    print(f"📊 Dados: {data['total_runs']} corridas | {data['total_distance']}km")
    print(f"📅 Data do backup: {timestamp}")


if __name__ == "__main__":
    print("💾 Backup de Dados de Treino\n")
    backup_training_data()
