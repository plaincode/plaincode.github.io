#!/usr/bin/env python3
import urllib.request
import re
import os
from urllib.parse import urljoin, urlparse
from html.parser import HTMLParser

class ImageScraper(HTMLParser):
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.images = []
        
    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            attrs_dict = dict(attrs)
            if 'src' in attrs_dict:
                img_url = urljoin(self.base_url, attrs_dict['src'])
                self.images.append(img_url)

def download_image(url, save_path):
    try:
        urllib.request.urlretrieve(url, save_path)
        print(f"✓ Downloaded: {os.path.basename(save_path)}")
        return True
    except Exception as e:
        print(f"✗ Failed to download {url}: {e}")
        return False

def scrape_site():
    urls_to_scrape = [
        'https://www.plaincode.com/',
        'https://www.plaincode.com/products/',
        'https://www.plaincode.com/products/clinometer/',
        'https://www.plaincode.com/products/magnetmeter/',
        'https://www.plaincode.com/products/accelmeter/',
        'https://www.plaincode.com/products/isetsquare/',
        'https://www.plaincode.com/products/contactsbynumber/',
        'https://www.plaincode.com/products/magichue/',
    ]
    
    all_images = set()
    
    for url in urls_to_scrape:
        print(f"\nScraping: {url}")
        try:
            with urllib.request.urlopen(url) as response:
                html = response.read().decode('utf-8')
                
            parser = ImageScraper(url)
            parser.feed(html)
            
            for img_url in parser.images:
                all_images.add(img_url)
                
        except Exception as e:
            print(f"Error scraping {url}: {e}")
    
    print(f"\n\nFound {len(all_images)} unique images")
    
    # Create directories
    os.makedirs('images/apps', exist_ok=True)
    os.makedirs('images/screenshots', exist_ok=True)
    os.makedirs('images/icons', exist_ok=True)
    os.makedirs('images/other', exist_ok=True)
    
    # Download images
    downloaded = 0
    for img_url in sorted(all_images):
        # Skip tiny images, ads, social media buttons
        if any(skip in img_url.lower() for skip in ['1x1', 'pixel', 'tracker', 'ads', 'facebook.com', 'twitter.com']):
            continue
            
        # Determine category and filename
        filename = os.path.basename(urlparse(img_url).path)
        
        if not filename or '.' not in filename:
            continue
            
        # Categorize images
        if 'icon' in img_url.lower() or 'logo' in img_url.lower():
            save_dir = 'images/icons'
        elif 'screenshot' in img_url.lower() or 'screen' in img_url.lower():
            save_dir = 'images/screenshots'
        elif any(app in img_url.lower() for app in ['clinometer', 'magnetmeter', 'accelmeter', 'isetsquare', 'icontacts', 'magichue']):
            save_dir = 'images/apps'
        else:
            save_dir = 'images/other'
        
        save_path = os.path.join(save_dir, filename)
        
        # Avoid duplicates
        if os.path.exists(save_path):
            continue
            
        if download_image(img_url, save_path):
            downloaded += 1
    
    print(f"\n\nSuccessfully downloaded {downloaded} images!")
    
    # List what we got
    print("\n=== Downloaded Images by Category ===")
    for category in ['apps', 'screenshots', 'icons', 'other']:
        dir_path = f'images/{category}'
        files = os.listdir(dir_path) if os.path.exists(dir_path) else []
        if files:
            print(f"\n{category.upper()}:")
            for f in sorted(files):
                print(f"  - {f}")

if __name__ == '__main__':
    scrape_site()
