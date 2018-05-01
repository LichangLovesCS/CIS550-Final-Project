from cleaning_ac import get_reviews, client
import json
import requests
import csv


def insert_into_mongo(data):
    db = client.test
    db.authenticate("lichangx", "Password@950610")
    collection = db.london_restaurants
    collection.insert_many(data)

def insert_reviews_into_mongo(data):
    db = client.test
    db.authenticate("lichangx", "Password@950610")
    collection = db.london_restaurants_reviews
    collection.insert_many(data)


def clean_restaurants(name):
    file_name = name + "-restaurant.csv"
    csv_file = csv.reader(open(file_name, "r", encoding="utf-8"))
    results = []
    reviews = []
    tag = 8223
    for index, lines in enumerate(csv_file):
        try:
            if index <= tag:
                continue
            result = {}
            try:
                _id = int(lines[0])
                sub_category = "Restaurant"
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
            tag = index = index%100
            results = []
            reviews = []

if __name__ == "__main__":
    clean_restaurants("london")
