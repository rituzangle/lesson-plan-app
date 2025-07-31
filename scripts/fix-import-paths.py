#!/usr/bin/env python3
"""
Import Path Fixer
File: scripts/fix-import-paths.py

Fix inconsistent import paths based on actual file structure
"""

import os
import re
from pathlib import Path

class ImportPathFixer:
    def __init__(self, project_root="."):
        self.project_root = Path(project_root).resolve()
        self.src_path = self.project_root / "src"
        self.fixes_made = []
        
    def find_existing_files(self):
        """Map what files actually exist"""
        existing_files = {}
        
        if self.src_path.exists():
            for file_path in self.src_path.rglob("*.ts*"):
                # Get relative path from src
                rel_path = file_path.relative_to(self.src_path)
                
                # Remove extension for import matching
                key = str(rel_path.with_suffix(''))
                existing_files[key] = str(rel_path)
                
        return existing_files
    
    def fix_file_imports(self, file_path, existing_files):
        """Fix imports in a single file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            # Find all import statements
            import_pattern = r"import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['\"]([^'\"]+)['\"]"
            
            def fix_import(match):
                import_path = match.group(1)
                
                # Skip node_modules imports
                if not import_path.startswith('.'):
                    return match.group(0)
                
                # Resolve the import path
                if import_path.startswith('./'):
                    # Same directory import
                    base_dir = file_path.parent.relative_to(self.src_path)
                    resolved_path = base_dir / import_path[2:]
                elif import_path.startswith('../'):
                    # Parent directory import
                    base_dir = file_path.parent.relative_to(self.src_path)
                    resolved_path = base_dir / import_path
                else:
                    # Assume relative to src
                    resolved_path = Path(import_path)
                
                # Normalize the path
                try:
                    normalized_path = str(resolved_path.resolve())
                    if '/..' in normalized_path:
                        # Handle parent directory traversal manually
                        parts = resolved_path.parts
                        clean_parts = []
                        for part in parts:
                            if part == '..':
                                if clean_parts:
                                    clean_parts.pop()
                            elif part != '.':
                                clean_parts.append(part)
                        resolved_path = Path(*clean_parts) if clean_parts else Path('.')
                except:
                    pass
                
                # Check if we need to fix common path issues
                path_str = str(resolved_path)
                
                # Common fixes
                fixes = {
                    'contexts/AuthContext': 'context/AuthContext',  # Use context not contexts
                    'components/BiometricLogin': None,  # Mark as missing
                    'services/encryption': None,  # Mark as missing
                    'types/lesson.types': None,  # Mark as missing
                }
                
                for wrong_path, correct_path in fixes.items():
                    if wrong_path in path_str:
                        if correct_path:
                            # Calculate relative path from current file to correct location
                            current_dir = file_path.parent.relative_to(self.src_path)
                            target_path = Path(correct_path)
                            
                            # Calculate relative import
                            if current_dir == Path('.'):
                                new_import = f"./{correct_path}"
                            else:
                                # Count how many levels up we need to go
                                up_levels = len(current_dir.parts)
                                up_path = '/'.join(['..'] * up_levels)
                                new_import = f"{up_path}/{correct_path}" if up_path else f"./{correct_path}"
                            
                            self.fixes_made.append(f"{file_path.name}: {import_path} → {new_import}")
                            return match.group(0).replace(import_path, new_import)
                        else:
                            # Mark as missing file
                            self.fixes_made.append(f"{file_path.name}: MISSING FILE → {import_path}")
                
                return match.group(0)
            
            # Apply fixes
            content = re.sub(import_pattern, fix_import, content)
            
            # Write back if changed
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return True
                
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            
        return False
    
    def create_missing_files(self):
        """Create essential missing files"""
        missing_files = [
            ('src/context/AuthContext.tsx', self.create_auth_context),
            ('src/types/lesson.types.ts', self.create_lesson_types),
            ('src/services/encryption.ts', self.create_encryption_service),
            ('src/services/lesson.service.ts', self.create_lesson_service),
        ]
        
        created = []
        for file_path, creator_func in missing_files:
            full_path = self.project_root / file_path
            if not full_path.exists():
                full_path.parent.mkdir(parents=True, exist_ok=True)
                content = creator_func()
                with open(full_path, 'w') as f:
                    f.write(content)
                created.append(file_path)
                
        return created
    
    def create_auth_context(self):
        return '''import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
'''

    def create_lesson_types(self):
        return '''// Lesson Plan Types
export interface Lesson {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  duration: number; // in minutes
  objectives: string[];
  materials: string[];
  activities: Activity[];
  assessment: Assessment;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: 'introduction' | 'main' | 'practice' | 'wrap-up';
  instructions: string[];
}

export interface Assessment {
  id: string;
  type: 'formative' | 'summative';
  criteria: string[];
  rubric?: Rubric;
}

export interface Rubric {
  id: string;
  criteria: RubricCriteria[];
}

export interface RubricCriteria {
  name: string;
  description: string;
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  label: string;
  description: string;
}

export interface LessonPlan {
  lesson: Lesson;
  template_id?: string;
  is_template: boolean;
  visibility: 'private' | 'shared' | 'public';
}

export type LessonFilter = {
  subject?: string;
  grade_level?: string;
  duration_min?: number;
  duration_max?: number;
  created_by?: string;
};
'''

    def create_encryption_service(self):
        return '''// Encryption Service
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'default-key-change-in-production';

export class EncryptionService {
  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  static encryptObject(obj: any): string {
    return this.encrypt(JSON.stringify(obj));
  }

  static decryptObject<T>(encryptedData: string): T {
    const decrypted = this.decrypt(encryptedData);
    return JSON.parse(decrypted);
  }
}

export default EncryptionService;
'''

    def create_lesson_service(self):
        return '''// Lesson Service
import { supabase } from '../lib/supabase';
import { Lesson, LessonPlan, LessonFilter } from '../types/lesson.types';

export class LessonService {
  static async createLesson(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .insert([lesson])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getLessons(filter?: LessonFilter): Promise<Lesson[]> {
    let query = supabase.from('lessons').select('*');

    if (filter?.subject) {
      query = query.eq('subject', filter.subject);
    }
    if (filter?.grade_level) {
      query = query.eq('grade_level', filter.grade_level);
    }
    if (filter?.created_by) {
      query = query.eq('created_by', filter.created_by);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getLessonById(id: string): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteLesson(id: string): Promise<void> {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export default LessonService;
'''

    def run_fixes(self):
        """Run all import fixes"""
        print("🔧 Fixing import paths...")
        
        # First, create missing essential files
        created_files = self.create_missing_files()
        if created_files:
            print(f"✅ Created {len(created_files)} missing files:")
            for file in created_files:
                print(f"  - {file}")
        
        # Find existing files
        existing_files = self.find_existing_files()
        print(f"📁 Found {len(existing_files)} existing files")
        
        # Fix imports in all TypeScript files
        fixed_files = 0
        for file_path in self.src_path.rglob("*.ts*"):
            if self.fix_file_imports(file_path, existing_files):
                fixed_files += 1
        
        print(f"\n📊 Summary:")
        print(f"  Files fixed: {fixed_files}")
        print(f"  Import fixes made: {len(self.fixes_made)}")
        
        if self.fixes_made:
            print(f"\n🔄 Import fixes:")
            for fix in self.fixes_made[:10]:  # Show first 10
                print(f"  {fix}")
            if len(self.fixes_made) > 10:
                print(f"  ... and {len(self.fixes_made) - 10} more")

def main():
    fixer = ImportPathFixer()
    fixer.run_fixes()
    
    print(f"\n🚀 Try running 'npm start' now!")

if __name__ == "__main__":
    main()
