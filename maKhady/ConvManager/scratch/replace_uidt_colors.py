import os

def replace_colors_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('001D3D', '1d2e51').replace('001d3d', '1d2e51')
    new_content = new_content.replace('8B7355', 'f29400').replace('8b7355', 'f29400')
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

def walk_and_replace(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css', '.html')):
                replace_colors_in_file(os.path.join(root, file))

if __name__ == "__main__":
    walk_and_replace('frontend/src')
