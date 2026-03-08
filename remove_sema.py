import glob

files = glob.glob(r'c:\Users\lenovo\Desktop\WNY2568\*.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    with open(f, 'w', encoding='utf-8') as file:
        for line in lines:
            if 'sema-box.html' not in line:
                file.write(line)
