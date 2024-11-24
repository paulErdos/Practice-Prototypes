#!/bin/bash


key=$(cat .env | sed 's,[^=]*=\(.*\)$,\1,')
echo $key

# 500 all shards failed starting at 251
if false; then
    i=251
    while true; do 
        http_status=$(curl -o 'list_page_'$i'.txt' -w "%{http_code}" "https://api.nal.usda.gov/fdc/v1/foods/list?api_key=$key&pageSize=200&pageNumber=$i")

        if [ "$http_status" -ne 200 ]; then
            echo "Failed with status $http_status"
            break
        fi

        sleep 1; 
        i=$((i + 1)); 
        echo $i; 
    done
fi


i=1
while true; do
    response=$(curl -X 'POST' \
      "https://api.nal.usda.gov/fdc/v1/foods/list?api_key=$key" \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d "{
          'dataType': [
            'Foundation',
            'SR Legacy'
          ],
          'pageSize': 200,
          'pageNumber': "$i",
          'sortBy': 'dataType.keyword',
          'sortOrder': 'asc'
        }")

    http_status=$(echo "$response" | jq -r '.statusCode')

    if [ "$http_status" -ne 200 ]; then
        echo "Failed with status $http_status"
        break
    fi

    echo "$response" > "post_page_$i.txt";
    echo $i;
    i=$((i + 1));
    sleep 1;
done