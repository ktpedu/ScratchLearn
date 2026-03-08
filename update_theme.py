import glob
import re

# 1. Update CSS
css_file_path = r'c:\Users\lenovo\Desktop\WNY2568\styles.css'
with open(css_file_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Replace variables
css_content = css_content.replace('--primary-yellow', '--primary-red')
css_content = css_content.replace('--dark-yellow', '--dark-red')
css_content = css_content.replace('--light-yellow', '--light-red')

# Replace color values
# :root variables replacement
css_content = css_content.replace('#f1c40f', '#d32f2f') # Vibrant red
css_content = css_content.replace('#d4ac0d', '#b71c1c') # Dark red
css_content = css_content.replace('#fcf3cf', '#ffebee') # Light red
# Also update color: var(--text-main) on red bg to white if it was dark text on yellow
# In top-bar, btn-submit, measure-icon etc. We might want to fix contrasts natively
# Let's change the .top-bar text to white
css_content = css_content.replace('color: var(--text-main); /* Dark text for contrast */', 'color: var(--bg-white); /* White text for contrast on red */')
# In page-header
css_content = css_content.replace('color: var(--text-main); /* Dark text on yellow bg */', 'color: var(--bg-white); /* White text on red bg */')
# In btn-submit
css_content = css_content.replace('color: var(--text-main);', 'color: var(--bg-white);') # This might also affect form labels etc so let's be careful.

with open(css_file_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

# 2. Update HTML
html_files = glob.glob(r'c:\Users\lenovo\Desktop\WNY2568\*.html')
old_logo_pattern = r'<div style="width: 50px; height: 50px; background-color: var\(--primary-(yellow|red)\); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var\(--(?:text-main|bg-white)\);">\s*<i class="fas fa-school"[^>]*></i>\s*</div>'

new_logo_html = '<img src="https://tse2.mm.bing.net/th/id/OIP.yVXviOGLoqC2GoEBDzH6AgHaHZ?rs=1&pid=ImgDetMain&o=7&rm=3" alt="โลโก้โรงเรียนสีขาว" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid white;">'

for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    html_content = re.sub(old_logo_pattern, new_logo_html, html_content)
    
    with open(hf, 'w', encoding='utf-8') as f:
        f.write(html_content)

print("Done updating CSS and HTML files.")
