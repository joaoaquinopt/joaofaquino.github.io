"""
Process Garmin CSV export and generate JSON summary for the website
Reads: data/garmin_exports/Todas_As_Corridas.csv
Writes: public/data/garmin_summary.json
"""

import csv
import json
from datetime import datetime
from pathlib import Path


def parse_time(time_str):
    """Convert HH:MM:SS to seconds"""
    if not time_str or time_str == "--":
        return 0
    parts = time_str.split(":")
    if len(parts) == 3:
        h, m, s = parts
        return int(h) * 3600 + int(m) * 60 + float(s)
    elif len(parts) == 2:
        m, s = parts
        return int(m) * 60 + float(s)
    return 0


def parse_pace(pace_str):
    """Convert pace string (MM:SS) to min/km"""
    if not pace_str or pace_str == "--":
        return 0
    parts = pace_str.split(":")
    if len(parts) == 2:
        m, s = parts
        return int(m) + int(s) / 60
    return 0


def format_pace(seconds_per_km):
    """Convert seconds/km to MM:SS format"""
    if seconds_per_km == 0:
        return "--"
    minutes = int(seconds_per_km // 60)
    seconds = int(seconds_per_km % 60)
    return f"{minutes}:{seconds:02d}"


def process_garmin_csv():
    """Process Garmin CSV and generate summary statistics"""
    
    csv_path = Path("data/garmin_exports/Todas_As_Corridas.csv")
    output_path = Path("public/data/garmin_summary.json")
    
    if not csv_path.exists():
        print(f"❌ CSV not found: {csv_path}")
        return
    
    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    runs = []
    total_distance = 0
    total_time = 0
    total_runs = 0
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Only process Running activities
            if row['Activity Type'] != 'Running':
                continue
            
            # Parse data
            date_str = row['Date']
            distance = float(row['Distance']) if row['Distance'] else 0
            time_seconds = parse_time(row['Time'])
            avg_pace_str = row['Avg Pace']
            title = row['Title']
            
            # Skip if no distance
            if distance == 0:
                continue
            
            # Calculate pace in seconds per km
            pace_seconds = (time_seconds / distance) if distance > 0 else 0
            
            # Format date
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
                formatted_date = date_obj.strftime("%d/%m/%Y")
                iso_date = date_obj.strftime("%Y-%m-%d")
            except:
                formatted_date = date_str
                iso_date = date_str
            
            # Add to runs list
            runs.append({
                "date": formatted_date,
                "iso_date": iso_date,
                "title": title,
                "distance": round(distance, 2),
                "time": row['Time'],
                "time_seconds": time_seconds,
                "pace": format_pace(pace_seconds),
                "avg_hr": row['Avg HR'] if row['Avg HR'] != '--' else None,
                "max_hr": row['Max HR'] if row['Max HR'] != '--' else None,
                "calories": int(row['Calories']) if row['Calories'] else 0,
                "elevation_gain": int(row['Total Ascent']) if row['Total Ascent'] and row['Total Ascent'] != '--' else 0
            })
            
            # Accumulate totals
            total_distance += distance
            total_time += time_seconds
            total_runs += 1
    
    # Sort runs by date (most recent first)
    runs.sort(key=lambda x: x['iso_date'], reverse=True)
    
    # Calculate averages
    avg_pace_seconds = (total_time / total_distance) if total_distance > 0 else 0
    avg_distance = total_distance / total_runs if total_runs > 0 else 0
    
    # Get latest run
    latest_run = runs[0] if runs else None
    
    # Calculate this week's stats (last 7 days)
    from datetime import date, timedelta
    today = date.today()
    week_ago = today - timedelta(days=7)
    
    weekly_runs = [
        r for r in runs 
        if datetime.strptime(r['iso_date'], "%Y-%m-%d").date() >= week_ago
    ]
    
    weekly_distance = sum(r['distance'] for r in weekly_runs)
    weekly_time = sum(r['time_seconds'] for r in weekly_runs)
    
    # Build summary object
    summary = {
        "generated_at": datetime.now().isoformat(),
        "stats": {
            "total_runs": total_runs,
            "total_distance": round(total_distance, 2),
            "total_time": format_time_hours(total_time),
            "total_time_seconds": total_time,
            "avg_pace": format_pace(avg_pace_seconds),
            "avg_distance": round(avg_distance, 2),
            "marathon_progress": round((total_distance / 42.195) * 100, 1)
        },
        "latest_run": latest_run,
        "this_week": {
            "runs": len(weekly_runs),
            "distance": round(weekly_distance, 2),
            "time": format_time_hours(weekly_time)
        },
        "recent_runs": runs[:10]  # Last 10 runs
    }
    
    # Write JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Garmin data processed successfully!")
    print(f"📊 Total runs: {total_runs}")
    print(f"🏃 Total distance: {total_distance:.2f} km")
    print(f"⏱️  Average pace: {format_pace(avg_pace_seconds)}/km")
    print(f"📅 Latest run: {latest_run['date']} - {latest_run['distance']}km")
    print(f"💾 Output: {output_path}")


def format_time_hours(seconds):
    """Convert seconds to HH:MM:SS format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


if __name__ == "__main__":
    process_garmin_csv()
