import re

css_file_path = r'c:\Users\lenovo\Desktop\WNY2568\styles.css'
with open(css_file_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Revert the blind replacements
css_content = css_content.replace('color: var(--bg-white);', 'color: var(--text-main);')

# Now specifically apply white color to elements with red backgrounds that need it
# .btn-submit, .top-bar, .page-header
# Let's fix .btn-submit
btn_pattern = r'(\.btn-submit\s*\{[^}]*?)color:\s*var\(--text-main\);'
css_content = re.sub(btn_pattern, r'\1color: var(--bg-white);', css_content)

with open(css_file_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

print("Fixed CSS text colors")
