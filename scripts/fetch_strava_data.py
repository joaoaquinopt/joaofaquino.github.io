import requests
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Carrega as credenciais
load_dotenv()

CLIENT_ID = os.getenv("STRAVA_CLIENT_ID")
CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("STRAVA_REFRESH_TOKEN")

# Caminho onde o JSON será salvo
OUTPUT_PATH = "frontend/public/data/strava_summary.json"

def refresh_access_token():
    """Atualiza o token de acesso da Strava API"""
    url = "https://www.strava.com/oauth/token"
    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "refresh_token",
        "refresh_token": REFRESH_TOKEN
    }
    response = requests.post(url, data=payload)
    response.raise_for_status()
    return response.json()["access_token"]

def fetch_activities(access_token, per_page=10):
    """Busca atividades recentes do atleta"""
    url = f"https://www.strava.com/api/v3/athlete/activities?per_page={per_page}"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def format_activity(activity):
    """Transforma os dados crus em formato simplificado"""
    distance_km = activity["distance"] / 1000
    moving_time = activity["moving_time"]
    pace_seconds = moving_time / distance_km if distance_km else 0
    pace_min_km = f"{int(pace_seconds // 60)}:{int(pace_seconds % 60):02d}/km"

    return {
        "date": datetime.strptime(activity["start_date"], "%Y-%m-%dT%H:%M:%SZ").strftime("%Y-%m-%d"),
        "distance": round(distance_km, 2),
        "moving_time": moving_time,
        "pace": pace_min_km
    }

def save_to_json(activities):
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(activities, f, indent=2, ensure_ascii=False)
    print(f"✅ Dados salvos em {OUTPUT_PATH}")

if __name__ == "__main__":
    print("🔄 Atualizando dados do Strava...")
    try:
        token = refresh_access_token()
        activities = fetch_activities(token)
        formatted = [format_activity(a) for a in activities]
        save_to_json(formatted)
        print("🏁 Atualização concluída com sucesso.")
    except Exception as e:
        print("❌ Erro ao atualizar dados:", e)