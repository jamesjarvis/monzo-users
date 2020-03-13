from csv import DictWriter
from datetime import datetime
import requests


def create_file(name: str):
  with open(name, 'w', newline='') as csvfile:
    fieldnames = ['date', 'count']
    writer = DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

def get_new_count() -> int:
  url = "https://api.monzo.com/user-counter/count"
  resp = requests.get(url)
  data = resp.json()
  return data.get('count')

def add_value(name: str, count: int):
  now = datetime.now()
  newrow = {
    'date': now.isoformat(),
    'count': count
  }
  with open(name, 'a', newline='') as csvfile:
    fieldnames = ['date', 'count']
    writer = DictWriter(csvfile, fieldnames=fieldnames)
    writer.writerow(newrow)
