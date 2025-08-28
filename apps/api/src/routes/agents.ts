import express from 'express';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = express.Router();
const execAsync = promisify(exec);

const AGENTS_DIR = path.join(__dirname, '../../../agents');

/**
 * Get system health status from all agents
 */
router.get('/health', async (req, res) => {
  try {
    const { stdout } = await execAsync('node orchestrator.js health', {
      cwd: AGENTS_DIR,
      timeout: 30000
    });
    
    const health = JSON.parse(stdout);
    res.json(health);
  } catch (error) {
    console.error('Agent health check failed:', error);
    res.status(500).json({
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get system statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const { stdout } = await execAsync('node orchestrator.js stats', {
      cwd: AGENTS_DIR,
      timeout: 30000
    });
    
    const stats = JSON.parse(stdout);
    res.json(stats);
  } catch (error) {
    console.error('Agent stats collection failed:', error);
    res.status(500).json({
      error: 'Stats collection failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * List available workflows
 */
router.get('/workflows', async (req, res) => {
  try {
    const { stdout } = await execAsync('node orchestrator.js workflows', {
      cwd: AGENTS_DIR,  
      timeout: 30000
    });
    
    const workflows = JSON.parse(stdout);
    res.json(workflows);
  } catch (error) {
    console.error('Workflow listing failed:', error);
    res.status(500).json({
      error: 'Workflow listing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Execute a workflow
 */
router.post('/workflows/:workflowName/execute', async (req, res) => {
  try {
    const { workflowName } = req.params;
    const parameters = req.body;
    
    // Validate workflow name to prevent command injection
    if (!/^[a-zA-Z0-9-_]+$/.test(workflowName)) {
      return res.status(400).json({
        error: 'Invalid workflow name'
      });
    }
    
    const { stdout } = await execAsync(`node orchestrator.js execute ${workflowName}`, {
      cwd: AGENTS_DIR,
      timeout: 300000 // 5 minutes for workflow execution
    });
    
    const result = JSON.parse(stdout);
    return res.json(result);
  } catch (error) {
    console.error('Workflow execution failed:', error);
    return res.status(500).json({
      error: 'Workflow execution failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Run daily maintenance workflow
 */
router.post('/maintenance', async (req, res) => {
  try {
    const { stdout } = await execAsync('node orchestrator.js maintenance', {
      cwd: AGENTS_DIR,
      timeout: 300000 // 5 minutes for maintenance
    });
    
    const result = JSON.parse(stdout);
    return res.json(result);
  } catch (error) {
    console.error('Maintenance execution failed:', error);
    return res.status(500).json({
      error: 'Maintenance execution failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Test agent connectivity
 */
router.post('/test', async (req, res) => {
  try {
    const { stdout } = await execAsync('node setup.js test', {
      cwd: AGENTS_DIR,
      timeout: 60000
    });
    
    return res.json({
      message: 'Agent connectivity test completed',
      output: stdout
    });
  } catch (error) {
    console.error('Agent test failed:', error);
    return res.status(500).json({
      error: 'Agent test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Check environment configuration
 */
router.get('/environment', async (req, res) => {
  try {
    const { stdout } = await execAsync('node setup.js check', {
      cwd: AGENTS_DIR,
      timeout: 30000
    });
    
    return res.json({
      message: 'Environment check completed',
      output: stdout
    });
  } catch (error) {
    console.error('Environment check failed:', error);
    return res.status(500).json({
      error: 'Environment check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;