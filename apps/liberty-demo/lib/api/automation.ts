import { AUTOMATION_WORKFLOWS } from '@/lib/constants';
import { AutomationWorkflow } from '@/lib/types';

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const automationApi = {
  getWorkflows: async (): Promise<AutomationWorkflow[]> => {
    await delay(800);
    return AUTOMATION_WORKFLOWS;
  },

  getWorkflowById: async (id: string): Promise<AutomationWorkflow | undefined> => {
    await delay(500);
    return AUTOMATION_WORKFLOWS.find(w => w.id === id);
  },

  runNode: async (nodeId: string): Promise<{ success: boolean; timestamp: string }> => {
    await delay(1500); // Cinematic loading time
    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  updateNodeConfiguration: async (nodeId: string, config: any): Promise<boolean> => {
    await delay(1000);
    console.log(`Updated configuration for node ${nodeId}`, config);
    return true;
  },
};
