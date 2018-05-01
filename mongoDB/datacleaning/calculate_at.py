from pymongo import MongoClient
import requests
import json


client = MongoClient("13.58.196.58", 27017)
db = client.test
db.authenticate("lichangx", "Password@950610")
collection = db.london_attractions_reviews_calculates


def calculate_london_attractions_reviews():
    reviews = db.london_attractions_reviews.find()
    calculate_results = []
    for index, review in enumerate(reviews):
        try:
            calculate_result = dict()
            calculate_result["source_id"] = review["_id"]
            calculate_result["reviews_count"] = len(review["reviews"])
            polarity = 0
            if calculate_result["reviews_count"]:
                for element in review["reviews"]:
                    polarity += element["polarity"] if element.get("polarity") else 0
            calculate_result["average_polarity"] = (
                polarity / calculate_result["reviews_count"]) if calculate_result["reviews_count"] else 0
        except:
            continue
        calculate_results.append(calculate_result)
        if len(calculate_results) == 100:
            print("one hundred finish")
            collection.insert_many(calculate_results)
            calculate_results = []
        print("now index:" + str(index))
    if len(calculate_results) != 0:
        collection.insert_many(calculate_results)
    return "ok"


if __name__ == "__main__":
    print(calculate_london_attractions_reviews())