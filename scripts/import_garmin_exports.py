"""
Script para importar dados exportados do Garmin Connect
Suporta ficheiros .FIT e .CSV

Como usar:
1. Exporta atividades do Garmin Connect (https://connect.garmin.com)
2. Coloca os ficheiros na pasta 'data/garmin_exports/'
3. Executa: python scripts/import_garmin_exports.py
"""

import json
import os
import glob
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Pasta onde colocas os exports do Garmin
GARMIN_EXPORTS_DIR = "data/garmin_exports"
OUTPUT_FILE = "public/data/garmin_summary.json"


def format_time_hours(seconds: float) -> str:
    """Convert seconds to HH:MM:SS string."""
    total = int(round(seconds))
    hours = total // 3600
    minutes = (total % 3600) // 60
    secs = total % 60
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


def format_pace_label(seconds_per_km: float) -> str:
    """Convert seconds per km into MM:SS/km string."""
    if not seconds_per_km or seconds_per_km <= 0:
        return "--"
    total = int(round(seconds_per_km))
    minutes = total // 60
    seconds = total % 60
    return f"{minutes}:{seconds:02d}/km"


def parse_datetime(value):
    """Try to parse several datetime formats."""
    if not value:
        return None
    if isinstance(value, datetime):
        return value

    value_str = str(value).strip()
    formats = [
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y/%m/%d %H:%M:%S",
    ]

    # Handle ISO with timezone
    try:
        return datetime.fromisoformat(value_str.replace("Z", "+00:00"))
    except ValueError:
        pass

    for fmt in formats:
        try:
            return datetime.strptime(value_str, fmt)
        except ValueError:
            continue
    return None


def to_int(value):
    try:
        if value is None or value == "":
            return None
        return int(float(str(value).replace(",", ".")))
    except (ValueError, TypeError):
        return None


def to_float(value):
    try:
        if value is None or value == "":
            return 0.0
        return float(str(value).replace(",", "."))
    except (ValueError, TypeError):
        return 0.0


def first_value(data, keys):
    for key in keys:
        value = data.get(key)
        if value not in (None, ""):
            return value
    return None


def serialize_activity(activity):
    """Normalize activity dict into summary-friendly structure."""
    distance = to_float(first_value(activity, ["distance", "distance_km", "total_distance"]))
    time_seconds = to_float(
        first_value(
            activity,
            [
                "time_seconds",
                "total_time",
                "total_time_seconds",
                "moving_time",
                "elapsed_time",
            ],
        )
    )

    if distance <= 0 or time_seconds <= 0:
        return None

    date_value = first_value(
        activity, ["date", "iso_date", "start_time", "start_time_local"]
    )
    dt = parse_datetime(date_value)
    if dt is None:
        dt = datetime.now(timezone.utc)
    elif dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)

    formatted_date = activity.get("date_display")
    if not formatted_date:
        formatted_date = dt.strftime("%d/%m/%Y")

    iso_date = dt.strftime("%Y-%m-%d")

    calories = to_int(first_value(activity, ["calories", "total_calories"]))
    avg_hr = to_int(
        first_value(
            activity,
            [
                "average_heartrate",
                "average_heart_rate",
                "avg_hr",
                "avg_heart_rate",
            ],
        )
    )
    max_hr = to_int(first_value(activity, ["max_heartrate", "max_heart_rate", "max_hr"]))
    elevation = to_int(
        first_value(activity, ["elevation_gain", "total_ascent", "total_ascent_m"])
    )

    pace_seconds = time_seconds / distance if distance > 0 else 0

    return {
        "date": formatted_date,
        "iso_date": iso_date,
        "title": activity.get("title") or activity.get("name") or "Corrida",
        "distance": round(distance, 2),
        "time": format_time_hours(time_seconds),
        "time_seconds": int(round(time_seconds)),
        "pace": format_pace_label(pace_seconds),
        "avg_hr": avg_hr,
        "max_hr": max_hr,
        "calories": calories or 0,
        "elevation_gain": elevation or 0,
        "_dt": dt,
    }


def build_summary(activities):
    runs = []
    for activity in activities:
        normalised = serialize_activity(activity)
        if normalised:
            runs.append(normalised)

    if not runs:
        empty = {
            "generated_at": datetime.now().isoformat(),
            "stats": {
                "total_runs": 0,
                "total_distance": 0,
                "total_time": "00:00:00",
                "total_time_seconds": 0,
                "avg_pace": "--",
                "avg_distance": 0,
                "marathon_progress": 0,
            },
            "latest_run": None,
            "this_week": {
                "runs": 0,
                "distance": 0,
                "time": "00:00:00",
            },
            "recent_runs": [],
            "activities": [],
        }
        return empty

    runs.sort(
        key=lambda r: r.get("_dt", datetime.min.replace(tzinfo=timezone.utc)),
        reverse=True,
    )

    total_distance = sum(run["distance"] for run in runs)
    total_time_seconds = sum(run["time_seconds"] for run in runs)
    avg_distance = total_distance / len(runs)
    avg_pace_seconds = (
        total_time_seconds / total_distance if total_distance > 0 else 0
    )

    today = datetime.now(timezone.utc).date()
    week_ago = today - timedelta(days=7)
    weekly_runs = [run for run in runs if run.get("_dt").date() >= week_ago]
    weekly_distance = sum(run["distance"] for run in weekly_runs)
    weekly_time_seconds = sum(run["time_seconds"] for run in weekly_runs)

    latest_run = runs[0].copy()

    # Clean temp keys
    for run in runs:
        run.pop("_dt", None)
    latest_run.pop("_dt", None)

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "stats": {
            "total_runs": len(runs),
            "total_distance": round(total_distance, 2),
            "total_time": format_time_hours(total_time_seconds),
            "total_time_seconds": int(round(total_time_seconds)),
            "avg_pace": format_pace_label(avg_pace_seconds),
            "avg_distance": round(avg_distance, 2),
            "marathon_progress": round(
                (total_distance / 42.195) * 100, 1
            ),
        },
        "latest_run": latest_run,
        "this_week": {
            "runs": len(weekly_runs),
            "distance": round(weekly_distance, 2),
            "time": format_time_hours(weekly_time_seconds),
        },
        "recent_runs": runs[:10],
        "activities": runs,
    }

    return summary


def parse_fit_file(file_path):
    """Parse ficheiro .FIT do Garmin (requer fitparse)."""
    try:
        from fitparse import FitFile
    except ImportError:
        print("⚠️  fitparse não instalado. Instala com: pip install fitparse")
        return None

    fitfile = FitFile(file_path)

    activity_data = {
        "distance": 0,
        "total_time": 0,
        "average_heartrate": 0,
        "max_heart_rate": 0,
        "calories": 0,
        "date": None,
        "title": Path(file_path).stem,
    }

    field_handlers = {
        "total_distance": lambda value: value / 1000,  # metros -> km
        "total_timer_time": lambda value: value,
        "avg_heart_rate": lambda value: value,
        "max_heart_rate": lambda value: value,
        "total_calories": lambda value: value,
    }

    for record in fitfile.get_messages("session"):
        for field in record:
            handler = field_handlers.get(field.name)
            if handler:
                key_map = {
                    "total_distance": "distance",
                    "total_timer_time": "total_time",
                    "avg_heart_rate": "average_heartrate",
                    "max_heart_rate": "max_heart_rate",
                    "total_calories": "calories",
                }
                activity_data[key_map[field.name]] = handler(field.value)
            elif field.name == "start_time":
                activity_data["date"] = field.value.isoformat()

    return activity_data


def parse_csv_file(file_path):
    """
    Parse ficheiro CSV exportado do Garmin Connect
    Retorna lista de atividades
    """
    import csv
    
    activities = []

    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            try:
                distance = to_float(row.get("Distância", row.get("Distance")))
                if distance <= 0:
                    continue

                time_seconds = parse_time_string(row.get("Tempo", row.get("Time", "0")))
                avg_hr = to_int(row.get("FC Média", row.get("Avg HR")))
                max_hr = to_int(row.get("FC Máx", row.get("Max HR")))
                calories = to_int(row.get("Calorias", row.get("Calories")))

                activity_data = {
                    "date": row.get("Date", row.get("Data")),
                    "date_display": row.get("Data"),
                    "distance": distance,
                    "total_time": time_seconds,
                    "average_heartrate": avg_hr,
                    "max_heart_rate": max_hr,
                    "calories": calories or 0,
                    "title": row.get("Title")
                    or row.get("Activity Name")
                    or row.get("Name")
                    or "Corrida",
                    "total_ascent": to_int(row.get("Total Ascent")),
                }

                activities.append(activity_data)

            except (ValueError, KeyError) as error:
                print(f"   ⚠️  Erro ao processar linha: {error}")
                continue

    return activities


def parse_time_string(time_str):
    """
    Converte string de tempo (HH:MM:SS) para segundos
    """
    try:
        parts = time_str.split(':')
        if len(parts) == 3:
            h, m, s = map(int, parts)
            return h * 3600 + m * 60 + s
        elif len(parts) == 2:
            m, s = map(int, parts)
            return m * 60 + s
        else:
            return int(time_str)
    except Exception:
        return 0


def import_garmin_data():
    """
    Importa todos os ficheiros da pasta garmin_exports
    """
    # Cria pasta se não existir
    Path(GARMIN_EXPORTS_DIR).mkdir(parents=True, exist_ok=True)
    
    activities = []
    
    # Processa ficheiros .FIT
    fit_files = glob.glob(f"{GARMIN_EXPORTS_DIR}/*.fit")
    for fit_file in fit_files:
        print(f"📁 A processar {os.path.basename(fit_file)}...")
        data = parse_fit_file(fit_file)
        if data:
            activities.append(data)
            print(f"   ✅ {data['distance']:.2f}km em {data['total_time']/60:.1f}min")
    
    # Processa ficheiros .CSV
    csv_files = glob.glob(f"{GARMIN_EXPORTS_DIR}/*.csv")
    for csv_file in csv_files:
        print(f"📁 A processar {os.path.basename(csv_file)}...")
        csv_activities = parse_csv_file(csv_file)
        if csv_activities:
            activities.extend(csv_activities)
            print(f"   ✅ {len(csv_activities)} atividade(s) importada(s)")
    
    if not activities:
        print(f"\n⚠️  Nenhum ficheiro encontrado em '{GARMIN_EXPORTS_DIR}'")
        print("📝 Exporta atividades do Garmin Connect e coloca nessa pasta.")
        return
    
    summary = build_summary(activities)
    
    # Guarda JSON
    Path(OUTPUT_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    stats = summary["stats"]
    print("\n✅ Dados importados com sucesso!")
    print(
        f"📊 Total: {stats['total_runs']} corridas | {stats['total_distance']:.2f}km"
    )
    print(f"💾 Ficheiro gerado: {OUTPUT_FILE}")


if __name__ == "__main__":
    print("🏃 Garmin Data Importer - joaofaquino.run\n")
    import_garmin_data()
