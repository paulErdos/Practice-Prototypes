#!/usr/local/bin/python3

filename = 'list_page_1.txt'
import json


if __name__ == '__main__':
    with open(filename, 'r') as i:
        data = json.loads(i.read())

    datawithnutrients = [u for u in data if u['foodNutrients']]

    print(datawithnutrients[0]['foodNutrients'][0])

    # Print the nutrients
    for thing in datawithnutrients[0]['foodNutrients']:
        print(thing['name'])

    # Print the foods
    # ID and description
    print({u['description']: u['fdcId'] for u in datawithnutrients})
