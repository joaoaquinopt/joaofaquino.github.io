"""
Script INCREMENTAL para importar dados do Garmin Connect
Este script ADICIONA novas atividades sem apagar as antigas!

Como usar:
1. Exporta APENAS as novas atividades do Garmin Connect
2. Coloca os ficheiros .CSV na pasta 'data/garmin_exports/'
3. Executa: python scripts/import_garmin_incremental.py
4. Os novos dados serão ADICIONADOS aos existentes
"""

import json
import os
import glob
import csv
from datetime import datetime, timedelta
from pathlib import Path

GARMIN_EXPORTS_DIR = "data/garmin_exports"
OUTPUT_FILE = "public/data/garmin_summary.json"
WEEKLY_GOAL_KM = float(os.getenv("WEEKLY_GOAL_KM", "25"))


def load_existing_data():
    """Carrega dados existentes do JSON"""
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"activities": []}


def _first_value(row, keys):
    for key in keys:
        value = row.get(key)
        if value not in (None, "", "--"):
            return value
    return None


def _to_float(value):
    try:
        if value in (None, ""):
            return 0.0
        return float(str(value).replace(",", "."))
    except (TypeError, ValueError):
        return 0.0


def _parse_date(value: str | None) -> datetime | None:
    if not value:
        return None

    value = value.strip()
    formats = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue

    return None


def parse_csv_file(file_path):
    """Parse ficheiro CSV do Garmin"""
    activities = []
    
    with open(file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            distance_raw = _first_value(row, [
                'Distance',
                'Distância',
                'Distância (km)',
            ])

            # Ignora linhas sem distância
            distance = _to_float(distance_raw)
            if distance <= 0:
                continue
            
            # Parse dos dados
            time_str = _first_value(row, ['Time', 'Tempo']) or '0'
            
            # Converte tempo (formato HH:MM:SS ou segundos)
            if ':' in time_str:
                time_parts = time_str.split(':')
                total_seconds = int(time_parts[0]) * 3600 + int(time_parts[1]) * 60 + int(time_parts[2])
            else:
                total_seconds = int(float(time_str))
            
            # Calcula pace (min/km)
            average_pace = (total_seconds / 60) / distance if distance > 0 else 0

            avg_hr_raw = _first_value(row, ['Avg HR', 'FC Média'])
            max_hr_raw = _first_value(row, ['Max HR', 'FC máxima', 'FC Máxima'])
            calories_raw = _first_value(row, ['Calories', 'Calorias'])
            
            activity = {
                "date": _first_value(row, ['Date', 'Data']) or datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "distance": distance,
                "total_time": total_seconds,
                "calories": int(_to_float(calories_raw)) if calories_raw else 0,
                "average_heartrate": int(_to_float(avg_hr_raw)) if avg_hr_raw else None,
                "average_pace": average_pace,
                "average_speed": (distance / total_seconds) * 3600 if total_seconds > 0 else 0,
                "average_speed_kmh": (distance / total_seconds) * 3600 if total_seconds > 0 else 0,
                "title": _first_value(row, ['Title', 'Título']) or 'Corrida',
                "max_heart_rate": int(_to_float(max_hr_raw)) if max_hr_raw else None,
            }
            
            activities.append(activity)
    
    return activities


def format_time_hours(seconds: float) -> str:
    total = int(round(seconds))
    hours = total // 3600
    minutes = (total % 3600) // 60
    secs = total % 60
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


def import_garmin_incremental():
    """Importa novos dados SEM apagar os antigos"""
    
    print("🔄 Modo INCREMENTAL - mantém dados existentes\n")
    
    # 1. Carrega dados existentes
    existing_data = load_existing_data()
    existing_activities = existing_data.get("activities", [])
    print(f"📦 Dados existentes: {len(existing_activities)} atividades")
    
    # 2. Cria conjunto de datas existentes (para evitar duplicados)
    existing_dates = {act['date'] for act in existing_activities}
    
    # 3. Processa novos ficheiros CSV
    Path(GARMIN_EXPORTS_DIR).mkdir(parents=True, exist_ok=True)
    csv_files = glob.glob(f"{GARMIN_EXPORTS_DIR}/*.csv")
    
    new_activities = []
    for csv_file in csv_files:
        print(f"📁 A processar {os.path.basename(csv_file)}...")
        activities = parse_csv_file(csv_file)
        
        for act in activities:
            if act['date'] not in existing_dates:
                new_activities.append(act)
                print(f"   ✅ Nova: {act['date']} - {act['distance']:.2f}km")
            else:
                print(f"   ⏭️  Duplicada: {act['date']} - ignorada")
    
    initial_count = len(existing_activities)
    added_count = len(new_activities)

    if not new_activities:
        print(f"\nℹ️  Nenhuma atividade nova encontrada, mantendo dados existentes.")
        all_activities = existing_activities
    else:
        all_activities = existing_activities + new_activities
    
    # 4. Combina atividades antigas + novas
    all_activities.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    # 5. Recalcula estatísticas
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
        "source": "Garmin Connect Export (Incremental)"
    }

    if all_activities:
        now = datetime.now()
        week_start = now - timedelta(days=now.weekday())
        week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)
        week_end = week_start + timedelta(days=7)

        weekly_runs = []
        weekly_distance = 0.0
        weekly_time = 0.0

        for activity in all_activities:
            activity_dt = _parse_date(activity.get("date"))
            if activity_dt and week_start <= activity_dt < week_end:
                weekly_runs.append(activity)
                weekly_distance += activity.get("distance", 0.0)
                weekly_time += activity.get("total_time", 0.0)

        summary["this_week"] = {
            "runs": len(weekly_runs),
            "distance": round(weekly_distance, 2),
            "time": format_time_hours(weekly_time),
            "start_date": week_start.strftime("%Y-%m-%d"),
            "end_date": (week_end - timedelta(days=1)).strftime("%Y-%m-%d"),
            "goal": WEEKLY_GOAL_KM,
        }
        summary["latest_run"] = all_activities[0]
        summary["recent_runs"] = all_activities[:10]
    
    # 6. Guarda JSON atualizado
    Path(OUTPUT_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Dados consolidados com sucesso!")
    print(f"📊 Antes: {initial_count} corridas")
    print(f"📊 Novas: {added_count} corridas")
    print(f"📊 Total: {total_runs} corridas | {total_distance:.2f}km")
    print(f"💾 Ficheiro: {OUTPUT_FILE}")


if __name__ == "__main__":
    print("🏃 Garmin Incremental Importer - joaofaquino.run\n")
    import_garmin_incremental()
