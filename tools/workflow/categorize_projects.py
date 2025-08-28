#!/usr/bin/env python3
"""
sadact Project Categorization Helper
Analyzes existing music projects and suggests organization structure
"""

import os
import re
from pathlib import Path
from collections import defaultdict

class ProjectCategorizer:
    def __init__(self, search_paths=None):
        self.search_paths = search_paths or [
            os.path.expanduser("~/Music"),
            os.path.expanduser("~/Desktop"),
            os.path.expanduser("~/Documents")
        ]
        
        # Keywords for identifying project types
        self.remix_keywords = ['remix', 'rmx', 'rework', 'edit', 'bootleg']
        self.collab_keywords = ['feat', 'ft', ' & ', ' and ', ' x ', 'vs', 'with']
        self.stem_keywords = ['stems', 'parts', 'multitracks', 'tracks']
        self.version_keywords = ['v2', 'v3', 'alt', 'demo', 'rough', 'draft', 'wip']
        
        # File extensions for project files
        self.project_extensions = ['.als', '.flp', '.logic', '.ptx', '.cpr', '.reason']
        self.audio_extensions = ['.wav', '.aiff', '.mp3', '.flac', '.m4a']
        
    def find_projects(self):
        """Find all potential music projects"""
        projects = []
        
        for search_path in self.search_paths:
            if not os.path.exists(search_path):
                continue
                
            for root, dirs, files in os.walk(search_path):
                # Skip system folders
                if any(skip in root.lower() for skip in ['.git', 'node_modules', 'cache', 'trash']):
                    continue
                    
                project_files = []
                audio_files = []
                
                for file in files:
                    file_lower = file.lower()
                    if any(ext in file_lower for ext in self.project_extensions):
                        project_files.append(file)
                    elif any(ext in file_lower for ext in self.audio_extensions):
                        audio_files.append(file)
                
                # If we found project files or significant audio files, it's likely a project
                if project_files or len(audio_files) >= 3:
                    projects.append({
                        'path': root,
                        'name': os.path.basename(root),
                        'project_files': project_files,
                        'audio_files': audio_files,
                        'total_files': len(files)
                    })
        
        return projects
    
    def categorize_project(self, project):
        """Categorize a project based on its name and contents"""
        name = project['name'].lower()
        path = project['path'].lower()
        
        categories = []
        confidence = 0
        
        # Check for sadact projects
        if 'sadact' in name:
            categories.append('sadact_project')
            confidence += 30
        
        # Check for remix
        if any(keyword in name for keyword in self.remix_keywords):
            categories.append('remix')
            confidence += 25
        
        # Check for collaboration
        if any(keyword in name for keyword in self.collab_keywords):
            categories.append('collaboration')
            confidence += 20
        
        # Check for stems
        if any(keyword in name for keyword in self.stem_keywords):
            categories.append('stems')
            confidence += 35
        
        # Check for versions/works in progress
        if any(keyword in name for keyword in self.version_keywords):
            categories.append('version')
            confidence += 15
        
        # Check project status based on file types
        if project['project_files']:
            categories.append('active_project')
            confidence += 20
        elif len(project['audio_files']) >= 1:
            categories.append('audio_only')
            confidence += 10
        
        # Determine suggested folder
        suggested_folder = self._suggest_folder(categories, project)
        
        return {
            'categories': categories,
            'confidence': confidence,
            'suggested_folder': suggested_folder,
            'needs_review': confidence < 50
        }
    
    def _suggest_folder(self, categories, project):
        """Suggest the appropriate folder for a project"""
        name = project['name'].lower()
        
        # High priority categories
        if 'stems' in categories:
            if 'sadact' in name:
                return '04_Stems_and_Parts/My_Stems'
            else:
                return '04_Stems_and_Parts/Received_Stems'
        
        if 'collaboration' in categories:
            if any(keyword in name for keyword in ['complete', 'final', 'master']):
                return '03_Collaborations/Completed_Collabs'
            else:
                return '03_Collaborations/Active_Collabs'
        
        if 'remix' in categories:
            if any(keyword in name for keyword in ['complete', 'final', 'master']):
                return '02_Released_Tracks/Remixes'
            else:
                return '01_Active_Projects/In_Progress'
        
        # Check for completion status
        if any(keyword in name for keyword in ['master', 'final', 'complete']):
            if 'remix' in categories:
                return '02_Released_Tracks/Remixes'
            else:
                return '02_Released_Tracks/Singles'
        
        if any(keyword in name for keyword in ['mix', 'mixed']):
            return '01_Active_Projects/Ready_for_Master'
        
        if any(keyword in name for keyword in ['demo', 'rough', 'wip', 'draft']):
            return '01_Active_Projects/In_Progress'
        
        # Default categorization
        if 'active_project' in categories:
            return '01_Active_Projects/In_Progress'
        else:
            return '05_Archive/Experiments'
    
    def analyze_all_projects(self):
        """Analyze all found projects and return categorization results"""
        print("🔍 Scanning for music projects...")
        projects = self.find_projects()
        
        print(f"📁 Found {len(projects)} potential projects")
        
        results = defaultdict(list)
        needs_review = []
        
        for project in projects:
            analysis = self.categorize_project(project)
            results[analysis['suggested_folder']].append({
                'project': project,
                'analysis': analysis
            })
            
            if analysis['needs_review']:
                needs_review.append(project)
        
        return results, needs_review
    
    def print_analysis_report(self):
        """Print a detailed analysis report"""
        results, needs_review = self.analyze_all_projects()
        
        print("\n" + "="*60)
        print("🎵 SADACT PROJECT CATEGORIZATION REPORT")
        print("="*60)
        
        total_projects = sum(len(projects) for projects in results.values())
        
        print(f"\n📊 SUMMARY:")
        print(f"   Total projects found: {total_projects}")
        print(f"   Projects needing review: {len(needs_review)}")
        print(f"   Confidence level: {((total_projects - len(needs_review)) / total_projects * 100):.1f}%")
        
        print(f"\n📂 SUGGESTED ORGANIZATION:")
        
        for folder, projects in sorted(results.items()):
            if not projects:
                continue
                
            print(f"\n   {folder}/ ({len(projects)} projects)")
            for item in projects[:3]:  # Show first 3 projects
                project = item['project']
                analysis = item['analysis']
                status = "⚠️" if analysis['needs_review'] else "✅"
                print(f"      {status} {project['name']}")
                if analysis['categories']:
                    print(f"         Tags: {', '.join(analysis['categories'])}")
            
            if len(projects) > 3:
                print(f"      ... and {len(projects) - 3} more")
        
        if needs_review:
            print(f"\n⚠️  PROJECTS NEEDING MANUAL REVIEW:")
            for project in needs_review[:10]:  # Show first 10
                print(f"   • {project['name']}")
                print(f"     Path: {project['path']}")
            
            if len(needs_review) > 10:
                print(f"   ... and {len(needs_review) - 10} more")
        
        print(f"\n🎯 NEXT STEPS:")
        print("   1. Review the categorization suggestions above")
        print("   2. Run the organization helper script for confirmed moves")
        print("   3. Manually review projects marked with ⚠️")
        print("   4. Start with 2-3 test projects before full migration")
        
        print(f"\n💡 TIP: Projects with 'sadact' in the name are prioritized")
        print("="*60)

def main():
    categorizer = ProjectCategorizer()
    categorizer.print_analysis_report()

if __name__ == "__main__":
    main()