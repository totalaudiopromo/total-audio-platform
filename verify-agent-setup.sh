#!/bin/bash

echo "🔍 AGENT OS SETUP VERIFICATION"
echo "=============================="

echo ""
echo "1. ✅ CONTEXT FILES CHECK"
echo "--------------------------"

# Check if core context files exist
files=(
    "docs/consolidated/BUSINESS_STRATEGY_OVERVIEW.md"
    "docs/consolidated/AUDIO_INTEL_PRODUCT_PLAYBOOK.md" 
    "docs/consolidated/CONTENT_AND_BRAND_BLUEPRINT.md"
    "docs/consolidated/AGENT_AND_WORKFLOW_OPERATIONS.md"
    "WEEKLY_FOCUS.md"
    "AUDIO_INTEL_CONTEXT.md"
    "BUSINESS_NOTES.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
    fi
done

echo ""
echo "2. 🎨 AGENT COLOR SYSTEM CHECK"
echo "------------------------------"

# Check agent color system
if [ -f "/Users/chrisschofield/.claude/agents/agent-color-system.md" ]; then
    echo "✅ Agent color system configured"
else
    echo "❌ Agent color system missing"
fi

echo ""
echo "3. 🤖 AGENT DIRECTORY CHECK"
echo "----------------------------"

# Check agent directories
agent_dirs=(
    "/Users/chrisschofield/.claude/agents"
    "/Users/chrisschofield/workspace/active/total-audio-platform/.agent-os"
)

for dir in "${agent_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir"
        echo "   └── $(ls -1 "$dir" | wc -l | xargs) items"
    else
        echo "❌ $dir - MISSING"
    fi
done

echo ""
echo "4. 📊 PROJECT CONTEXT CHECK"
echo "----------------------------"

# Check if agents can see your business context
if [ -f "docs/consolidated/BUSINESS_STRATEGY_OVERVIEW.md" ]; then
    revenue_target=$(grep -i "£500.*month" docs/consolidated/BUSINESS_STRATEGY_OVERVIEW.md | head -1)
    if [ ! -z "$revenue_target" ]; then
        echo "✅ Revenue targets visible to agents"
    else
        echo "⚠️  Revenue targets may not be clear"
    fi
fi

if [ -f "docs/consolidated/AUDIO_INTEL_PRODUCT_PLAYBOOK.md" ]; then
    demo_conversion=$(grep -i "85%.*conversion" docs/consolidated/AUDIO_INTEL_PRODUCT_PLAYBOOK.md | head -1)
    if [ ! -z "$demo_conversion" ]; then
        echo "✅ Conversion metrics visible to agents"
    else
        echo "⚠️  Conversion metrics may not be clear"
    fi
fi

echo ""
echo "5. 🔗 AGENT COMMAND CHECK"
echo "-------------------------"

# Check if Agent OS commands are available
if [ -f "AGENT_OS_QUICK_REFERENCE.md" ]; then
    echo "✅ Agent OS commands documented"
    echo "   Available commands:"
    grep -o "/[a-z-]*" AGENT_OS_QUICK_REFERENCE.md | sort -u | sed 's/^/   └── /'
else
    echo "❌ Agent OS commands not documented"
fi

echo ""
echo "6. 🎯 SETUP COMPLETION STATUS"
echo "==============================="

missing_count=0
# Count missing items
for file in "${files[@]}"; do
    [ ! -f "$file" ] && ((missing_count++))
done

if [ $missing_count -eq 0 ]; then
    echo "🎉 PERFECT SETUP! Your Agent OS is ready like the video demo."
    echo ""
    echo "✅ To test: In Claude Code, try:"
    echo "   1. /analyze-product"
    echo "   2. Your agents should display with colored backgrounds"
    echo "   3. They should reference your £500/month target automatically"
else
    echo "⚠️  $missing_count items need attention for complete setup"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Test agent commands in Claude Code/Cursor"
echo "2. Verify color-coded agent backgrounds"
echo "3. Check agents reference your business context"
