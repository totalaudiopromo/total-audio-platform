#!/bin/bash

# TDD Helper Script - Family-friendly TDD planning for Total Audio
# Integrates with existing 25-agent system without changing anything

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'  
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# TDD phase colors
TDD_RED='\033[41;37m'      # Red background, white text
TDD_GREEN='\033[42;30m'    # Green background, black text  
TDD_REFACTOR='\033[44;37m' # Blue background, white text

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}🧪 TDD PLANNING HELPER${NC}" 
    echo -e "${BLUE}Family-friendly development${NC}"
    echo -e "${BLUE}================================${NC}"
    echo
}

show_usage() {
    print_header
    echo -e "${CYAN}Usage:${NC} ./tdd-helper.sh [command] [feature] [product]"
    echo
    echo -e "${YELLOW}Planning Commands (interruptible):${NC}"
    echo "  plan \"feature name\" [audiointel|playlistpulse]    - Full TDD planning"
    echo "  skip-plan \"feature name\" [product]                - Emergency: minimal specs"
    echo "  resume                                            - Continue interrupted planning"
    echo
    echo -e "${YELLOW}Building Commands (focused work):${NC}"
    echo "  build \"feature name\" [product]                    - Use specs to build feature"
    echo "  quick \"feature name\" [product]                    - Bypass TDD, straight to build"
    echo
    echo -e "${YELLOW}Status Commands:${NC}"
    echo "  status                                            - Show what's planned vs built"
    echo "  list                                              - Show all specs created"
    echo
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./tdd-helper.sh plan \"contact filtering\" audiointel"
    echo "  ./tdd-helper.sh build \"contact filtering\" audiointel"
    echo "  ./tdd-helper.sh skip-plan \"bug fix\" audiointel"
    echo "  ./tdd-helper.sh quick \"emergency fix\""
}

update_status() {
    local feature="$1"
    local status="$2"
    local product="${3:-audiointel}"
    
    # Update status.json
    node -e "
        const fs = require('fs');
        const path = './specs/status.json';
        let status = {};
        try {
            status = JSON.parse(fs.readFileSync(path));
        } catch (e) {
            status = { features: {}, last_updated: null, version: '1.0.0' };
        }
        status.features['$feature'] = {
            product: '$product',
            status: '$status',
            updated: new Date().toISOString()
        };
        status.last_updated = new Date().toISOString();
        fs.writeFileSync(path, JSON.stringify(status, null, 2));
    "
}

run_planning_phase() {
    local feature="$1"
    local product="${2:-audiointel}"
    
    echo -e "${TDD_RED} RED PHASE - PLANNING ${NC}"
    echo -e "${CYAN}Planning: ${feature} (${product})${NC}"
    echo -e "${YELLOW}This phase is interruptible - progress saves automatically${NC}"
    echo
    
    update_status "$feature" "planning" "$product"
    
    echo "📱 Creating mobile-first wireframes..."
    node tdd-ui-planner.js create "$feature" "$product"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ UI planning failed${NC}"
        return 1
    fi
    
    echo "🧩 Selecting shadcn/ui components..."
    node tdd-component-selector.js select "$feature" "$product" "form"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Component selection failed${NC}"
        return 1
    fi
    
    echo "📝 Writing test scenarios..."
    node tdd-test-writer.js write "$feature" "$product"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Test writing failed${NC}"
        return 1
    fi
    
    echo "📋 Creating implementation checklist..."
    node tdd-implementation-planner.js create "$feature" "$product"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Implementation planning failed${NC}"
        return 1
    fi
    
    update_status "$feature" "planned" "$product"
    
    echo
    echo -e "${GREEN}✅ Planning complete for: ${feature}${NC}"
    echo -e "${YELLOW}Ready to build when you have focused time${NC}"
    echo -e "${CYAN}Use: ./tdd-helper.sh build \"${feature}\" ${product}${NC}"
}

run_skip_planning() {
    local feature="$1"
    local product="${2:-audiointel}"
    
    echo -e "${YELLOW}⚡ EMERGENCY SKIP-PLAN MODE${NC}"
    echo -e "${CYAN}Creating minimal specs for: ${feature}${NC}"
    echo
    
    update_status "$feature" "quick-planning" "$product"
    
    echo "⚡ Quick wireframes..."
    node tdd-ui-planner.js quick "$feature" "$product"
    
    echo "⚡ Quick components..."
    node tdd-component-selector.js quick "$feature" "$product"
    
    echo "⚡ Quick tests..."
    node tdd-test-writer.js quick "$feature" "$product"
    
    echo "⚡ Quick checklist..."
    node tdd-implementation-planner.js quick "$feature" "$product"
    
    update_status "$feature" "quick-planned" "$product"
    
    echo
    echo -e "${GREEN}⚡ Quick planning complete!${NC}"
    echo -e "${YELLOW}Ready for immediate build${NC}"
}

run_build_phase() {
    local feature="$1"
    local product="${2:-audiointel}"
    
    echo -e "${TDD_GREEN} GREEN PHASE - IMPLEMENTATION ${NC}"
    echo -e "${CYAN}Building: ${feature} (${product})${NC}"
    echo -e "${YELLOW}Using specs to guide existing agent system${NC}"
    echo
    
    update_status "$feature" "building" "$product"
    
    # Check if specs exist
    local spec_prefix="specs/ui-wireframes/${feature// /-}"
    spec_prefix=$(echo "$spec_prefix" | tr '[:upper:]' '[:lower:]')
    
    if [ ! -f "${spec_prefix}.json" ] && [ ! -f "${spec_prefix}-quick.json" ]; then
        echo -e "${YELLOW}⚠️  No specs found. Creating minimal specs first...${NC}"
        run_skip_planning "$feature" "$product"
    fi
    
    echo "🔧 Calling existing orchestrator with TDD specs..."
    
    # Create a temporary file with all spec context
    local context_file="/tmp/tdd-context-${feature// /-}.json"
    node -e "
        const fs = require('fs');
        const path = require('path');
        const feature = '$feature'.replace(/\s+/g, '-').toLowerCase();
        const context = {
            feature: '$feature',
            product: '$product',
            specs: {}
        };
        
        // Gather all specs
        const specDirs = ['ui-wireframes', 'components', 'tests', 'checklists'];
        specDirs.forEach(dir => {
            const files = [feature + '.json', feature + '-quick.json'];
            files.forEach(file => {
                const filePath = \`specs/\${dir}/\${file}\`;
                if (fs.existsSync(filePath)) {
                    try {
                        context.specs[dir] = JSON.parse(fs.readFileSync(filePath));
                    } catch (e) {
                        console.error(\`Error reading \${filePath}: \${e.message}\`);
                    }
                }
            });
        });
        
        fs.writeFileSync('$context_file', JSON.stringify(context, null, 2));
    "
    
    echo "📊 Spec context prepared at: $context_file"
    echo "🚀 Executing: ./orchestrator.sh execute ${feature// /-}-with-tdd-specs"
    
    # Call existing orchestrator with context
    if [ -x "./orchestrator.sh" ]; then
        TDD_CONTEXT_FILE="$context_file" ./orchestrator.sh execute "${feature// /-}-with-tdd-specs"
        local build_result=$?
    else
        echo -e "${YELLOW}⚠️  orchestrator.sh not found or not executable${NC}"
        echo -e "${CYAN}Manual steps:${NC}"
        echo "1. Implement feature using specs in specs/ directories"
        echo "2. Follow implementation checklist"
        echo "3. Test on mobile device"
        echo "4. Update status when complete"
        local build_result=0
    fi
    
    # Clean up
    rm -f "$context_file"
    
    if [ $build_result -eq 0 ]; then
        update_status "$feature" "built" "$product"
        echo
        echo -e "${GREEN}✅ Build complete for: ${feature}${NC}"
        echo -e "${YELLOW}Ready for refactor phase if needed${NC}"
    else
        update_status "$feature" "build-failed" "$product"
        echo -e "${RED}❌ Build failed for: ${feature}${NC}"
        return 1
    fi
}

run_quick_mode() {
    local feature="$1"
    local product="${2:-audiointel}"
    
    echo -e "${PURPLE}⚡ QUICK MODE - Bypass TDD${NC}"
    echo -e "${CYAN}Direct to orchestrator: ${feature}${NC}"
    echo
    
    update_status "$feature" "quick-building" "$product"
    
    if [ -x "./orchestrator.sh" ]; then
        echo "🚀 ./orchestrator.sh execute ${feature// /-}"
        ./orchestrator.sh execute "${feature// /-}"
        local result=$?
        
        if [ $result -eq 0 ]; then
            update_status "$feature" "quick-built" "$product"
            echo -e "${GREEN}⚡ Quick build complete!${NC}"
        else
            update_status "$feature" "quick-failed" "$product"
            echo -e "${RED}❌ Quick build failed${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  orchestrator.sh not found${NC}"
        echo "Execute manually: implement $feature without TDD specs"
        update_status "$feature" "manual" "$product"
    fi
}

show_status() {
    echo -e "${CYAN}📊 TDD Status Overview${NC}"
    echo
    
    if [ ! -f "specs/status.json" ]; then
        echo -e "${YELLOW}No features tracked yet${NC}"
        return
    fi
    
    node -e "
        const fs = require('fs');
        try {
            const status = JSON.parse(fs.readFileSync('specs/status.json'));
            const features = status.features || {};
            
            console.log('\\x1b[32m✅ Ready to build:\\x1b[0m');
            Object.entries(features).forEach(([name, info]) => {
                if (info.status === 'planned' || info.status === 'quick-planned') {
                    const type = info.status === 'quick-planned' ? ' (quick)' : '';
                    console.log(\`   \${name} - \${info.product}\${type}\`);
                }
            });
            
            console.log('\\n\\x1b[33m🚧 In progress:\\x1b[0m');
            Object.entries(features).forEach(([name, info]) => {
                if (info.status.includes('building') || info.status === 'planning') {
                    console.log(\`   \${name} - \${info.status} (\${info.product})\`);
                }
            });
            
            console.log('\\n\\x1b[34m💡 Ideas/Notes:\\x1b[0m');
            Object.entries(features).forEach(([name, info]) => {
                if (info.status === 'built' || info.status === 'quick-built') {
                    console.log(\`   \${name} - completed (\${info.product})\`);
                }
            });
            
            if (Object.keys(features).length === 0) {
                console.log('\\x1b[33mNo features tracked yet\\x1b[0m');
            }
            
        } catch (e) {
            console.log('\\x1b[31mError reading status: ' + e.message + '\\x1b[0m');
        }
    "
}

list_specs() {
    echo -e "${CYAN}📁 All TDD Specs Created:${NC}"
    echo
    
    echo -e "${YELLOW}UI Wireframes:${NC}"
    if [ -d "specs/ui-wireframes" ]; then
        node tdd-ui-planner.js list
    fi
    
    echo -e "${YELLOW}Component Selections:${NC}"
    if [ -d "specs/components" ]; then
        node tdd-component-selector.js list
    fi
    
    echo -e "${YELLOW}Test Specifications:${NC}"
    if [ -d "specs/tests" ]; then
        node tdd-test-writer.js list
    fi
    
    echo -e "${YELLOW}Implementation Plans:${NC}"
    if [ -d "specs/checklists" ]; then
        node tdd-implementation-planner.js list
    fi
}

# Main command processing
case "$1" in
    "plan")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Feature name required${NC}"
            echo "Usage: ./tdd-helper.sh plan \"feature name\" [audiointel|playlistpulse]"
            exit 1
        fi
        print_header
        run_planning_phase "$2" "$3"
        ;;
    
    "skip-plan")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Feature name required${NC}"
            echo "Usage: ./tdd-helper.sh skip-plan \"feature name\" [audiointel|playlistpulse]"
            exit 1
        fi
        print_header
        run_skip_planning "$2" "$3"
        ;;
    
    "build")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Feature name required${NC}"
            echo "Usage: ./tdd-helper.sh build \"feature name\" [audiointel|playlistpulse]"
            exit 1
        fi
        print_header
        run_build_phase "$2" "$3"
        ;;
    
    "quick")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Feature name required${NC}"
            echo "Usage: ./tdd-helper.sh quick \"feature name\" [audiointel|playlistpulse]"
            exit 1
        fi
        print_header
        run_quick_mode "$2" "$3"
        ;;
    
    "status")
        print_header
        show_status
        ;;
    
    "list")
        print_header
        list_specs
        ;;
    
    "resume")
        print_header
        echo -e "${CYAN}📋 Resuming interrupted planning...${NC}"
        echo -e "${YELLOW}Check status for incomplete features${NC}"
        show_status
        ;;
    
    *)
        show_usage
        ;;
esac