#!/bin/bash

# Usage: ./scripts/create-component.sh components/ui/Modal.tsx

FILE_PATH="$1"

if [ -z "$FILE_PATH" ]; then
  echo "Error: Please provide a file path"
  echo "Usage: ./scripts/create-component.sh <path/to/file.tsx>"
  exit 1
fi

# Extract directory and filename
DIR=$(dirname "$FILE_PATH")
FILENAME=$(basename "$FILE_PATH")
COMPONENT_NAME="${FILENAME%.*}"

# Create directory if it doesn't exist
mkdir -p "$DIR"

# Create file with placeholder
cat > "$FILE_PATH" << EOF
// TODO: Implement $COMPONENT_NAME component

export function $COMPONENT_NAME() {
  return (
    <div>
      <p>$COMPONENT_NAME placeholder</p>
    </div>
  )
}
EOF

echo "✅ Created: $FILE_PATH"
echo "👉 Now Windsurf can edit this file!"
