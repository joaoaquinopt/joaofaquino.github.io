import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'garmin_summary.json');
    
    // Verificar se o ficheiro existe
    if (!fs.existsSync(filePath)) {
      // Retornar array vazio se ainda não houver dados
      return NextResponse.json([]);
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading Garmin data:', error);
    return NextResponse.json({ error: 'Failed to load Garmin data' }, { status: 500 });
  }
}
