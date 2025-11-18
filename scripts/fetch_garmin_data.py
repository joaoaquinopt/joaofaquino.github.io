"""
Garmin Connect API Integration Script

Este script faz a autenticação e coleta de dados da API Garmin Connect.
Ainda está pendente a aprovação da API pela Garmin.

Documentação: https://developer.garmin.com/gc-developer-program/overview/
"""

import os
import json
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
import urllib3

# Suprimir avisos SSL (temporário)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Carregar variáveis de ambiente do diretório pai
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
load_dotenv(dotenv_path=env_path)

# Configurações Garmin
GARMIN_CONSUMER_KEY = os.getenv('GARMIN_CONSUMER_KEY')
GARMIN_CONSUMER_SECRET = os.getenv('GARMIN_CONSUMER_SECRET')
GARMIN_ACCESS_TOKEN = os.getenv('GARMIN_ACCESS_TOKEN')
GARMIN_ACCESS_SECRET = os.getenv('GARMIN_ACCESS_SECRET')

def get_garmin_activities():
    """
    Busca atividades recentes do Garmin Connect.
    
    NOTA: Aguardando aprovação da Garmin para acessar a API.
    Por enquanto, retorna estrutura vazia.
    """
    
    if not all([GARMIN_CONSUMER_KEY, GARMIN_CONSUMER_SECRET]):
        print("⚠️  Credenciais Garmin não configuradas em .env.local")
        print("   Aguardando aprovação da API pela Garmin Health.")
        return []
    
    # TODO: Implementar autenticação OAuth1 quando API for aprovada
    # URL: https://connectapi.garmin.com/oauth-service/oauth/request_token
    
    print("🔄 Garmin API ainda não disponível")
    print("   Status: Aguardando aprovação")
    return []

def format_garmin_activity(activity):
    """
    Formata uma atividade do Garmin para o formato padrão.
    """
    return {
        'date': activity.get('startTimeLocal', ''),
        'distance': activity.get('distance', 0) / 1000,  # metros para km
        'moving_time': activity.get('duration', 0),
        'pace': calculate_pace(activity.get('distance', 0), activity.get('duration', 0)),
        'source': 'garmin'
    }

def calculate_pace(distance_meters, time_seconds):
    """Calcula o pace em min/km"""
    if distance_meters == 0:
        return "0:00/km"
    
    distance_km = distance_meters / 1000
    pace_seconds = time_seconds / distance_km
    pace_minutes = int(pace_seconds // 60)
    pace_secs = int(pace_seconds % 60)
    
    return f"{pace_minutes}:{pace_secs:02d}/km"

def save_garmin_data():
    """
    Salva os dados do Garmin em JSON.
    """
    activities = get_garmin_activities()
    
    output_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'public',
        'data',
        'garmin_summary.json'
    )
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(activities, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Dados Garmin salvos: {len(activities)} atividades")
    print(f"   Ficheiro: {output_path}")

if __name__ == '__main__':
    print("=" * 60)
    print("🏃 Garmin Connect API - Data Sync")
    print("=" * 60)
    save_garmin_data()
    print("=" * 60)
