import requests
import pandas as pd
from selectolax.parser import HTMLParser

def getData():
    response = HTMLParser(requests.get("https://www.trainhelp.in/mumbai-local-train-time-table/").content)
    selector = ".tablepress-scroll-wrapper > table"

    table = 1
    for node in response.css(selector):
        data = pd.read_html(node.html)[0]
        data.to_csv(f"./data/Table - {table}.csv", index = False)
        table += 1

if __name__ == "__main__":
    getData()