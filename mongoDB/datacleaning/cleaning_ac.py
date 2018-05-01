import requests
import json
from pymongo import MongoClient
from pprint import pprint
import csv
import time


client = MongoClient("13.58.196.58", 27017)


def insert_into_mongo(data):
    db = client.test
    db.authenticate("lichangx", "Password@950610")
    collection = db.london_accommodations
    collection.insert_many(data)


def insert_reviews_into_mongo(data):
    db = client.test
    db.authenticate("lichangx", "Password@950610")
    collection = db.london_reviews
    collection.insert_many(data)


def clean_accommodation(name):
    file_name = name + "-accommodation.csv"
    csv_file = csv.reader(open(file_name, "r", encoding="utf-8"))
    results = []
    reviews = []
    for index, lines in enumerate(csv_file):
        if index <= 557:
            continue
        result = {}
        try:
            id = int(lines[0])
        except:
            continue
        result["id"] = id
        result["subCategory"] = "Hotel"
        result["details"] = lines[-2]
        result["reviews"] = lines[-1]
        review = get_reviews(result["reviews"], result["id"])
        results.append(result)
        reviews.append(review)
        if len(results) == 100:
            insert_reviews_into_mongo(reviews)
            insert_into_mongo(results)
            results = []
            reviews = []
            print("one hundred finish")
        print("now index: " + str(index))


def get_details(url):
    response = requests.get(url)
    resp = {}
    try:
        result = json.loads(response.text, encoding="utf-8")
    except Exception:
        return {}
    resp["id"] = result.get("id")
    if not resp["id"]:
        return ""
    resp["subCategory"] = result.get("subCategory")
    if not resp["subCategory"]:
        resp["subCategory"] = "Hotel"
    return resp


def get_reviews(url, place_id):
    response = requests.get(url)
    data = {}
    try:
        result = json.loads(response.text, encoding="utf-8")
    except Exception:
        return {}
    data["reviews"] = result
    data["placeId"] = place_id
    return data


if __name__ == "__main__":
    clean_accommodation("london")
