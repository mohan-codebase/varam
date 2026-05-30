import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

fab_html = """<div class="fab-container">
  <button id="backToTop" class="fab-btn btn-top" aria-label="Back to top">
    <i data-lucide="chevron-up" class="icon-md"></i>
  </button>
  <a href="tel:+914442101234" class="fab-btn btn-call" aria-label="Call VARAM">
    <i data-lucide="phone" class="icon-md"></i>
  </a>
  <a href="https://wa.me/919840012345" class="fab-btn btn-whatsapp" target="_blank" rel="noopener noreferrer" aria-label="Chat with VARAM on WhatsApp">
    <i data-lucide="message-circle" class="icon-md"></i>
  </a>
</div>"""

pattern = r'<a href="https://wa\.me/919840012345" class="whatsapp-float"[^>]*>.*?</a>'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'whatsapp-float' in content:
        # replace the existing whatsapp float with new fab container
        new_content = re.sub(pattern, fab_html, content, flags=re.DOTALL)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

