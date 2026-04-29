import os

file_path = r"c:\MES SITES WEB\maKhad_ConvManager\maKhady\ConvManager\frontend\src\pages\Conventions.jsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

vars_to_check = ['currentPage', 'itemsPerPage', 'totalPages', 'paginatedConventions', 'filteredConventions']
for var in vars_to_check:
    print(f"Checking for {var}:")
    for i, line in enumerate(lines):
        if var in line:
            print(f"{i+1}: {line.strip()}")
    print("-" * 20)
