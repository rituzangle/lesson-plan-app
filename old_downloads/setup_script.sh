#!/bin/bash
# Destination: scripts/setup_script.sh
# Auto-setup script for Lesson Plan App modular architecture
# moves new files from <APP>/downloads to correct destinations
#

set -e

echo "🚀 Setting up Lesson Plan App Architecture..."

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/{components,screens,services,utils,hooks,types,data,constants,styles}
mkdir -p src/data/{curriculum,templates}
mkdir -p src/components/{ui,forms,layout}
# mkdir -p scripts    -already present
# mkdir -p downloads  -already present

# Create index files for exports
echo "📄 Creating index files..."
touch src/components/index.ts
touch src/services/index.ts
touch src/utils/index.ts
touch src/hooks/index.ts
touch src/types/index.ts
touch src/data/index.ts

# Move files from downloads to destinations
echo "📦 Moving downloaded artifacts..."
if [ -d "downloads" ]; then
    # Create timestamp file to track what's been processed
    TIMESTAMP_FILE="downloads/.last_processed"
    
    for file in downloads/*.{ts,tsx,json,js}; do
        if [ -f "$file" ]; then
            # Skip if file was processed before (older than timestamp)
            if [ -f "$TIMESTAMP_FILE" ] && [ "$file" -ot "$TIMESTAMP_FILE" ]; then
                continue
            fi
            
            echo "Moving new file: $file"
            filename=$(basename "$file")
            
            # Move based on file type and name patterns
            case "$filename" in
                *.types.ts)
                    mv "$file" "src/types/"
                    ;;
                *.service.ts)
                    mv "$file" "src/services/"
                    ;;
                *Component.tsx|*Editor.tsx)
                    mv "$file" "src/components/forms/"
                    ;;
                *Button.tsx|*Selector.tsx)
                    mv "$file" "src/components/ui/"
                    ;;
                *.json)
                    mv "$file" "src/data/"
                    ;;
                *)
                    echo "Unknown file type: $filename - keeping in downloads"
                    ;;
            esac
        fi
    done
    
    # Update timestamp
    touch "$TIMESTAMP_FILE"
fi

# Create basic data structure
echo "🗃️ Creating initial data files..."
cat > src/data/curriculum/subjects.json << 'EOF'
{
  "subjects": [
    {
      "id": "performing_arts",
      "name": "Performing Arts",
      "description": "Theater, dance, music, and creative expression",
      "standards": ["creativity", "collaboration", "communication"]
    },
    {
      "id": "science",
      "name": "Science",
      "description": "Scientific inquiry and discovery",
      "standards": ["inquiry", "analysis", "evidence"]
    }
  ]
}
EOF

# Install dependencies
echo "📦 Installing dependencies..."
npm install @react-native-async-storage/async-storage react-native-vector-icons
npm install --dev @types/react @types/react-native

echo "✅ Setup complete! Next: Create modular components"
echo "💡 Run: npm start to begin development"