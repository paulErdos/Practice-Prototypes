#!/usr/bin/env python3

import json


def clean(data):
    remap_criteria(data)
    drop_unneeded(data)
    data['foods'] = [winnow_toplevel_food(u) for u in data['foods']]
    clean_nutrients(data)

    return data


def remap_criteria(data):
    data['query'] = data['foodSearchCriteria']['generalSearchInput']


def drop_unneeded(data):
    fields = [
        'totalHits',
        'currentPage',
        'totalPages',
        'pageList',
        'aggregations',
        'foodSearchCriteria']

    for f in fields:
        data.pop(f)


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


def clean_nutrients(data):
    for food in data['foods']:
        for nutrient in food['foodNutrients']:
            modify_nutrient(nutrient)


def modify_nutrient(n):
    remove_unneeded_items(n)
    standardize_units(n)


def remove_unneeded_items(nutrient):
    keep_list = ['nutrientName', 'unitName', 'value']
    for field in list(nutrient.keys()):
        if field not in keep_list:
            nutrient.pop(field)


def standardize_units(n):
    # Ignore duplicate energy in kJ
    if n['unitName'].upper()== 'KJ':
        n['unitName'] = 'KCAL'
        n['value'] = 0



if __name__ == '__main__':
    with open('17504304279746428.json', 'r') as i:
        data = json.loads(i.read())

    clean(data)

    with open('clean-data-for-inspection.json', 'w') as o:
        o.write(json.dumps(data, indent=4))
