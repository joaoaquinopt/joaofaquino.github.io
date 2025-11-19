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
from datetime import datetime
from pathlib import Path

GARMIN_EXPORTS_DIR = "data/garmin_exports"
OUTPUT_FILE = "public/data/garmin_summary.json"


def load_existing_data():
    """Carrega dados existentes do JSON"""
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"activities": []}


def parse_csv_file(file_path):
    """Parse ficheiro CSV do Garmin"""
    activities = []
    
    with open(file_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            # Ignora linhas sem distância
            if not row.get('Distance') or float(row.get('Distance', 0)) == 0:
                continue
            
            # Parse dos dados
            distance = float(row.get('Distance', 0))
            time_str = row.get('Time', '0')
            
            # Converte tempo (formato HH:MM:SS ou segundos)
            if ':' in time_str:
                time_parts = time_str.split(':')
                total_seconds = int(time_parts[0]) * 3600 + int(time_parts[1]) * 60 + int(time_parts[2])
            else:
                total_seconds = int(float(time_str))
            
            # Calcula pace (min/km)
            average_pace = (total_seconds / 60) / distance if distance > 0 else 0
            
            activity = {
                "date": row.get('Date', datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
                "distance": distance,
                "total_time": total_seconds,
                "calories": int(float(row.get('Calories', 0))),
                "average_heartrate": int(float(row.get('Avg HR', 0))) if row.get('Avg HR') else None,
                "average_pace": average_pace,
                "average_speed": (distance / total_seconds) * 3600 if total_seconds > 0 else 0,
            }
            
            activities.append(activity)
    
    return activities


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
    
    if not new_activities:
        print(f"\n⚠️  Nenhuma atividade nova encontrada!")
        print(f"💡 Exporta novas corridas do Garmin e coloca em '{GARMIN_EXPORTS_DIR}'")
        return
    
    # 4. Combina atividades antigas + novas
    all_activities = existing_activities + new_activities
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
    
    # 6. Guarda JSON atualizado
    Path(OUTPUT_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Dados atualizados com sucesso!")
    print(f"📊 Antes: {len(existing_activities)} corridas")
    print(f"📊 Novas: {len(new_activities)} corridas")
    print(f"📊 Total: {total_runs} corridas | {total_distance:.2f}km")
    print(f"💾 Ficheiro: {OUTPUT_FILE}")


if __name__ == "__main__":
    print("🏃 Garmin Incremental Importer - joaofaquino.run\n")
    import_garmin_incremental()
