#!/usr/local/bin/python3

demo_filename = 'list_page_1.txt'
import json

def get_nutrients():
    filename = 'list_page_1.txt'  # Deliberately hardcoded
    with open(filename, 'r') as i:
        data = json.loads(i.read())

    datawithnutrients = [u for u in data if u['foodNutrients']]

    return [u['name'] for u in datawithnutrients[0]['foodNutrients']]


def name_id_map_from_file(the_filename):
    with open(the_filename, 'r') as i:
        data = json.loads(i.read())  # It's all in one line

    datawithnutrients = [u for u in data if u['foodNutrients']]

    # ID and description
    return {u['description']: u['fdcId'] for u in datawithnutrients}


'''
Next steps

1. Produce food:id map for all foods
* ls the directory for data files, or do api call
* Is it even a good idea to have this all use the api bc that requires a key
  - you know what I have a key rn and maybe i can automate signup to save hosting costs
* for each file produce a dict
* unify that dict together
* Write it out

2. Make a food_name:id trie
2. Experiment with using react-select
2. how big is it? reasonable to send over hardcoded into the frontend?
'''

if __name__ == '__main__':
    print(nutrients := get_nutrients())
    print(name_id_map := name_id_map_from_file(demo_filename))
