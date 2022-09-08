from crypt import methods
from distutils.log import debug
from flask import Flask, request
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re, json, redis, datetime


redis_client = redis.Redis(host='red-ccckbtun6mpkorrem0pg', port=6379, db = 0)
# redis_client = redis.from_url(os.environ['redis://red-ccckbtun6mpkorrem0pg:6379'])

def defaultIfNone(varToCheck, defaultValue):
    if(type(varToCheck) == None):
        return defaultValue
    elif(defaultValue == 1):
        try:
            float(varToCheck)
        except:
            return defaultValue
    return varToCheck

def getInfo(foodName, urlString):
    webpage = urlopen("https://hdh-web.ucsd.edu" + urlString)
    soup = BeautifulSoup(webpage, "html.parser")
    webpage.close()

    headings = soup.find_all("h2")
    
    redis_client.set(foodName, json.dumps({
        "calories" : defaultIfNone(str(soup.td.string), 1),
        "protein": defaultIfNone(soup.find(string=re.compile("Protein")).split()[-1][0:-1], 1),
        "carb": defaultIfNone(soup.find(string=re.compile("Tot. Carb.")).split()[-1][0:-1], 1),
        "fat": defaultIfNone(soup.find(string=re.compile("Total Fat")).split()[-1][0:-1], 1),
        "ingredients": defaultIfNone(str(headings[0].find_next_sibling("p").string), "").lower(),
        "allergens": defaultIfNone(str(headings[1].find_next_sibling("p").string), "")
    }))
    redis_client.expire(foodName, 60*60*24*30)

    return foodName

app = Flask(__name__)


@app.route("/getItems", methods=['GET'])
def getItems():

    workingDict = request.args.to_dict()
    url = "https://hdh-web.ucsd.edu/dining/apps/diningservices/Restaurants/MenuItem/" + workingDict["num"]
    page = urlopen(url)
    soup = BeautifulSoup(page, "html.parser")

    result = {}
    result.headers.add("Access-Control-Allow-Origin", "*")


    if(len(soup.find_all(string = re.compile(datetime.datetime.now().strftime("%A")[0:3] + " Closed"))) > 0):
        return result

    menuContainer = soup.find(id="menuContainer")
    menuItems = menuContainer.find_all(href=re.compile("nutritionfacts2"))
    result = {}
    
    for i in range(len(menuItems)):

        skip = False
        n = menuItems[i].parent.h1.string

        for thingToBeAvoided in workingDict["allergens"].split(","):
            if(len(menuItems[i].parent.find_all(title=re.compile(thingToBeAvoided))) > 0):
                skip = True
                break
        if(skip):
            continue

        vegCount = len(menuItems[i].parent.find_all(title=re.compile("Vegetarian")))
        veganCount = len(menuItems[i].parent.find_all(title=re.compile("Vegan")))

        if(workingDict["dietary"].find("Vegetarian") >= 0 and workingDict["dietary"].find("Vegan") >= 0):
            if(vegCount == 0 and veganCount == 0):
                skip = True 
        elif(workingDict["dietary"].find("Vegetarian") >= 0 and vegCount == 0):
            skip = True
        elif(workingDict["dietary"].find("Vegan") >= 0 and veganCount == 0):
            skip = True
        if(skip):
            continue

        if(redis_client.get(n) == None):
            getInfo(n, menuItems[i].get('href'))

        data = json.loads(redis_client.get(n))

        inConsideration = True
        for ingredientToBeAvoided in workingDict["ingredients"].lower().split(","):
            if(data["ingredients"].find(ingredientToBeAvoided, 0) >= 0):
                inConsideration = False
                break

        if(inConsideration):
            protein = workingDict["protein"].split(",")
            calories = workingDict["calories"].split(",")
            if( (float(protein[0]) <= float(data["protein"]) <= float(protein[1])) and  (float(calories[0]) <= float(data["calories"]) <= float(calories[1]))):
                result[n] = [data["protein"], data["calories"]]
    print(result)
    return result


if __name__ == "__main__":
    app.run(threaded=True)