import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Type definition for Garmin summary data
interface GarminData {
  generated_at: string;
  stats: {
    total_runs: number;
    total_distance: number;
    total_time: string;
    total_time_seconds: number;
    avg_pace: string;
    avg_distance: number;
    marathon_progress: number;
  };
  latest_run?: Record<string, unknown>;
  this_week?: Record<string, unknown>;
  recent_runs?: Array<Record<string, unknown>>;
  activities?: Array<Record<string, unknown>>;
}

// Simple in-memory cache with timestamp
let cache: { data: GarminData; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check cache first
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    const filePath = path.join(process.cwd(), 'public', 'data', 'garmin_summary.json');
    
    // Verificar se o ficheiro existe
    if (!fs.existsSync(filePath)) {
      // Retornar array vazio se ainda não houver dados
      return NextResponse.json([]);
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents) as GarminData;
    
    // Update cache
    cache = { data, timestamp: Date.now() };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading Garmin data:', error);
    return NextResponse.json({ error: 'Failed to load Garmin data' }, { status: 500 });
  }
}
