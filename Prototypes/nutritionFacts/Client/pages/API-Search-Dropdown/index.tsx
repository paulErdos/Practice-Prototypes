import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Select from 'react-select'; 
import {Button} from "@heroui/react"
import React, { useState } from 'react';
//import { Card } from "@heroui/react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";
import { Input } from "@heroui/react";
import AsyncSelect from 'react-select/async';

/*
TODO:
* Priority 1: Save button needs to be able to access the data in each row: data is used by "Rows" to display "Row"s, "Row"s can set and alter their data, data owned supra-row to facilitate downloading and rendering by uploaded data
  * Integrate theRows into Rows
  * Have Row be passed its data, either as a single array or element by element.
  * Have Row display the data it's passed
  * Have Row alter and set the data it's passed
* Priority 2:
  * Have the entire thing covered under a "Create a new Recipe Ingredients" that opens the card
  * > Ohhh and that can be reaccassed by pressing 'nvm' on the first card ohhhhhh
  * > This will need to be a state variable in rows that pays att
  * > No it doesn't need to exist
* Recipe card needs a way to name things.
* And maybe that picture area can be a color theme selector, idk. 
* > This means, like, rows or recipecard will need to be the root data storage facility.
* Why isn't deleterow operating as expected?
* Unit selection takes multiple clicks to land properly
*/

{/*
Next Steps:
* [x] Add quantity selector dropdown that appears after the food selector dropdown has a selection
* [ ] Add units selector dropdown, cups, grams, ounces, etc. 
* [ ] Add button to do some dummy api call, like curling pi from somewhere
* [ ] Add these to a card where new rows can be added
* [ ] Add a way to save the card info as a file on the client's machine.
* [ ] Add a way to load saved card info
* [ ] Then bring that over. 
* [ ] viz: by calorie, by gram, by any other metric
*     > Where would this even go
* [ ] Fixed width
* [ ] Vertically center add new / x button
* [ ] AsyncSelect https://react-select.com/home
* 
*/}


export default function RecipePage() {
  const [buttonPushed, setButtonPushed] = useState(false);

  const [selectedFood, setSelectedFood] = useState("foobar");

  const handleFoodSelection = (theFoodSelection: any) => {
     setSelectedFood(theFoodSelection.value)
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Search Dropdown</h1>
          <div><p>So the goal here is to have a dropdown, the food dropdown, display a list of foods. For now it's fine to just use the simplest proxy server, and then in a separate step, add a database.</p></div>
        </div>

      <Selector2
        selectedOption={selectedFood}
        setSelectedOption={handleFoodSelection}
      />

      </section>
    </DefaultLayout>
  );
}



{/* Begin Async Experiment 1 */}
{/* See about having this hit by api call the usda search function */}
{/*} This allows for selecting newly-added options, but
  > doesn't show the added options when the down arrow is clicked
*/}
const Selector2 = ({selectedOption, setSelectedOption}) => {
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
