import glob

html_files = glob.glob('*.html')

insertion = """
        <!-- Column 3: Our Services -->
        <div class="footer-light-col">
          <h4 class="footer-light-heading">Our Services</h4>
          <ul class="footer-light-links">
            <li><a href="varam-architects.html">Architecture & Interiors</a></li>
            <li><a href="shri-associates.html">Construction & Execution</a></li>
            <li><a href="mpms.html">Property Management</a></li>
          </ul>
        </div>
"""

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Check if we already have it to prevent duplicate insertions
    if '<!-- Column 3: Our Services -->' in content:
        continue
        
    # Replace "<!-- Column 3: Connect -->" with "<!-- Column 4: Connect -->" to maintain correct numbering
    content = content.replace('<!-- Column 3: Connect -->', '<!-- Column 4: Connect -->')
    
    # Find the end of Quick links column
    # Usually it ends with </ul>\n        </div>
    target = '        <!-- Column 4: Connect -->'
    
    if target in content:
        content = content.replace(target, insertion + '\n' + target)
    
    with open(file, 'w') as f:
        f.write(content)
