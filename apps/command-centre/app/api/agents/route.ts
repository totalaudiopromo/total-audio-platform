import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { command, type } = await request.json();

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }

    // Path to the Sprint Week orchestrator
    const orchestratorPath = path.join(process.cwd(), '..', '..', 'tools', 'agents', 'sprint-week-orchestrator.js');
    
    let commandToRun: string;
    
    if (command === 'generate' && type) {
      commandToRun = `cd "${path.dirname(orchestratorPath)}" && node sprint-week-orchestrator.js generate ${type}`;
    } else if (command === 'workflow' && type) {
      commandToRun = `cd "${path.dirname(orchestratorPath)}" && node sprint-week-orchestrator.js workflow ${type}`;
    } else {
      commandToRun = `cd "${path.dirname(orchestratorPath)}" && node sprint-week-orchestrator.js ${command}`;
    }

    console.log('Executing command:', commandToRun);
    
    const { stdout, stderr } = await execAsync(commandToRun, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    if (stderr) {
      console.error('Agent stderr:', stderr);
      // Don't return error for stderr as agents use console.log for status updates
    }

    // Parse the JSON output from the agent
    const lines = stdout.trim().split('\n');
    const lastLine = lines[lines.length - 1];
    
    try {
      const result = JSON.parse(lastLine);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('Failed to parse agent output:', lastLine);
      console.error('Parse error:', parseError);
      
      // Return the raw output if JSON parsing fails
      return NextResponse.json({
        success: true,
        output: stdout,
        rawOutput: true
      });
    }
    
  } catch (error) {
    console.error('Agent execution error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Check for specific error types
    if (errorMessage.includes('timeout')) {
      return NextResponse.json({ 
        error: 'Agent execution timed out. Please try again.' 
      }, { status: 408 });
    }
    
    if (errorMessage.includes('ENOENT')) {
      return NextResponse.json({ 
        error: 'Agent not found. Please ensure the Sprint Week orchestrator is properly installed.' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: `Agent execution failed: ${errorMessage}` 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Health check endpoint
    const orchestratorPath = path.join(process.cwd(), '..', '..', 'tools', 'agents', 'sprint-week-orchestrator.js');
    const commandToRun = `cd "${path.dirname(orchestratorPath)}" && node sprint-week-orchestrator.js health`;
    
    const { stdout } = await execAsync(commandToRun, {
      timeout: 10000
    });
    
    const lines = stdout.trim().split('\n');
    const lastLine = lines[lines.length - 1];
    
    try {
      const healthStatus = JSON.parse(lastLine);
      return NextResponse.json({
        status: 'healthy',
        agents: healthStatus,
        timestamp: new Date().toISOString()
      });
    } catch (parseError) {
      return NextResponse.json({
        status: 'unknown',
        rawOutput: stdout,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({ 
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}