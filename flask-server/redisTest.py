import redis, re, json
from urllib.request import urlopen
from bs4 import BeautifulSoup

redis_client = redis.Redis(host='localhost', port=6379, db = 0)

def getInfo(foodName, urlString):
    webpage = urlopen("https://hdh-web.ucsd.edu" + urlString)
    soup = BeautifulSoup(webpage, "html.parser")
    webpage.close()

    headings = soup.find_all("h2")

    redis_client.set(foodName, json.dumps({
        "calories" : soup.td.string,
        "protein": soup.find(string=re.compile("Protein")).split()[-1],
        "carb": soup.find(string=re.compile("Tot. Carb.")).split()[-1],
        "fat": soup.find(string=re.compile("Total Fat")).split()[-1],
        "ingredients": headings[0].find_next_sibling("p").string.lower,
        "allergens": headings[1].find_next_sibling("p").string,
        "url" : "https://hdh-web.ucsd.edu" + urlString
    }))

    return foodName

url = "https://hdh-web.ucsd.edu/dining/apps/diningservices/Restaurants/MenuItem/" + r
page = urlopen(url)
soup = BeautifulSoup(page, "html.parser")

menuContainer = soup.find(id="menuContainer")
menuItems = menuContainer.find_all(href=re.compile("nutritionfacts2"))
result = {}

workingDict = request.args.to_dict()

for i in range(len(menuItems)):
    skip = False
    n = menuItems[i].parent.h1.string
    for thingToBeAvoided in workingDict["allergens"].split(","):
        if(len(menuItems[i].parent.find_all(title=re.compile(thingToBeAvoided))) > 0):
            skip = True
            break
    if(skip):
        continue

    for dietToFollow in workingDict["dietary"].split(","):
        if(len(menuItems[i].parent.find_all(title=re.compile(thingToBeAvoided))) == 0):
            skip = True
            break
    if(skip):
        continue

    print(redis_client.get(n))
    if(redis_client.get(n) == "(nil)"):
        getInfo(n, menuItems[i].get('href'))

    data = json.loads(redis_client.get(n))

    inConsideration = True
    for ingredientToBeAvoided in workingDict["ingredients"].lower().split(","):
        if(data["ingredients"].indexOf(ingredientToBeAvoided) >= 0):
            inConsideration = False
            break

    if(inConsideration):
        protein = workingDict["protein"].split(",")
        calories = workingDict["calories"].split(",")
        if( (int(protein[0]) <= int(data["protein"]) <= int(protein[1])) and  (int(calories[0]) <= int(data["calories"]) <= int(calories[1]))):
            result[n] = [data["url"], data["protein"], data["calories"]]

    