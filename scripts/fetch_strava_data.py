import requests
import json
import os
import certifi
import urllib3
from datetime import datetime
from dotenv import load_dotenv

# Disable SSL warnings (temporary for debugging)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Carrega as credenciais
# Load from parent directory (where .env.local is located)
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
load_dotenv(dotenv_path=env_path)

# Configure SSL certificate verification
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
os.environ['SSL_CERT_FILE'] = certifi.where()

CLIENT_ID = os.getenv("STRAVA_CLIENT_ID")
CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("STRAVA_REFRESH_TOKEN")

# Caminho onde o JSON será salvo
OUTPUT_PATH = "public/data/strava_summary.json"

def refresh_access_token():
    """Atualiza o token de acesso da Strava API"""
    url = "https://www.strava.com/oauth/token"
    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "refresh_token",
        "refresh_token": REFRESH_TOKEN
    }
    # Note: Using verify=False temporarily to bypass SSL issues on Windows
    # In production, use: verify=certifi.where()
    response = requests.post(url, data=payload, verify=False)
    response.raise_for_status()
    return response.json()["access_token"]

def fetch_activities(access_token, per_page=10):
    """Busca atividades recentes do atleta"""
    url = f"https://www.strava.com/api/v3/athlete/activities?per_page={per_page}"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers, verify=False)
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
        # Debug: Check if credentials are loaded
        print(f"📋 Client ID: {CLIENT_ID}")
        print(f"📋 Client Secret: {'***' + CLIENT_SECRET[-4:] if CLIENT_SECRET and len(CLIENT_SECRET) > 4 else 'Not set'}")
        print(f"📋 Refresh Token: {'***' + REFRESH_TOKEN[-4:] if REFRESH_TOKEN and len(REFRESH_TOKEN) > 4 else 'Not set'}")
        
        token = refresh_access_token()
        activities = fetch_activities(token)
        formatted = [format_activity(a) for a in activities]
        save_to_json(formatted)
        print("🏁 Atualização concluída com sucesso.")
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP Error: {e}")
        if e.response is not None:
            print(f"📄 Response: {e.response.text}")
    except Exception as e:
        print("❌ Erro ao atualizar dados:", e)