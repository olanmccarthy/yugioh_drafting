import json
import requests

class OutputJson:
    def __init__(self, amountOfPacks, raresPerPack, commonsPerPack, starfoilsPerPack, starfoils, rares, commons):
        self.amountOfPacks = amountOfPacks
        self.raresPerPack = raresPerPack
        self.commonsPerPack = commonsPerPack
        self.starfoilsPerPack = starfoilsPerPack
        self.starfoils = starfoils
        self.rares = rares
        self.commons = commons

    def toDict(self):
        data = {}
        data['amountOfPacks'] = self.amountOfPacks
        data['raresPerPack'] = self.raresPerPack
        data['commonsPerPack'] = self.commonsPerPack
        data['starfoilsPerPack'] = self.starfoilsPerPack
        data['starfoils'] = self.starfoils
        data['rares'] = self.rares
        data['commons'] = self.commons

        return data


new_list = []

with open('sets/Dark.json') as json_file:
    data = json.load(json_file)
    for name in data['commons']:
        new_name = name.replace(" ", "%20")
        url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?name=" + new_name
        r = requests.get(url = url)
        data = r.json()
        try:
            id = data["data"][0]["id"]
        except:
            id = 'not found'
        new_list.append('{"name": "%s", "id": "%s"}' % (name, id))

output = OutputJson(3,0,10,0,[],[],new_list)

with open("sets/Dar_new.json", "w") as output_json:
    json.dump(output.toDict(), output_json)