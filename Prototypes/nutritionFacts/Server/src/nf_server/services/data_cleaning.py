#!/usr/bin/env python3

import json


def get_test_data():
    with open('17504304279746428.json', 'r') as i:
        return json.loads(i.read())

def drop_unneeded(data):
    data.pop('totalHits')
    data.pop('currentPage')
    data.pop('totalPages')
    data.pop('pageList')
    data.pop('aggregations')
    data.pop('foodSearchCriteria')
    return data

def remap_criteria(data):
    print(data.keys())
    data['query'] = data['foodSearchCriteria']['generalSearchInput']
    return data

def winnow_toplevel_food(food):
    ban_list = [
        'fdcId', 'lowercaseDescription', 'commonNames', 
        'additionalDescriptions', 'dataType', 'ndbNumber', 'publishedDate', 
        'foodCategory', 'allHighlightFields', 'score', 'finalFoodInputFoods',
        'foodMeasures', 'foodAttributes', 'foodAttributeTypes',
        'foodVersionIds'
    ]

    for chaff in ban_list:
        food.pop(chaff)
    
    return food

def clean(data):
    mapped = remap_criteria(data)
    passed = drop_unneeded(mapped)
    passed['foods'] = [winnow_toplevel_food(u) for u in passed['foods']]

    done = clean_nutrients(passed)
    return done

def clean_nutrients(data):
    keep_list = ['nutrientName', 'unitName', 'value']
    for food in data['foods']:
        for nutrient in food['foodNutrients']:
            for field in list(nutrient.keys()):
                if field not in keep_list:
                    nutrient.pop(field)

    return data


if __name__ == '__main__':
    parsed = get_test_data()
    done = clean(parsed)
    with open('clean-data-for-inspection.json', 'w') as o:
        o.write(json.dumps(done, indent=4))
