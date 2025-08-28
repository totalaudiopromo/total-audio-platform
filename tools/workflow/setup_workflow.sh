#!/bin/bash
# sadact Production Workflow Setup Script
# Creates folder structure and installs workflow tools

set -e

WORKFLOW_ROOT="$HOME/Music/sadact_Production"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🎵 sadact Production Workflow Setup"
echo "=================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Create main folder structure
echo "📁 Creating folder structure..."
mkdir -p "$WORKFLOW_ROOT"

# Create all subfolders
mkdir -p "$WORKFLOW_ROOT/01_Active_Projects/In_Progress"
mkdir -p "$WORKFLOW_ROOT/01_Active_Projects/Ready_for_Mix"
mkdir -p "$WORKFLOW_ROOT/01_Active_Projects/Ready_for_Master"

mkdir -p "$WORKFLOW_ROOT/02_Released_Tracks/Singles"
mkdir -p "$WORKFLOW_ROOT/02_Released_Tracks/EPs_Albums"
mkdir -p "$WORKFLOW_ROOT/02_Released_Tracks/Remixes"

mkdir -p "$WORKFLOW_ROOT/03_Collaborations/Active_Collabs"
mkdir -p "$WORKFLOW_ROOT/03_Collaborations/Completed_Collabs"

mkdir -p "$WORKFLOW_ROOT/04_Stems_and_Parts/My_Stems"
mkdir -p "$WORKFLOW_ROOT/04_Stems_and_Parts/Received_Stems"

mkdir -p "$WORKFLOW_ROOT/05_Archive/Old_Projects"
mkdir -p "$WORKFLOW_ROOT/05_Archive/Experiments"
mkdir -p "$WORKFLOW_ROOT/05_Archive/Backup_Projects"

mkdir -p "$WORKFLOW_ROOT/06_Templates_and_Tools/Project_Templates"
mkdir -p "$WORKFLOW_ROOT/06_Templates_and_Tools/Sample_Libraries/Drums"
mkdir -p "$WORKFLOW_ROOT/06_Templates_and_Tools/Sample_Libraries/Bass"
mkdir -p "$WORKFLOW_ROOT/06_Templates_and_Tools/Sample_Libraries/Leads"
mkdir -p "$WORKFLOW_ROOT/06_Templates_and_Tools/Sample_Libraries/Pads"
mkdir -p "$WORKFLOW_ROOT/06_Templates_and_Tools/Sample_Libraries/FX"
mkdir -p "$WORKFLOW_ROOT/06_Templates_and_Tools/Sample_Libraries/Vocals"
mkdir -p "$WORKFLOW_ROOT/06_Templates_and_Tools/Presets"

echo "✅ Folder structure created at: $WORKFLOW_ROOT"

# Copy workflow tools
echo "🛠️  Installing workflow tools..."
cp "$SCRIPT_DIR/categorize_projects.py" "$WORKFLOW_ROOT/"
cp "$SCRIPT_DIR/organize_projects.py" "$WORKFLOW_ROOT/"
chmod +x "$WORKFLOW_ROOT/categorize_projects.py"
chmod +x "$WORKFLOW_ROOT/organize_projects.py"

echo "✅ Workflow tools installed"

# Create README files
echo "📝 Creating README files..."

# Main README
cat > "$WORKFLOW_ROOT/README.md" << 'EOF'
# 🎵 sadact Production Workflow

Professional music production organization system for sadact.

## Quick Start

1. **Analyze existing projects**: `python3 categorize_projects.py`
2. **Organize projects**: `python3 organize_projects.py --interactive`
3. **Start new project**: Create in `01_Active_Projects/In_Progress/`

## Folder Structure

- `01_Active_Projects/` - Current work (In Progress → Mix → Master)
- `02_Released_Tracks/` - Published music (Singles, EPs, Remixes)
- `03_Collaborations/` - Joint projects (Active → Completed)
- `04_Stems_and_Parts/` - Track components (My Stems, Received Stems)
- `05_Archive/` - Storage & backups (Old Projects, Experiments, Backups)
- `06_Templates_and_Tools/` - Production assets (Templates, Samples, Presets)

## Project Workflow

**New Track**: In Progress → Ready for Mix → Ready for Master → Released
**Collaboration**: Active Collabs → Completed Collabs → Released
**Archive**: Old/completed projects → Archive folder

## File Naming

- **Originals**: `sadact - Track Name`
- **Remixes**: `Artist - Track (sadact Remix)`
- **Collabs**: `sadact & Artist - Track Name`
- **Stems**: `sadact - Track - STEMS`

## Safety

- Always backup before major reorganization
- Test with 2-3 projects first
- Use dry-run mode initially
- Keep originals until confirmed working

Time to find any project: **<15 seconds** ⚡
EOF

# Create individual folder READMEs
cat > "$WORKFLOW_ROOT/01_Active_Projects/README.md" << 'EOF'
# 🎯 Active Projects

Current work in various stages of completion.

## Subfolders

- **In_Progress/** - Actively working on (composition, arrangement)
- **Ready_for_Mix/** - Composition complete, needs mixing
- **Ready_for_Master/** - Mixed, needs mastering

## Workflow

1. Start new projects in `In_Progress/`
2. Move to `Ready_for_Mix/` when composition is complete
3. Move to `Ready_for_Master/` when mixing is done
4. Move to `02_Released_Tracks/` when mastered and released

## Best Practices

- Keep max 10 projects in In_Progress
- Use descriptive folder names with BPM
- Regular cleanup (weekly recommended)
EOF

cat > "$WORKFLOW_ROOT/02_Released_Tracks/README.md" << 'EOF'
# 🎉 Released Tracks

Published and completed music organized by type.

## Subfolders

- **Singles/** - Individual track releases
- **EPs_Albums/** - Multi-track releases
- **Remixes/** - Official remix work

## File Organization

- Include release year in folder names
- Keep stems in `04_Stems_and_Parts/My_Stems/`
- Maintain release metadata and artwork
EOF

cat > "$WORKFLOW_ROOT/03_Collaborations/README.md" << 'EOF'
# 🤝 Collaborations

Joint projects with other artists.

## Subfolders

- **Active_Collabs/** - Ongoing collaborative work
- **Completed_Collabs/** - Finished collaborations

## Workflow

1. Start collaborations in `Active_Collabs/`
2. Move to `Completed_Collabs/` when finished
3. Copy to appropriate `02_Released_Tracks/` folder when released
EOF

cat > "$WORKFLOW_ROOT/04_Stems_and_Parts/README.md" << 'EOF'
# 🎼 Stems and Parts

Track components and multitrack files.

## Subfolders

- **My_Stems/** - Stems from your tracks
- **Received_Stems/** - Stems received from others

## Organization

- Match folder names to original track names
- Include tempo in folder names for DJ use
- Organize by project/release for easy access
EOF

cat > "$WORKFLOW_ROOT/05_Archive/README.md" << 'EOF'
# 📦 Archive

Storage for completed, old, and experimental projects.

## Subfolders

- **Old_Projects/** - Completed/shelved projects
- **Experiments/** - Sketches, ideas, tests
- **Backup_Projects/** - Safety copies before major changes

## Maintenance

- Review quarterly for cleanup
- Keep backups of important projects
- Archive completed experiments
EOF

cat > "$WORKFLOW_ROOT/06_Templates_and_Tools/README.md" << 'EOF'
# 🛠️ Templates and Tools

Production assets and workflow tools.

## Subfolders

- **Project_Templates/** - Ableton/DAW project templates
- **Sample_Libraries/** - Personal sample collection (organized by type)
- **Presets/** - Custom synth patches and effect presets

## Templates

Create standard templates for:
- `sadact_Standard.als` - Basic track template
- `sadact_Remix.als` - Remix work template
- `sadact_Collab.als` - Collaboration template

## Sample Libraries

Organized by type: Drums, Bass, Leads, Pads, FX, Vocals
EOF

echo "✅ README files created"

# Create quick access aliases
echo "🔗 Creating quick access..."

# Create terminal aliases file
cat > "$WORKFLOW_ROOT/sadact_aliases.sh" << EOF
# sadact Production Workflow Aliases
# Add to your ~/.bashrc or ~/.zshrc: source ~/Music/sadact_Production/sadact_aliases.sh

alias sadact-active='cd "$HOME/Music/sadact_Production/01_Active_Projects"'
alias sadact-released='cd "$HOME/Music/sadact_Production/02_Released_Tracks"'
alias sadact-collabs='cd "$HOME/Music/sadact_Production/03_Collaborations"'
alias sadact-stems='cd "$HOME/Music/sadact_Production/04_Stems_and_Parts"'
alias sadact-archive='cd "$HOME/Music/sadact_Production/05_Archive"'
alias sadact-tools='cd "$HOME/Music/sadact_Production/06_Templates_and_Tools"'

alias sadact-scan='cd "$HOME/Music/sadact_Production" && python3 categorize_projects.py'
alias sadact-organize='cd "$HOME/Music/sadact_Production" && python3 organize_projects.py --interactive'
alias sadact-quick='cd "$HOME/Music/sadact_Production" && python3 organize_projects.py --quick'

echo "🎵 sadact Production Workflow loaded"
echo "   Use: sadact-active, sadact-released, sadact-scan, etc."
EOF

echo "✅ Quick access aliases created at: $WORKFLOW_ROOT/sadact_aliases.sh"
echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Add to shell: echo 'source $WORKFLOW_ROOT/sadact_aliases.sh' >> ~/.zshrc"
echo "2. Scan projects: cd '$WORKFLOW_ROOT' && python3 categorize_projects.py"
echo "3. Test organize: python3 organize_projects.py --dry-run --interactive"
echo "4. Create templates in 06_Templates_and_Tools/Project_Templates/"
echo ""
echo "🎵 Happy producing with sadact!"