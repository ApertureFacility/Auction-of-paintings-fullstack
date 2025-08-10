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

def parse_author(soup):

    author_element = soup.select_one("#web_version > main > section:nth-child(3) > div > div.subject_right > div.subject_info_block_wrapper.desktop > div.subject_info_block > div.subject_info_block__authors > a")
    

    if not author_element:
        author_element = soup.select_one("div.subject_info_block__authors a.subject_info_block__author")
    
    return author_element.text.strip() if author_element else None


def parse_lot_detail(url):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/114.0.0.0 Safari/537.36"
        )
    }
    resp = requests.get(url, headers=headers)
    print("Status code:", resp.status_code)


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

    description_div = soup.select_one("div.editable_block.with_editor_panel")
    if description_div:
        paragraphs = description_div.find_all(["p", "div"], recursive=False)
        clean_paragraphs = [p.get_text(" ", strip=True) for p in paragraphs if p.get_text(strip=True)]
        description = "\n\n".join(clean_paragraphs[:2])
    else:
        description = None

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
        "title": title,
        "lot_materials": materials,
        "description": description,
        "image_url": image_url,
        "auction_name": auction_name,
        "lot_author":author
    }

if __name__ == "__main__":
    test_url = "https://ar.culture.ru/ru/subject/razyasnivaetsya"
    data = parse_lot_detail(test_url)
    for key, value in data.items():
        print(f"{key}: {value}\n{'-'*40}")
