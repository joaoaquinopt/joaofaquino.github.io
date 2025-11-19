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
from datetime import datetime
from pathlib import Path

# Pasta onde colocas os exports do Garmin
GARMIN_EXPORTS_DIR = "data/garmin_exports"
OUTPUT_FILE = "public/data/strava_summary.json"


def parse_fit_file(file_path):
    """
    Parse ficheiro .FIT do Garmin
    Requer: pip install fitparse
    """
    try:
        from fitparse import FitFile
    except ImportError:
        print("⚠️  fitparse não instalado. Instala com: pip install fitparse")
        return None
    
    fitfile = FitFile(file_path)
    
    activity_data = {
        "distance": 0,
        "total_time": 0,
        "average_speed": 0,
        "max_speed": 0,
        "average_heartrate": 0,
        "calories": 0,
        "date": None,
    }
    
    for record in fitfile.get_messages('session'):
        for field in record:
            if field.name == 'total_distance':
                activity_data['distance'] = field.value / 1000  # metros -> km
            elif field.name == 'total_timer_time':
                activity_data['total_time'] = field.value  # segundos
            elif field.name == 'avg_speed':
                activity_data['average_speed'] = field.value * 3.6  # m/s -> km/h
            elif field.name == 'max_speed':
                activity_data['max_speed'] = field.value * 3.6
            elif field.name == 'avg_heart_rate':
                activity_data['average_heartrate'] = field.value
            elif field.name == 'total_calories':
                activity_data['calories'] = field.value
            elif field.name == 'start_time':
                activity_data['date'] = field.value.isoformat()
    
    # Calcula pace (min/km)
    if activity_data['distance'] > 0 and activity_data['total_time'] > 0:
        pace_seconds = activity_data['total_time'] / activity_data['distance']
        activity_data['average_pace'] = pace_seconds / 60  # min/km
    else:
        activity_data['average_pace'] = 0
    
    return activity_data


def parse_csv_file(file_path):
    """
    Parse ficheiro CSV exportado do Garmin Connect
    Retorna lista de atividades
    """
    import csv
    
    activities = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Garmin CSV geralmente tem estas colunas
            try:
                distance = float(row.get('Distância', row.get('Distance', '0')).replace(',', '.'))
                
                # Se distância é 0, pula
                if distance == 0:
                    continue
                
                activity_data = {
                    "date": row.get('Data', row.get('Date', '')),
                    "distance": distance,
                    "total_time": parse_time_string(row.get('Tempo', row.get('Time', '0:00:00'))),
                    "calories": int(row.get('Calorias', row.get('Calories', '0')).replace(',', '')),
                    "average_heartrate": int(float(row.get('FC Média', row.get('Avg HR', '0')).replace(',', '.'))),
                }
                
                # Calcula pace e velocidade
                if activity_data['distance'] > 0 and activity_data['total_time'] > 0:
                    pace_seconds = activity_data['total_time'] / activity_data['distance']
                    activity_data['average_pace'] = pace_seconds / 60
                    activity_data['average_speed'] = (activity_data['distance'] / activity_data['total_time']) * 3600
                else:
                    activity_data['average_pace'] = 0
                    activity_data['average_speed'] = 0
                
                activities.append(activity_data)
                
            except (ValueError, KeyError) as e:
                print(f"   ⚠️  Erro ao processar linha: {e}")
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
    except:
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
        print(f"📝 Exporta atividades do Garmin Connect e coloca nessa pasta.")
        return
    
    # Ordena por data (mais recente primeiro)
    activities.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    # Calcula estatísticas
    total_distance = sum(a['distance'] for a in activities)
    total_time = sum(a['total_time'] for a in activities)
    total_runs = len(activities)
    
    avg_distance = total_distance / total_runs if total_runs > 0 else 0
    avg_pace = (total_time / 60) / total_distance if total_distance > 0 else 0
    
    summary = {
        "total_distance": round(total_distance, 2),
        "total_time": total_time,
        "total_runs": total_runs,
        "avg_distance": round(avg_distance, 2),
        "avg_pace": round(avg_pace, 2),
        "activities": activities,
        "last_updated": datetime.now().isoformat(),
        "source": "Garmin Connect Export"
    }
    
    # Guarda JSON
    Path(OUTPUT_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Dados importados com sucesso!")
    print(f"📊 Total: {total_runs} corridas | {total_distance:.2f}km")
    print(f"💾 Ficheiro gerado: {OUTPUT_FILE}")


if __name__ == "__main__":
    print("🏃 Garmin Data Importer - joaofaquino.run\n")
    import_garmin_data()
