import os
import re

# New color mapping
COLOR_MAP = {
    r'#1d2e51': '#2E2F7F',
    r'#1D2E51': '#2E2F7F',
    r'#f29400': '#F7931E',
    r'#F29400': '#F7931E',
}

def replace_colors_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old_color, new_color in COLOR_MAP.items():
        new_content = re.sub(old_color, new_color, new_content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    src_dir = r'c:\MES SITES WEB\maKhad_ConvManager\maKhady\ConvManager\frontend\src'
    files_updated = 0
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css', '.html')):
                file_path = os.path.join(root, file)
                if replace_colors_in_file(file_path):
                    print(f"Updated: {file_path}")
                    files_updated += 1
    
    print(f"Total files updated: {files_updated}")

if __name__ == "__main__":
    main()
