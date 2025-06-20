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


if __name__ == '__main__':
    parsed = get_test_data()
    mapped = remap_criteria(parsed)
    passed = drop_unneeded(mapped)
    passed['foods'] = [winnow_toplevel_food(u) for u in passed['foods']]
