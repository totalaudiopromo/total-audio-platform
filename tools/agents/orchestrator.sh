#!/bin/bash

# Orchestrator Shell Script
# Easy access to orchestrator functionality

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'  
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}🚀 ORCHESTRATOR CONTROL CENTER${NC}" 
    echo -e "${BLUE}================================${NC}"
    echo
}

show_usage() {
    print_header
    echo -e "${CYAN}Usage:${NC} ./orchestrator.sh [command] [options]"
    echo
    echo -e "${YELLOW}Commands:${NC}"
    echo "  health                    - Health check all systems"
    echo "  workflows                 - List available workflows"
    echo "  execute <workflow>        - Execute a specific workflow"
    echo "  report                    - Generate system report"
    echo "  chat                      - Interactive orchestrator chat"
    echo "  agents                    - List all available agents"
    echo
    echo -e "${YELLOW}Real Service Workflows:${NC}"
    echo "  real-agency-onboarding    - Complete agency onboarding"
    echo "  real-campaign-launch      - Launch campaign with real integrations"
    echo "  real-contact-enrichment   - Contact enrichment using real services"
    echo "  real-service-maintenance  - System maintenance with real services"
    echo "  ai-campaign-optimization  - AI-powered campaign optimization"
    echo
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./orchestrator.sh health"
    echo "  ./orchestrator.sh execute real-contact-enrichment"
    echo "  ./orchestrator.sh chat"
}

case "$1" in
    "health")
        print_header
        echo -e "${CYAN}Running orchestrator health check...${NC}"
        node agent-manager.js run orchestrator-real health
        ;;
    
    "workflows")
        print_header  
        echo -e "${CYAN}Available orchestrator workflows:${NC}"
        node agent-manager.js run orchestrator-real workflows
        ;;
    
    "execute")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Workflow name required${NC}"
            echo "Usage: ./orchestrator.sh execute <workflow-name>"
            exit 1
        fi
        
        print_header
        echo -e "${CYAN}Executing workflow: ${YELLOW}$2${NC}"
        DATABASE_URL="file:../../dev.db" node agent-manager.js run orchestrator-real execute "$2"
        ;;
    
    "report")
        print_header
        echo -e "${CYAN}Generating system report...${NC}"
        node agent-manager.js run orchestrator-real report
        ;;
    
    "chat")
        print_header
        echo -e "${CYAN}Starting interactive chat with orchestrator...${NC}"
        node agent-manager.js chat orchestrator-real
        ;;
    
    "agents")
        print_header
        echo -e "${CYAN}All available agents:${NC}"
        node agent-manager.js list
        ;;
    
    *)
        show_usage
        ;;
esac