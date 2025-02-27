import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
//import Select from 'react-select'; 
import { Button } from "@nextui-org/react";
//import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
//import { Input } from '@nextui-org/react';
import { useState } from 'react';

import AsyncSelect from 'react-select/async';

/*
function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>API Call Button</h1>
        </div>

        <div>
          <RandomNumberFetchButton />
        </div>

      </section>
    </DefaultLayout>
  );
}
*/

export default function RandomNumberFetchButton() {
  const [firstNumber, setFirstNumber] = useState(null);

  const handleButtonClick = async () => {
    try {
      const response = await fetch('https://www.random.org/integers/?num=100&min=1&max=100&col=5&base=10&format=html&rnd=new');
      const text = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const preElement = doc.querySelector('pre.data');
      
      if (preElement) {
        const numbers = preElement.textContent.split("\t");
        //console.log(numbers);
        setFirstNumber(numbers[0]);
      }
    } catch (error) {
      console.error("Error making API call:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Button color="primary" variant="solid" onClick={handleButtonClick}>
        Fetch Random Number
      </Button>

      {firstNumber && <p>{firstNumber}</p>}
    </div>
  );

}

export function StaticFdcSearchButton () {
  const [responseText, setResponseText] = useState("");
  const [foodsData, setFoodsData] = useState([]);

  const handleButtonClick = async () => {
    try {
      const url = "http://localhost:8080/test-rest"
      const response = await fetch(url);
      const text = await response.text();
      
      const data = JSON.parse(text);
      var names = [];
      var dataFoods = [];
      for(const item of data.foods) {
        var theValue = [];
      
        for(const datum of item.foodNutrients) {
          theValue.push({nutrientName: datum.nutrientName,
            value: datum.value,
            unitName: datum.unitName
          })
        }
      
        names.push(item.description);
        dataFoods.push({label: item.description, value: theValue})
      }

      var responseText = JSON.stringify(names);
      setResponseText(responseText);

      var dataText = JSON.stringify(dataFoods);
      setFoodsData(dataText);

    } catch (error) {
      console.error("Error making API call:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Button color="primary" variant="solid" onClick={handleButtonClick}>
        Search USDA FDC for "kefir"
      </Button>

      {responseText && <p>{responseText}</p>}
      <ul>
        <li> foods    //    vv data vv</li>
      </ul>
      <p></p>
      {foodsData && <p>{foodsData}</p>}
    </div>
  );

}

{/* Begin Async Experiment 1 */}
{/* See about having this hit by api call the usda search function */}
{/*} This allows for selecting newly-added options, but
  > doesn't show the added options when the down arrow is clicked
*/}
export const Selector2 = ({selectedOption, setSelectedOption}) => {
  //const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (selection: {value: string, label: number}) => {
    setSelectedOption(selection);
  }

  var s2options = [{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }];

  const s2FilterOptions = (inputValue: string) => {
    return s2options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const s2InputChange = (inputValue: string) => {
    // Add a new option to the list
    // TODO: experiment with doing these as a state
    const newOption = { label: inputValue, value: s2options.length + 1 };
    s2options = [...s2options, newOption];
  }

  const s2LoadOptions = (
    inputValue: string,
    callback: (options: {label: string, value: number}[]) => void
  ) => {
    setTimeout(() => {
      callback(s2FilterOptions(inputValue));
    }, 1000);
  };

  return (
    <AsyncSelect 
      cacheOptions
      defaultOptions 
      loadOptions={s2LoadOptions}
      onInputChange={s2InputChange}
      onChange={handleChange}
      menuPosition="fixed"  // Avoid clipping

      placeholder="Add A Food"
      styles={{
        option: (provided) => ({
          ...provided,
          color: 'black',
          backgroundColor: 'white',
        }),
      }}
    />
  );
};

{/* End Async Experiment 1 */}