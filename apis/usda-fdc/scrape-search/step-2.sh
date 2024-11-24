#!/bin/bash

curl 'https://fdc.nal.usda.gov/portal-data/external/search' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'DNT: 1' \
  -H 'Origin: https://fdc.nal.usda.gov' \
  -H 'Referer: https://fdc.nal.usda.gov/food-search?query=kefir&type=SR%20Legacy' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --data-raw '{"includeDataTypes":{"SR Legacy":true},"referenceFoodsCheckBox":true,"requireAllWords":true,"generalSearchInput":"kefir","pageNumber":1,"exactBrandOwner":null,"sortCriteria":{"sortColumn":"description","sortDirection":"asc"},"startDate":"","endDate":"","includeTradeChannels":null,"includeMarketCountries":null,"includeTags":null,"sortField":"","sortDirection":null,"currentPage":1}'
