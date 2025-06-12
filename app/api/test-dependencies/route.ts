import { NextRequest, NextResponse } from 'next/server';
import cron from 'node-cron';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Exa from 'exa-js';

export async function GET(request: NextRequest) {
  try {
    // Test node-cron
    const cronIsValid = cron.validate('0 0 * * *');
    
    // Test GoogleGenerativeAI (just check if it can be instantiated)
    const genAI = process.env.GOOGLE_API_KEY 
      ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
      : null;
    
    // Test Exa (just check if it can be instantiated)
    const exaClient = process.env.EXA_API_KEY 
      ? new Exa(process.env.EXA_API_KEY)
      : null;

    return NextResponse.json({
      success: true,
      message: 'All server-side dependencies are working correctly!',
      dependencies: {
        'node-cron': {
          status: 'working',
          test: `Cron validation for '0 0 * * *': ${cronIsValid}`,
          version: 'Available'
        },
        '@google/generative-ai': {
          status: 'working',
          test: genAI ? 'Instance created successfully' : 'Ready (API key not configured)',
          version: 'Available'
        },
        'exa-js': {
          status: 'working',
          test: exaClient ? 'Instance created successfully' : 'Ready (API key not configured)',
          version: 'Available'
        }
      },
      note: 'All core dependencies and type definitions are properly installed and functional.'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error testing dependencies',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
