import random
import re
import requests
from bs4 import BeautifulSoup

def parse_auction_name(soup):
    groups = soup.select("div.subject_info_block__group")
    for group in groups:
        label = group.select_one("div.subject_info_block__group_label")
        if label and label.text.strip() == "Выставка":
            value = group.select_one("div.subject_info_block__group_value a")
            if value:
                return value.text.strip()
    return None

def parse_description(soup):
    main_content = soup.select_one("div.main_content")
    if not main_content:
        description_div = soup.select_one("div.editable_block.with_editor_panel")
        if description_div:
            paragraphs = description_div.find_all(["p", "div"], recursive=False)
            clean_paragraphs = [p.get_text(" ", strip=True) for p in paragraphs if p.get_text(strip=True)]
            return "\n\n".join(clean_paragraphs[:2])
        return None
    
    texts = []

    editable_blocks = main_content.select("div.editable_block.with_editor_panel")
    for block in editable_blocks:
        text = block.get_text(" ", strip=True)
        if text:
            texts.append(text)
        if len(texts) >= 5:
            break

    return "\n\n".join(texts) if texts else None


def parse_author(soup):
    author_element = soup.select_one("div.subject_info_block__authors a.subject_info_block__author")
    

    if not author_element:
        author_element = soup.select_one("div.subject_info_block__author.paragraphS")
    

    if not author_element:
        author_element = soup.select_one("div.subject_info_block__authors div.subject_info_block__author")
    

    if not author_element:
        title_block = soup.select_one("h1.subject_info_block__title")
        if title_block and " - " in title_block.text:
            possible_author = title_block.text.split(" - ")[0].strip()
            if len(possible_author) < 100:  
                return clean_author_name(possible_author) or "Не указан"
    

    return clean_author_name(author_element.text.strip()) if author_element else "Не указан"

def clean_author_name(author):
    if not author:
        return None

    author = ' '.join(author.split())

    author = re.sub(r'\(.*?\)', '', author).strip()
    return author if author else None

def parse_lot_detail(url, base_url="https://ar.culture.ru"):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/114.0.0.0 Safari/537.36"
        )
    }
    
   
    full_url = url if url.startswith("http") else f"{base_url}{url}"
    
    try:
        resp = requests.get(full_url, headers=headers)
        print(f"Processing URL: {full_url}, Status code: {resp.status_code}")
        
        if resp.status_code != 200:
            print(f"Failed to fetch {full_url}, status code: {resp.status_code}")
            return None

        soup = BeautifulSoup(resp.text, "html.parser")

        title = soup.select_one("h1.subject_info_block__title")
        title = title.text.strip() if title else None

        materials = None
        for group in soup.select("div.subject_info_block__group"):
            label = group.select_one("div.subject_info_block__group_label")
            if label and "техника" in label.text.lower():
                val = group.select_one("div.subject_info_block__group_value")
                if val:
                    materials = val.text.strip()
                break

        description = parse_description(soup)
        start_price = random.randint(0, 1000)


        image = soup.select_one("img#point_test_image")
        if image:
            if image.has_attr("data-src"):
                image_url = image["data-src"]
            elif image.has_attr("src"):
                image_url = image["src"]
            else:
                image_url = None
        else:
            image_url = None

        auction_name = parse_auction_name(soup)
        author = parse_author(soup)
        
        return {
            "url": full_url,
            "title": title,
            "lot_materials": materials,
            "description": description,
            "image_url": image_url,
            "auction_name": auction_name,
            "lot_author": author,
             "start_price": start_price
        }
    
    except Exception as e:
        print(f"Error processing {full_url}: {str(e)}")
        return None

def process_urls(url_list, output_file="results.json"):
    import json
    results = []
    
    for url in url_list:
        data = parse_lot_detail(url)
        if data:
            results.append(data)
            print(f"Processed: {url}")
        else:
            print(f"Skipped: {url}")
    

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\nProcessing complete. Results saved to {output_file}")
    return results

if __name__ == "__main__":

    urls = [
        "/ru/subject/allegoriya-brennosti",
        "/ru/subject/vid-v-krymu-pri-zakate-solnca",
        "/ru/subject/ikona-gospod-vsederzhitel-9",
        "/ru/subject/sadko",
        "/ru/subject/yudif-i-olofern"
    ]
    

    process_urls(urls)