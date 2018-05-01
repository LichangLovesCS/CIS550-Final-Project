from cleaning_ac import get_reviews, client
import json
import requests
import csv


def insert_into_mongo(data):
    db = client.test
    db.authenticate("lichangx", "Password@950610")
    collection = db.london_attractions
    collection.insert_many(data)

def insert_reviews_into_mongo(data):
    db = client.test
    db.authenticate("lichangx", "Password@950610")
    collection = db.london_attractions_reviews
    collection.insert_many(data)


def clean_attractions(name):
    file_name = name + "-attraction.csv"
    file = open(file_name, encoding="utf-8")
    csv_file = csv.reader(open(file_name, "r", encoding="utf-8"))
    results = []
    reviews = []
    tag = 6428
    for index, lines in enumerate(csv_file):
        try:
            if index <= tag:
                continue
            result = {}
            try:
                _id = int(lines[0])
                sub_category = "Attraction"
            except:
                _id = int(lines[2])
                sub_category = lines[-3].replace(r'"', '')
            result["id"] = _id
            result["subCategory"] = sub_category
            result["reviews"] = lines[-1]
            result["details"] = lines[-2]
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
        except:
            tag = index - index%100
            results = []
            reviews = []

def clean_attractions_details(name):
    file_name = name + "-attraction.csv"
    csv_file = csv.reader(open(file_name, "r", encoding="utf-8"))
    db = client.test
    db.authenticate("lichangx", "Password@950610")
    _collection = db.london_attractions_details
    results = []
    tag = 0
    ben_lat = 51.499227777777776
    ben_lng = 0.13796666666666668
    for index, lines in enumerate(csv_file):
        if index <= tag:
            continue
        if index > 6898:
            break
        result = {}
        try:
            _id = int(lines[0])
            sub_category = "Attraction"
            lat = lines[-4]
            lng = lines[-3]
        except:
            _id = int(lines[2])
            sub_category = lines[-3].replace(r'"', '')
            lat = lines[3]
            lng = lines[4]
        try:
            float(lat)
            float(lng)
        except:
            continue
        result["id"] = _id
        result["subCategory"] = sub_category
        result["reviews"] = lines[-1]
        result["details"] = lines[-2]
        result["lat"] = float(lat)
        result["lng"] = float(lng)
        result["ben_lat_dis"] = abs(ben_lat - float(result["lat"]))
        result["ben_lng_dis"] = abs(ben_lng - float(result["lng"]))
        results.append(result)
        if len(results) == 100:
            print("one hundred finish")
            _collection.insert_many(results)
            results = []
        print("now index: " + str(index))
    if len(results) > 0:
        _collection.insert_many(results)
    return "ok"


if __name__ == "__main__":
    clean_attractions_details("london")
