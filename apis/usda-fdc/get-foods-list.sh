#!/bin/bash


key=$(cat .env | sed 's,[^=]*=\(.*\)$,\1,')
echo $key

while true; do 
    curl "https://api.nal.usda.gov/fdc/v1/foods/list?api_key=$key&pageSize=200&pageNumber=$i" > 'list_page_'$i'.txt'
    sleep 1; 
    i=$((i + 1)); 
    echo $i; 
done