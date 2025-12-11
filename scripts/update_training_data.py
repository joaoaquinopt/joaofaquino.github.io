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
from datetime import datetime, timedelta
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
    stats_block = data.get("stats", {}) if isinstance(data, dict) else {}
    total_runs = stats_block.get("total_runs") or data.get("total_runs") if isinstance(data, dict) else None
    total_distance = stats_block.get("total_distance") or data.get("total_distance") if isinstance(data, dict) else None

    if total_runs is None and isinstance(data, dict):
        total_runs = len(data.get("activities", []))

    if total_distance is None and isinstance(data, dict):
        total_distance = round(sum(_parse_float(act.get("distance")) for act in data.get("activities", [])), 2)

    total_runs = total_runs or 0
    total_distance = total_distance or 0

    print(f"📊 Dados atuais: {total_runs} corridas | {total_distance}km")
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


def _first_value(row: dict, keys: list[str]) -> Optional[str]:
    for key in keys:
        if key in row and row[key] not in (None, ""):
            return row[key]
    return None


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
            return int(float(hours)) * 3600 + int(float(minutes)) * 60 + int(round(float(seconds)))
        if len(parts) == 2:
            minutes, seconds = parts
            return int(float(minutes)) * 60 + int(round(float(seconds)))
    try:
        return int(float(value))
    except ValueError:
        return 0


def _format_time_hms(total_seconds: float | int | None) -> str:
    """Converte segundos para formato HH:MM:SS."""
    total = int(round(total_seconds or 0))
    hours = total // 3600
    minutes = (total % 3600) // 60
    seconds = total % 60
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


def _parse_pace_to_seconds(pace_str: str | None) -> int:
    """Converte ritmos (MM:SS[/km]) em segundos por km."""
    if not pace_str:
        return 0
    value = str(pace_str).strip().replace('/km', '').strip()
    if value in {"", "--"}:
        return 0
    if ':' in value:
        parts = value.split(':')
        if len(parts) == 2:
            minutes, seconds = parts
            try:
                return int(minutes) * 60 + int(seconds)
            except ValueError:
                return 0
    try:
        # Se vier em minutos decimais
        return int(float(value) * 60)
    except ValueError:
        return 0


def _format_pace(seconds_per_km: float | int | None) -> str:
    """Formata ritmo em MM:SS/km."""
    seconds = float(seconds_per_km or 0)
    if seconds <= 0:
        return "--/km"
    minutes = int(seconds // 60)
    secs = int(round(seconds % 60))
    if secs == 60:
        minutes += 1
        secs = 0
    return f"{minutes}:{secs:02d}/km"


def _parse_datetime(value: str | None) -> datetime | None:
    """Tenta interpretar vários formatos de data/hora."""
    if not value:
        return None

    value = str(value).strip()
    formats = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%d/%m/%Y %H:%M:%S",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue

    return None


def _ensure_int(value: NumberLike) -> Optional[int]:
    parsed = _parse_float(value)
    return int(parsed) if parsed else None


def _normalize_activity(activity: dict) -> dict:
    """Normaliza uma atividade para o formato esperado pelo frontend."""
    if activity is None:
        return {}

    # Determina data/hora
    raw_date = activity.get("date")
    iso_candidate = activity.get("iso_date") or activity.get("iso_timestamp")
    dt = _parse_datetime(iso_candidate) or _parse_datetime(raw_date)

    if dt:
        iso_date = dt.strftime("%Y-%m-%d")
        display_date = dt.strftime("%d/%m/%Y")
    else:
        iso_date = iso_candidate or raw_date or ""
        display_date = raw_date or iso_candidate or ""

    distance = round(_parse_float(activity.get("distance")), 2)

    time_seconds = activity.get("time_seconds")
    if time_seconds is None:
        total_time = activity.get("total_time")
        if isinstance(total_time, (int, float)):
            time_seconds = int(total_time)
        else:
            time_seconds = _parse_time_to_seconds(total_time)
    time_seconds = int(time_seconds or 0)

    time_str = activity.get("time") or _format_time_hms(time_seconds)

    pace_seconds = _parse_pace_to_seconds(activity.get("pace"))
    if pace_seconds <= 0 and distance > 0:
        pace_seconds = time_seconds / distance if distance else 0
    pace_str = _format_pace(pace_seconds)

    avg_hr = activity.get("avg_hr")
    if avg_hr is None:
        avg_hr = activity.get("average_heartrate")
    avg_hr = _ensure_int(avg_hr)

    max_hr = activity.get("max_hr")
    if max_hr is None:
        max_hr = activity.get("max_heart_rate")
    max_hr = _ensure_int(max_hr)

    calories = activity.get("calories")
    calories = int(_parse_float(calories)) if calories is not None else 0

    elevation = activity.get("elevation_gain")
    elevation = int(_parse_float(elevation)) if elevation is not None else 0

    title = activity.get("title") or "Corrida"

    return {
        "date": display_date,
        "iso_date": iso_date,
        "title": title,
        "distance": round(distance, 2),
        "time": time_str,
        "time_seconds": time_seconds,
        "pace": pace_str,
        "avg_hr": avg_hr,
        "max_hr": max_hr,
        "calories": calories,
        "elevation_gain": elevation,
    }


def _activity_signature(activity: dict) -> tuple:
    """Cria uma assinatura única para evitar duplicados."""
    return (
        activity.get("iso_date"),
        round(activity.get("distance", 0), 3),
        int(activity.get("time_seconds", 0)),
    )


def _activity_sort_key(activity: dict) -> tuple:
    dt = _parse_datetime(activity.get("date")) or _parse_datetime(activity.get("iso_date"))
    timestamp = dt.timestamp() if dt else 0
    return (timestamp, activity.get("time_seconds", 0))


def parse_csv_file(file_path):
    """Parse ficheiro CSV do Garmin"""
    activities = []

    with open(file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            distance_raw = _first_value(row, ['Distance', 'Distância', 'Distância (km)'])
            distance = _parse_float(distance_raw)
            if distance <= 0:
                continue

            time_raw = _first_value(row, ['Time', 'Tempo'])
            total_seconds = _parse_time_to_seconds(time_raw)

            average_pace = (total_seconds / 60) / distance if distance > 0 else 0

            avg_hr = _parse_int(_first_value(row, ['Avg HR', 'FC Média']))
            calories = _parse_int(_first_value(row, ['Calories', 'Calorias'])) or 0
            title = _first_value(row, ['Title', 'Título']) or 'Corrida'

            activity = {
                "date": _first_value(row, ['Date', 'Data']) or datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "distance": distance,
                "total_time": total_seconds,
                "calories": calories,
                "average_heartrate": avg_hr,
                "average_pace": average_pace,
                "average_speed": (distance / total_seconds) * 3600 if total_seconds > 0 else 0,
                "title": title,
            }

            activities.append(activity)

    return activities


def import_new_data():
    """PASSO 2: Importa novos dados (modo incremental)"""
    print_step(2, "IMPORTAR NOVOS DADOS")
    
    # Carrega dados existentes
    existing_data = load_existing_data()
    raw_existing_activities = existing_data.get("activities", [])
    normalized_existing = []
    existing_signatures: set[tuple] = set()

    for activity in raw_existing_activities:
        normalized = _normalize_activity(activity)
        signature = _activity_signature(normalized)
        if signature not in existing_signatures:
            normalized_existing.append(normalized)
            existing_signatures.add(signature)

    print(f"📦 Dados existentes: {len(normalized_existing)} atividades")
    
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
            normalized = _normalize_activity(act)
            signature = _activity_signature(normalized)
            if signature not in existing_signatures:
                new_activities.append(normalized)
                existing_signatures.add(signature)
                print(f"   ✅ Nova: {normalized['iso_date']} - {normalized['distance']:.2f}km")
            else:
                print(f"   ⏭️  Já existe: {normalized['iso_date']}")
    
    if not new_activities:
        print(f"\n⚠️  Nenhuma atividade nova encontrada!")
        return False
    
    # Combina atividades antigas + novas
    all_activities = normalized_existing + new_activities
    all_activities.sort(key=_activity_sort_key, reverse=True)
    
    # Recalcula estatísticas
    total_distance = sum(a['distance'] for a in all_activities)
    total_time = sum(a['time_seconds'] for a in all_activities)
    total_runs = len(all_activities)
    
    avg_distance = total_distance / total_runs if total_runs > 0 else 0
    avg_pace_seconds = (total_time / total_distance) if total_distance > 0 else 0

    today = datetime.now().date()
    week_start = today - timedelta(days=6)

    weekly_runs = []
    weekly_distance = 0.0
    weekly_time = 0

    for activity in all_activities:
        run_dt = _parse_datetime(activity.get("iso_date")) or _parse_datetime(activity.get("date"))
        if run_dt and run_dt.date() >= week_start:
            weekly_runs.append(activity)
            weekly_distance += activity.get("distance", 0.0)
            weekly_time += activity.get("time_seconds", 0)

    summary = {
        "generated_at": datetime.now().isoformat(),
        "stats": {
            "total_runs": total_runs,
            "total_distance": round(total_distance, 2),
            "total_time": _format_time_hms(total_time),
            "total_time_seconds": total_time,
            "avg_pace": _format_pace(avg_pace_seconds),
            "avg_distance": round(avg_distance, 2),
            "marathon_progress": round((total_distance / 42.195) * 100, 1) if total_distance else 0,
        },
        "latest_run": all_activities[0] if all_activities else None,
        "this_week": {
            "runs": len(weekly_runs),
            "distance": round(weekly_distance, 2),
            "time": _format_time_hms(weekly_time),
        },
        "recent_runs": all_activities[:10],
        "activities": all_activities,
        "last_updated": datetime.now().isoformat(),
        "source": "Garmin Connect Export (Auto-update)",
    }

    # Guarda JSON atualizado
    Path(DATA_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Dados atualizados!")
    print(f"📊 Antes: {len(normalized_existing)} corridas")
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
        stats_block = data.get("stats", {}) if isinstance(data, dict) else {}
        total_runs = stats_block.get("total_runs") or data.get("total_runs")
        total_distance = stats_block.get("total_distance") or data.get("total_distance")
        commit_msg = f"feat: update training data - {date_str} ({total_runs or 0} runs, {total_distance or 0}km)"
        
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
