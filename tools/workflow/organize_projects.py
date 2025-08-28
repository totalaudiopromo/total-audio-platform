#!/usr/bin/env python3
"""
sadact Project Organization Helper
Safely moves projects to the new folder structure with backup and verification
"""

import os
import shutil
from pathlib import Path
import json
from datetime import datetime
from categorize_projects import ProjectCategorizer

class ProjectOrganizer:
    def __init__(self, target_root=None, dry_run=True):
        self.target_root = target_root or os.path.expanduser("~/Music/sadact_Production")
        self.dry_run = dry_run
        self.backup_dir = os.path.join(self.target_root, "05_Archive", "Backup_Projects", 
                                     f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
        self.log_file = os.path.join(self.target_root, f"organization_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        self.categorizer = ProjectCategorizer()
        
    def create_backup(self, source_path):
        """Create a backup of the project before moving"""
        if self.dry_run:
            return f"[DRY RUN] Would backup: {source_path}"
        
        os.makedirs(self.backup_dir, exist_ok=True)
        project_name = os.path.basename(source_path)
        backup_path = os.path.join(self.backup_dir, project_name)
        
        try:
            if os.path.isdir(source_path):
                shutil.copytree(source_path, backup_path)
            else:
                shutil.copy2(source_path, backup_path)
            return backup_path
        except Exception as e:
            return f"BACKUP FAILED: {str(e)}"
    
    def move_project(self, source_path, target_folder, project_name=None):
        """Move a project to the target folder with safety checks"""
        if not project_name:
            project_name = os.path.basename(source_path)
        
        target_path = os.path.join(self.target_root, target_folder, project_name)
        
        # Safety checks
        if not os.path.exists(source_path):
            return {"status": "error", "message": f"Source path does not exist: {source_path}"}
        
        if os.path.exists(target_path):
            return {"status": "error", "message": f"Target already exists: {target_path}"}
        
        if self.dry_run:
            return {
                "status": "dry_run",
                "message": f"Would move {source_path} -> {target_path}",
                "source": source_path,
                "target": target_path
            }
        
        try:
            # Create backup first
            backup_result = self.create_backup(source_path)
            
            # Create target directory if needed
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            
            # Move the project
            shutil.move(source_path, target_path)
            
            return {
                "status": "success",
                "message": f"Moved {project_name} to {target_folder}",
                "source": source_path,
                "target": target_path,
                "backup": backup_result
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Failed to move {project_name}: {str(e)}",
                "source": source_path,
                "target": target_path
            }
    
    def organize_selected_projects(self, project_selections):
        """Organize a list of selected projects"""
        results = []
        log_data = {
            "timestamp": datetime.now().isoformat(),
            "dry_run": self.dry_run,
            "results": []
        }
        
        print(f"🎵 SADACT PROJECT ORGANIZATION")
        print(f"{'[DRY RUN] ' if self.dry_run else ''}Processing {len(project_selections)} projects...")
        print("="*60)
        
        for i, selection in enumerate(project_selections, 1):
            source_path = selection['path']
            target_folder = selection['target_folder']
            project_name = os.path.basename(source_path)
            
            print(f"\n{i}. {project_name}")
            print(f"   From: {source_path}")
            print(f"   To:   {target_folder}/")
            
            result = self.move_project(source_path, target_folder)
            results.append(result)
            log_data["results"].append({
                "project_name": project_name,
                "source_path": source_path,
                "target_folder": target_folder,
                "result": result
            })
            
            status_emoji = {
                "success": "✅",
                "error": "❌",
                "dry_run": "🔍"
            }.get(result["status"], "❓")
            
            print(f"   {status_emoji} {result['message']}")
        
        # Save log
        if not self.dry_run:
            with open(self.log_file, 'w') as f:
                json.dump(log_data, f, indent=2)
            print(f"\n📝 Log saved to: {self.log_file}")
        
        # Summary
        success_count = sum(1 for r in results if r["status"] == "success")
        error_count = sum(1 for r in results if r["status"] == "error")
        
        print("\n" + "="*60)
        print("📊 ORGANIZATION SUMMARY:")
        print(f"   Total projects: {len(project_selections)}")
        print(f"   {'Successful' if not self.dry_run else 'Would succeed'}: {success_count}")
        print(f"   Errors: {error_count}")
        
        if self.dry_run:
            print(f"\n💡 This was a DRY RUN. No files were moved.")
            print(f"   Run with dry_run=False to actually move files.")
        
        return results
    
    def quick_organize_sadact_projects(self):
        """Quick organization of obvious sadact projects"""
        print("🔍 Finding sadact projects for quick organization...")
        
        results, needs_review = self.categorizer.analyze_all_projects()
        
        # Find high-confidence sadact projects
        sadact_projects = []
        for folder, projects in results.items():
            for item in projects:
                project = item['project']
                analysis = item['analysis']
                
                # Only include high-confidence sadact projects
                if ('sadact_project' in analysis['categories'] and 
                    analysis['confidence'] >= 60 and 
                    not analysis['needs_review']):
                    
                    sadact_projects.append({
                        'path': project['path'],
                        'name': project['name'],
                        'target_folder': analysis['suggested_folder'],
                        'confidence': analysis['confidence'],
                        'categories': analysis['categories']
                    })
        
        if not sadact_projects:
            print("❌ No high-confidence sadact projects found for quick organization")
            return []
        
        print(f"✅ Found {len(sadact_projects)} high-confidence sadact projects")
        print("\nProjects to organize:")
        for i, project in enumerate(sadact_projects, 1):
            print(f"{i:2d}. {project['name']}")
            print(f"     -> {project['target_folder']}")
            print(f"     Confidence: {project['confidence']}% | Tags: {', '.join(project['categories'])}")
        
        if self.dry_run:
            print(f"\n🔍 DRY RUN MODE - No files will be moved")
        else:
            response = input(f"\n❓ Proceed with organizing these {len(sadact_projects)} projects? (y/N): ")
            if response.lower() != 'y':
                print("❌ Organization cancelled")
                return []
        
        return self.organize_selected_projects(sadact_projects)
    
    def interactive_organization(self):
        """Interactive organization with user confirmation for each project"""
        print("🎵 INTERACTIVE SADACT PROJECT ORGANIZATION")
        print("="*60)
        
        results, needs_review = self.categorizer.analyze_all_projects()
        
        all_projects = []
        for folder, projects in results.items():
            for item in projects:
                project = item['project']
                analysis = item['analysis']
                all_projects.append({
                    'project': project,
                    'analysis': analysis,
                    'target_folder': analysis['suggested_folder']
                })
        
        # Sort by confidence (highest first)
        all_projects.sort(key=lambda x: x['analysis']['confidence'], reverse=True)
        
        selected_projects = []
        
        print(f"\nFound {len(all_projects)} projects. Review and select:")
        print("Commands: y=yes, n=no, s=skip, q=quit, a=approve all remaining")
        
        for i, item in enumerate(all_projects):
            project = item['project']
            analysis = item['analysis']
            target_folder = item['target_folder']
            
            status = "✅" if not analysis['needs_review'] else "⚠️"
            confidence = analysis['confidence']
            categories = ', '.join(analysis['categories'])
            
            print(f"\n{i+1}/{len(all_projects)} {status} {project['name']}")
            print(f"   Path: {project['path']}")
            print(f"   Target: {target_folder}")
            print(f"   Confidence: {confidence}% | Tags: {categories}")
            
            if self.dry_run:
                choice = 'y'  # Auto-approve in dry run
            else:
                choice = input("   Organize this project? [y/n/s/q/a]: ").lower()
            
            if choice == 'q':
                break
            elif choice == 'a':
                # Approve all remaining
                selected_projects.extend([{
                    'path': p['project']['path'],
                    'target_folder': p['target_folder']
                } for p in all_projects[i:]])
                break
            elif choice in ['y', '']:
                selected_projects.append({
                    'path': project['path'],
                    'target_folder': target_folder
                })
        
        if not selected_projects:
            print("❌ No projects selected for organization")
            return []
        
        print(f"\n✅ Selected {len(selected_projects)} projects for organization")
        return self.organize_selected_projects(selected_projects)

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Organize sadact music projects")
    parser.add_argument("--dry-run", action="store_true", default=True,
                       help="Preview changes without moving files (default)")
    parser.add_argument("--execute", action="store_true",
                       help="Actually move files (overrides dry-run)")
    parser.add_argument("--quick", action="store_true",
                       help="Quick organization of high-confidence sadact projects")
    parser.add_argument("--interactive", action="store_true",
                       help="Interactive organization with manual approval")
    parser.add_argument("--target", type=str,
                       help="Target root directory (default: ~/Music/sadact_Production)")
    
    args = parser.parse_args()
    
    # Override dry_run if --execute is specified
    dry_run = not args.execute
    
    organizer = ProjectOrganizer(target_root=args.target, dry_run=dry_run)
    
    if args.quick:
        organizer.quick_organize_sadact_projects()
    elif args.interactive:
        organizer.interactive_organization()
    else:
        print("Please specify --quick or --interactive mode")
        print("Use --help for more options")

if __name__ == "__main__":
    main()