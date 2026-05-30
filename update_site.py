import glob
import re

def extract_block(text, start_tag, end_tag):
    start_idx = text.find(start_tag)
    if start_idx == -1: return None
    end_idx = text.find(end_tag, start_idx)
    if end_idx == -1: return None
    return text[start_idx:end_idx + len(end_tag)]

with open('index.html', 'r') as f:
    index_html = f.read()

# We need to extract the exact blocks from index.html
# 1. nav block
# It starts with <nav id="main-nav" and ends with </nav>
nav_start_match = re.search(r'<nav id="main-nav"[^>]*>', index_html)
if not nav_start_match:
    print("Could not find nav in index.html")
    exit(1)
nav_start = nav_start_match.start()
nav_end = index_html.find('</nav>', nav_start) + len('</nav>')
nav_block = index_html[nav_start:nav_end]

# 2. mobile drawer block
drawer_start_match = re.search(r'<div id="mobile-drawer"[^>]*>', index_html)
drawer_start = drawer_start_match.start()
# The drawer has nested divs, so a simple find('</div>') won't work perfectly if we just look for the first one.
# Let's find the closing div of mobile-drawer by looking for <main id="main-content"> which comes immediately after.
main_start = index_html.find('<main id="main-content">')
# The drawer ends right before main_start (ignoring whitespace)
drawer_block = index_html[drawer_start:main_start].strip()

# 3. footer block
footer_start = index_html.find('<footer class="site-footer-premium-light">')
footer_end = index_html.find('</footer>', footer_start) + len('</footer>')
footer_block = index_html[footer_start:footer_end]

html_files = glob.glob('*.html')
html_files.remove('index.html')

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # Replace nav
    file_nav_start_match = re.search(r'<nav id="main-nav"[^>]*>', content)
    if file_nav_start_match:
        file_nav_start = file_nav_start_match.start()
        file_nav_end = content.find('</nav>', file_nav_start) + len('</nav>')
        
        # PRESERVE class="nav-solid" if it exists in the target file's nav tag!
        # The user said "apply home page header footer", but breaking the page layout by removing nav-solid is bad.
        # Let's just copy the inner HTML of the nav, OR check if nav-solid is there.
        target_nav_tag = content[file_nav_start:content.find('>', file_nav_start)+1]
        
        # Wait, if we just replace the whole block with index.html's nav, we might lose nav-solid.
        # Let's check if the target has nav-solid.
        if 'nav-solid' in target_nav_tag:
            # We should inject nav-solid into the replacement nav block
            replacement_nav = nav_block.replace('<nav id="main-nav"', '<nav id="main-nav" class="nav-solid"')
        else:
            replacement_nav = nav_block
            
        content = content[:file_nav_start] + replacement_nav + content[file_nav_end:]

    # Replace drawer
    file_drawer_start_match = re.search(r'<div id="mobile-drawer"[^>]*>', content)
    if file_drawer_start_match:
        file_drawer_start = file_drawer_start_match.start()
        file_main_start = content.find('<main id="main-content">')
        if file_main_start != -1:
            # Find the actual end of drawer (last </div> before main)
            # Actually just replace from file_drawer_start to file_main_start - whitespace
            content = content[:file_drawer_start] + drawer_block + '\n\n  ' + content[file_main_start:]

    # Replace footer
    file_footer_start = content.find('<footer class="site-footer-premium-light">')
    if file_footer_start != -1:
        file_footer_end = content.find('</footer>', file_footer_start) + len('</footer>')
        content = content[:file_footer_start] + footer_block + content[file_footer_end:]

    with open(file, 'w') as f:
        f.write(content)

print("Updated files successfully")
