from pymongo import MongoClient


client = MongoClient("13.58.196.58", 27017)
db = client.test
db.authenticate("lichangx", "Password@950610")
collection = db.london_restaurants_reviews_calculates


def calculate_london_restaurants_reviews():
    reviews = db.london_restaurants_reviews.find()
    calculate_results = []
    for index, review in enumerate(reviews):
        calculate_result = dict()
        calculate_result["source_id"] = review["_id"]
        calculate_result["reviews_count"] = len(review["reviews"])
        polarity = 0
        word_counts = 0
        good_polarity = 0
        rate = 0
        lan = set()
        if calculate_result["reviews_count"]:
            for element in review["reviews"]:
                polarity += element["polarity"] if element.get("polarity") else 0
                good_polarity += int(polarity) if polarity > 5 else 0
                rate += element["rating"] if element.get("rating") else 0
                word_counts += int(element["WordsCount"]) if element.get("WordsCount") else 0
                lan.add(element["language"])
        calculate_result["average_polarity"] = (
            polarity / calculate_result["reviews_count"]) if calculate_result["reviews_count"] else 0
        calculate_result["average_words_count"] = (
            word_counts / calculate_result["reviews_count"]) if calculate_result["reviews_count"] else 0
        calculate_result["average_rate"] = (
            word_counts / calculate_result["reviews_count"]) if calculate_result["reviews_count"] else 0
        if polarity and calculate_result["reviews_count"]:
            calculate_result["pol_divide_counts"] = good_polarity / (
                calculate_result["reviews_count"] * calculate_result["reviews_count"])
        else:
            calculate_result["pol_divide_counts"] = 0
        calculate_result["language_kinds"] = len(lan)
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
    print(calculate_london_restaurants_reviews())
