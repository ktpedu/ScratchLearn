import re

css_file_path = r'c:\Users\lenovo\Desktop\WNY2568\styles.css'
with open(css_file_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# I want to restore header, .dropdown-content, .news-card, .form-container, .measure-card, .content-section
# background to var(--bg-white);
css_content = re.sub(r'(header\s*\{[^}]*?)background-color:\s*var\(--text-main\);', r'\1background-color: var(--bg-white);', css_content)
css_content = re.sub(r'(\.dropdown-content\s*\{[^}]*?)background-color:\s*var\(--text-main\);', r'\1background-color: var(--bg-white);', css_content)
css_content = re.sub(r'(\.news-card\s*\{[^}]*?)background:\s*var\(--text-main\);', r'\1background: var(--bg-white);', css_content)
css_content = re.sub(r'(\.form-container\s*\{[^}]*?)background-color:\s*var\(--text-main\);', r'\1background-color: var(--bg-white);', css_content)
css_content = re.sub(r'(\.measure-card\s*\{[^}]*?)background:\s*var\(--text-main\);', r'\1background: var(--bg-white);', css_content)
css_content = re.sub(r'(\.content-section\s*\{[^}]*?)background:\s*var\(--text-main\);', r'\1background: var(--bg-white);', css_content)

with open(css_file_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Fixed CSS backgrounds")
