import { NextResponse } from 'next/server';
import tables from '@/mocks/table.json';

export async function GET() {
    return NextResponse.json(tables);
}
