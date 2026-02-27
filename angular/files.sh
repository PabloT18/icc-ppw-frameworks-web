for file in *.md; do
  folder="${file%.md}"
  mkdir -p "$folder"
  mv "$file" "$folder/"
done