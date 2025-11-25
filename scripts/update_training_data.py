"""
🏃 Script ALL-IN-ONE para atualizar dados de treino
Faz tudo automaticamente: Backup → Import → Git Commit

Como usar:
1. Exporta novas atividades do Garmin Connect (formato CSV)
2. Coloca os ficheiros em 'data/garmin_exports/'
3. Executa: python scripts/update_training_data.py
4. Relaxa! O script faz tudo sozinho 🚀
"""

import json
import os
import shutil
import glob
import csv
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Optional, Union

# Configurações
GARMIN_EXPORTS_DIR = "data/garmin_exports"
DATA_FILE = "public/data/garmin_summary.json"
BACKUP_DIR = "data/backups"


def print_step(step_num, title):
    """Imprime título de cada passo"""
    print(f"\n{'='*60}")
    print(f"  PASSO {step_num}: {title}")
    print(f"{'='*60}\n")


def backup_data():
    """PASSO 1: Cria backup dos dados existentes"""
    print_step(1, "BACKUP DE DADOS")
    
    if not Path(DATA_FILE).exists():
        print("⚠️  Nenhum ficheiro de dados encontrado. A criar novo...")
        return False
    
    # Cria pasta de backups
    Path(BACKUP_DIR).mkdir(parents=True, exist_ok=True)
    
    # Nome do backup com timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    backup_file = f"{BACKUP_DIR}/garmin_backup_{timestamp}.json"
    
    # Copia ficheiro
    shutil.copy2(DATA_FILE, backup_file)
    
    # Lê stats
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"✅ Backup criado: {backup_file}")
    print(f"📊 Dados atuais: {data['total_runs']} corridas | {data['total_distance']}km")
    return True


def load_existing_data():
    """Carrega dados existentes do JSON"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"activities": []}


NumberLike = Optional[Union[str, int, float]]


def _parse_float(value: NumberLike) -> float:
    """Converte campos numéricos do Garmin, tratando '--' ou vazios."""
    if value is None:
        return 0.0
    value_str = str(value).strip().replace(',', '.')
    if value_str in {"", "--"}:
        return 0.0
    try:
        return float(value_str)
    except ValueError:
        return 0.0


def _parse_int(value: NumberLike) -> Optional[int]:
    """Converte valores pretendidos como inteiros, respeitando campos vazios."""
    parsed = _parse_float(value)
    return int(parsed) if parsed else None


def _parse_time_to_seconds(time_str: str | None) -> int:
    """Normaliza tempo (HH:MM:SS ou segundos) em segundos, aceitando '--'."""
    if not time_str or str(time_str).strip() in {"", "--"}:
        return 0
    value = str(time_str).strip()
    if ':' in value:
        parts = value.split(':')
        parts = [p or '0' for p in parts]
        if len(parts) == 3:
            hours, minutes, seconds = parts
            return int(hours) * 3600 + int(minutes) * 60 + int(seconds)
        if len(parts) == 2:
            minutes, seconds = parts
            return int(minutes) * 60 + int(seconds)
    try:
        return int(float(value))
    except ValueError:
        return 0


def parse_csv_file(file_path):
    """Parse ficheiro CSV do Garmin"""
    activities = []

    with open(file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            distance = _parse_float(row.get('Distance'))
            if distance <= 0:
                continue

            total_seconds = _parse_time_to_seconds(row.get('Time'))

            average_pace = (total_seconds / 60) / distance if distance > 0 else 0

            avg_hr = _parse_int(row.get('Avg HR'))
            calories = _parse_int(row.get('Calories')) or 0

            activity = {
                "date": row.get('Date', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
                "distance": distance,
                "total_time": total_seconds,
                "calories": calories,
                "average_heartrate": avg_hr,
                "average_pace": average_pace,
                "average_speed": (distance / total_seconds) * 3600 if total_seconds > 0 else 0,
            }

            activities.append(activity)

    return activities


def import_new_data():
    """PASSO 2: Importa novos dados (modo incremental)"""
    print_step(2, "IMPORTAR NOVOS DADOS")
    
    # Carrega dados existentes
    existing_data = load_existing_data()
    existing_activities = existing_data.get("activities", [])
    print(f"📦 Dados existentes: {len(existing_activities)} atividades")
    
    # Cria conjunto de datas existentes
    existing_dates = {act['date'] for act in existing_activities}
    
    # Processa novos ficheiros CSV
    Path(GARMIN_EXPORTS_DIR).mkdir(parents=True, exist_ok=True)
    csv_files = glob.glob(f"{GARMIN_EXPORTS_DIR}/*.csv")
    
    if not csv_files:
        print(f"\n⚠️  Nenhum ficheiro CSV encontrado em '{GARMIN_EXPORTS_DIR}'")
        print(f"💡 Exporta atividades do Garmin Connect e coloca nessa pasta.")
        return False
    
    new_activities = []
    for csv_file in csv_files:
        print(f"📁 A processar {os.path.basename(csv_file)}...")
        activities = parse_csv_file(csv_file)
        
        for act in activities:
            if act['date'] not in existing_dates:
                new_activities.append(act)
                print(f"   ✅ Nova: {act['date']} - {act['distance']:.2f}km")
            else:
                print(f"   ⏭️  Já existe: {act['date']}")
    
    if not new_activities:
        print(f"\n⚠️  Nenhuma atividade nova encontrada!")
        return False
    
    # Combina atividades antigas + novas
    all_activities = existing_activities + new_activities
    all_activities.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    # Recalcula estatísticas
    total_distance = sum(a['distance'] for a in all_activities)
    total_time = sum(a['total_time'] for a in all_activities)
    total_runs = len(all_activities)
    
    avg_distance = total_distance / total_runs if total_runs > 0 else 0
    avg_pace = (total_time / 60) / total_distance if total_distance > 0 else 0
    
    summary = {
        "total_distance": round(total_distance, 2),
        "total_time": total_time,
        "total_runs": total_runs,
        "avg_distance": round(avg_distance, 2),
        "avg_pace": round(avg_pace, 2),
        "activities": all_activities,
        "last_updated": datetime.now().isoformat(),
        "source": "Garmin Connect Export (Auto-update)"
    }
    
    # Guarda JSON atualizado
    Path(DATA_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Dados atualizados!")
    print(f"📊 Antes: {len(existing_activities)} corridas")
    print(f"📊 Novas: {len(new_activities)} corridas")
    print(f"📊 Total: {total_runs} corridas | {total_distance:.2f}km")
    
    return True


def git_commit():
    """PASSO 3: Faz commit automático no Git"""
    print_step(3, "GIT COMMIT & PUSH")
    
    try:
        # Verifica se há mudanças
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True, check=True)
        
        if not result.stdout.strip():
            print("ℹ️  Nenhuma mudança para fazer commit.")
            return True
        
        # Lê dados atualizados para criar mensagem
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Cria mensagem de commit
        date_str = datetime.now().strftime('%Y-%m-%d')
        commit_msg = f"feat: update training data - {date_str} ({data['total_runs']} runs, {data['total_distance']}km)"
        
        # Git add
        subprocess.run(['git', 'add', DATA_FILE], check=True)
        subprocess.run(['git', 'add', BACKUP_DIR], check=True)
        print("✅ Ficheiros adicionados ao Git")
        
        # Git commit
        subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
        print(f"✅ Commit criado: {commit_msg}")
        
        # Git push
        print("\n🚀 A fazer push para GitHub...")
        subprocess.run(['git', 'push'], check=True)
        print("✅ Push concluído!")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Erro no Git: {e}")
        print("💡 Podes fazer commit manualmente depois.")
        return False
    except FileNotFoundError:
        print("⚠️  Git não encontrado. Instala o Git ou faz commit manualmente.")
        return False


def cleanup_exports():
    """PASSO 4 (Opcional): Limpa ficheiros CSV após importar"""
    print_step(4, "LIMPEZA (OPCIONAL)")
    
    csv_files = glob.glob(f"{GARMIN_EXPORTS_DIR}/*.csv")
    
    if not csv_files:
        print("✅ Nenhum ficheiro para limpar.")
        return
    
    print(f"📁 Encontrados {len(csv_files)} ficheiro(s) CSV.")
    print("\nQueres apagar os ficheiros CSV já importados?")
    print("(Recomendado: SIM, pois os dados já estão guardados)")
    
    response = input("\nApagar ficheiros? (s/N): ").lower().strip()
    
    if response == 's' or response == 'sim':
        for csv_file in csv_files:
            os.remove(csv_file)
            print(f"🗑️  Apagado: {os.path.basename(csv_file)}")
        print("\n✅ Limpeza concluída!")
    else:
        print("\n⏭️  Ficheiros mantidos. Apaga manualmente quando quiseres.")


def main():
    """Executa workflow completo"""
    print("=" * 60)
    print("  🏃 ATUALIZADOR AUTOMÁTICO DE DADOS DE TREINO")
    print("  joaofaquino.run - Rumo à Maratona 2026")
    print("=" * 60)
    
    # Passo 1: Backup
    backup_created = backup_data()
    
    # Passo 2: Import
    data_imported = import_new_data()
    
    if not data_imported:
        print("\n⚠️  Processo interrompido. Nenhum dado novo para importar.")
        return
    
    # Passo 3: Git
    git_success = git_commit()
    
    # Passo 4: Cleanup
    cleanup_exports()
    
    # Resumo final
    print("\n" + "=" * 60)
    print("  ✅ PROCESSO CONCLUÍDO!")
    print("=" * 60)
    print(f"  ✅ Backup criado: {'Sim' if backup_created else 'N/A (novo ficheiro)'}")
    print(f"  ✅ Dados importados: Sim")
    print(f"  ✅ Git commit/push: {'Sim' if git_success else 'Manual necessário'}")
    print("=" * 60)
    print("\n🎉 Dados de treino atualizados com sucesso!")
    print("🌐 Deploy automático no Vercel em curso...")
    print("🔗 Verifica: https://joaofaquino.run/progress\n")


if __name__ == "__main__":
    main()
