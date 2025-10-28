#!/bin/bash

# Dan - Total Audio Master Orchestrator Startup Script
# Quick launcher for Dan with common commands

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║             DAN - Total Audio Orchestrator               ║"
echo "║                                                          ║"
echo "║   Master coordinator for 31+ Total Audio Promo agents   ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if node is available
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

# Function to show usage
show_usage() {
    echo ""
    echo -e "${GREEN}Available Commands:${NC}"
    echo ""
    echo "  ./start-dan.sh                    Show this help"
    echo "  ./start-dan.sh health             System health check"
    echo "  ./start-dan.sh workflows          List all available workflows"
    echo "  ./start-dan.sh agents             List all agents by category"
    echo "  ./start-dan.sh metrics            Show system metrics"
    echo "  ./start-dan.sh campaigns          List active campaigns"
    echo "  ./start-dan.sh dashboard          Start verification dashboard"
    echo ""
    echo -e "${GREEN}Run Workflows:${NC}"
    echo ""
    echo "  ./start-dan.sh workflow <name>    Execute a workflow"
    echo ""
    echo -e "${BLUE}Total Audio Workflows:${NC}"
    echo "  - weekly-newsletter               Generate newsletter"
    echo "  - audio-intel-case-study          Create case study"
    echo "  - contact-enrichment-batch        Bulk contact enrichment"
    echo "  - social-content-week             Weekly social content"
    echo "  - business-analytics-report       Monthly analytics"
    echo ""
    echo -e "${BLUE}Liberty Client Workflows:${NC}"
    echo "  - complete-campaign <transcript>  Full radio campaign"
    echo "  - transcript-to-brief <file>      Meeting to brief"
    echo "  - warm-monitoring                 Real-time tracking"
    echo "  - campaign-reporting              Generate report"
    echo ""
}

# Check command
COMMAND=${1:-"help"}

case "$COMMAND" in
    health)
        echo -e "${GREEN}🏥 Running health check...${NC}"
        node dan.js health
        ;;

    workflows)
        echo -e "${GREEN}📋 Available workflows:${NC}"
        node dan.js workflows
        ;;

    agents)
        echo -e "${GREEN}🤖 Agent registry:${NC}"
        node dan.js agents
        ;;

    metrics)
        echo -e "${GREEN}📊 System metrics:${NC}"
        node dan.js metrics
        ;;

    campaigns)
        echo -e "${GREEN}🎯 Active campaigns:${NC}"
        node dan.js campaigns
        ;;

    dashboard)
        echo -e "${GREEN}📺 Starting verification dashboard...${NC}"
        echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
        echo ""
        node dan.js dashboard
        ;;

    workflow)
        WORKFLOW_NAME=$2
        if [ -z "$WORKFLOW_NAME" ]; then
            echo -e "${YELLOW}⚠️  Please specify a workflow name${NC}"
            show_usage
            exit 1
        fi

        WORKFLOW_ARG=$3
        echo -e "${GREEN}🎬 Executing workflow: ${WORKFLOW_NAME}${NC}"

        if [ -z "$WORKFLOW_ARG" ]; then
            node dan.js workflow "$WORKFLOW_NAME"
        else
            node dan.js workflow "$WORKFLOW_NAME" "$WORKFLOW_ARG"
        fi
        ;;

    help|--help|-h|"")
        show_usage
        ;;

    *)
        echo -e "${YELLOW}⚠️  Unknown command: $COMMAND${NC}"
        show_usage
        exit 1
        ;;
esac
