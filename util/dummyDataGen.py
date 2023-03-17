import json
import random
from datetime import datetime

# Dummy data for restaurant collection
restaurants = [
    {
        "_id": {"$oid": "63f506cc6f4516ca29817526"},
        "name": "Fan Wu",
        "owner": "Nino",
        "owner_mail": "getthefoodmoving@gmail.com",
        "menu": [],
        "tables": ["1", "1bis", "2", "3", "4"],
        "password": "1234",
    },
    {
        "_id": {"$oid": "63f506cc6f4516ca29817527"},
        "name": "La Trattoria",
        "owner": "Mario",
        "owner_mail": "mario@latrattoria.com",
        "menu": [],
        "tables": ["5", "6", "7", "8", "9"],
        "password": "5678",
    },
    {
        "_id": {"$oid": "63f506cc6f4516ca29817528"},
        "name": "Le Bistro",
        "owner": "Sophie",
        "owner_mail": "sophie@lebistro.com",
        "menu": [],
        "tables": ["10", "11", "12", "13", "14"],
        "password": "2468",
    },
]

# Dummy data for food collection
food_categories = {
    "63f506cc6f4516ca29817526": ["Pizza", "Pasta", "Dessert"],
    "63f506cc6f4516ca29817527": ["Antipasti", "Primi Piatti", "Secondi Piatti"],
    "63f506cc6f4516ca29817528": ["Appetizers", "Salads", "Entrees"],
}
food_items = []
for restaurant in restaurants:
    for category in food_categories[str(restaurant["_id"]["$oid"])]:
        for i in range(25):
            food_item = {
                "_id": {
                    "$oid": "".join(
                        random.choice("0123456789abcdef") for _ in range(24)
                    )
                },
                "name": category + " " + str(i + 1),
                "description": "Description of " + category + " " + str(i + 1),
                "price": random.randint(500, 2000),
                "restaurant_id": str(restaurant["_id"]["$oid"]),
                "vegan": random.choice([True, False]),
                "spicy": random.choice([True, False]),
                "gluten_free": random.choice([True, False]),
                "lactose_free": random.choice([True, False]),
                "created_at": {
                    "$date": {
                        "$numberLong": str(
                            int(datetime.timestamp(datetime.now()) * 1000)
                        )
                    }
                },
                "__v": 0,
                "category": category,
            }
            restaurant["menu"].append(food_item["_id"]["$oid"])
            food_items.append(food_item)

# Write data to file
with open("dummy_data_restaurant.txt", "w") as f:
    f.write(json.dumps(restaurants))

with open("dummy_data_food.txt", "w") as f:
    f.write(json.dumps(food_items))

print("Dummy data written to 'dummy_data_restaurant.txt' and 'dummy_data_food.txt'")
