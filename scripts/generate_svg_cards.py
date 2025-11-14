import json, os
from datetime import datetime

JSON_PATH = "frontend/public/data/strava_summary.json"
OUTPUT_PATH = "frontend/public/cards/last_activity.svg"

def generate_svg(activity):
    svg = f"""<svg width="400" height="180" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="180" rx="12" ry="12" fill="#0A2342"/>
      <text x="20" y="40" fill="#fff" font-size="20" font-family="Inter">🏃‍♂️ Última Corrida</text>
      <text x="20" y="80" fill="#fff" font-size="16">Distância: {activity['distance']} km</text>
      <text x="20" y="110" fill="#fff" font-size="16">Tempo: {activity['moving_time']} s</text>
      <text x="20" y="140" fill="#fff" font-size="16">Ritmo: {activity['pace']}</text>
      <text x="20" y="165" fill="#fff" font-size="14">{activity['date']}</text>
    </svg>"""
    return svg

def main():
    if not os.path.exists(JSON_PATH):
        print("❌ JSON não encontrado.")
        return
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not data:
        print("❌ Nenhuma atividade encontrada.")
        return
    last = data[0]
    svg = generate_svg(last)
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"✅ SVG gerado em {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
