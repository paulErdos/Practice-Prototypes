import { useState } from 'react';
import { Button, Textarea } from '@nextui-org/react';

const FetchDataComponent = () => {
  const [text, setText] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('https://fdc.nal.usda.gov/portal-data/external/search', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/json',
                    'DNT': '1',
                    //'Origin': 'https://fdc.nal.usda.gov',
                    'Referer': 'https://fdc.nal.usda.gov/food-search?query=kefir&type=SR%20Legacy',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                },
                body: JSON.stringify({
                    includeDataTypes: { 'SR Legacy': true },
                    referenceFoodsCheckBox: true,
                    requireAllWords: true,
                    generalSearchInput: 'kefir',
                    pageNumber: 1,
                    exactBrandOwner: null,
                    sortCriteria: { sortColumn: 'description', sortDirection: 'asc' },
                    currentPage: 1,
                }),
                //mode: 'cors',
            });
            const data = await response.json();
            setText(JSON.stringify(data, null, 2));

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

  

  return (
    <div>
      <Button onPress={fetchData}>Fetch Data</Button>
      <Textarea value={text} readOnly />
    </div>
  );
};

export default FetchDataComponent;
