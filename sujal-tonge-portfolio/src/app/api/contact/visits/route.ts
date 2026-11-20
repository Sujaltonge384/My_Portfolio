import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_DIR = path.join(process.cwd(), 'data');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');
const BASE_OFFSET = 1420;

async function readStoredCount(): Promise<number> {
  try {
    const raw = await fs.readFile(VISITS_FILE, 'utf8');
    const parsed = JSON.parse(raw) as { count?: number };
    if (typeof parsed.count === 'number' && Number.isFinite(parsed.count)) {
      return parsed.count;
    }
    return 0;
  } catch {
    return 0;
  }
}

async function writeStoredCount(count: number): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(VISITS_FILE, JSON.stringify({ count, updatedAt: new Date().toISOString() }, null, 2), 'utf8');
  } catch {
    // Ignore write errors in read-only serverless environments
  }
}

export async function GET() {
  const current = await readStoredCount();
  const total = BASE_OFFSET + current;
  return NextResponse.json({
    count: total,
    formatted: total.toLocaleString('en-US'),
  });
}

export async function POST() {
  const current = await readStoredCount();
  const next = current + 1;
  await writeStoredCount(next);
  const total = BASE_OFFSET + next;
  return NextResponse.json({
    count: total,
    formatted: total.toLocaleString('en-US'),
  });
}