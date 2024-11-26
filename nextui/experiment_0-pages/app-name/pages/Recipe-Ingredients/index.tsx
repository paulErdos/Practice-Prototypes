import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Select from 'react-select'; 
import {Button} from "@nextui-org/react"
import React, { useState } from 'react';
//import { Card } from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import { Input } from '@nextui-org/react';
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

export default function RecipePage() {
  const [buttonPushed, setButtonPushed] = useState(false);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Recipe Ingredients</h1>
          <div><p>This Card is used to build the ingredients of a recipe.</p></div>
          <div style={{marginBottom: "20px"}}>The ingredients of a recipe is a list of foods or other ingredients, with a corresponding amount for each.</div>
          <div>I intend to put this in a card: "https://react-select.com/home"</div>
          <div>Note to self for future perspective: if recipes can be saved, named, and used as ingredients, meals of recipe servings are trivial</div>
        </div>

        <div>
          <RecipeIngredients />
        </div>

      </section>
    </DefaultLayout>
  );
}


interface IngredientSpec {
  food: string,
  unit: string,  // TODO: can this be an enum of that list of food units?
  amount: number
}

const newBlankRow = (): IngredientSpec => ({
  food: "",
  unit: "",     // TODO: maybe default to grams
  amount: 0
})


// Work-In-Progress Recipe Ingredients Card
const RecipeIngredients = () => {
  const [rows, setRows] = useState<IngredientSpec[]>([newBlankRow()])
  const [onlyOneRow, setOnlyOneRow] = useState(true);

  // Add new blank row
  const addRow = () => {
    setRows([...rows, newBlankRow()]); // Add a new row by appending the next index

    if(onlyOneRow && rows.length > 1) {
      setOnlyOneRow(false);
    }
  };

  // Save or update newest populated or populating row
  const registerPopulatedRow = (rowData: IngredientSpec) => {
    setRows([...rows.slice(0, -1), rowData])
  }


  const deleteRow = (idToDelete: number) => {
    if(rows.length == 1) {
      resetRow()
    } else {
      setRows(rows.filter((index) => index !== idToDelete));
    }
  }


  return (
    <div class="RecipeIngredientsCard">
      <Card className="max-w-[800px]">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">NextUI</p>
            <p className="text-small text-default-500">nextui.org</p>
          </div>
        </CardHeader>

        <Divider />

        <CardBody>
          {rows.map((row, index) => (
            /* TODO: see if there's a way to do this by passing a mutable reference individual row elements as opposed to spreading around the entire collection of rows */
            <Row 
              theRow={row} 
              index={index} 
              addRow={addRow} 
              deleteRow={deleteRow} 
              areWeAlone={onlyOneRow}
              saveRow={registerPopulatedRow}
            />
          ))}
        </CardBody>

        <Divider />

        <CardFooter>
          <div className="flex flex-wrap gap-4 items-center">
            <Button color="primary" variant="faded">
              Save
            </Button>  
            <Button color="primary" variant="flat">
              Load
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
};


// Row component
const Row = ({ 
  theRow,
  index,
  addRow, 
  deleteRow,
  areWeAlone,
  saveRow,
} : {
  theRow: IngredientSpec,
  index: number,
  addRow: () => void;
  deleteRow: (idToDelete: number) => void;
  theRows: [],
  areWeAlone: boolean,
  saveRow: (rowData: IngredientSpec) => void;
}) => {

  const units_options = ['g', 'cup', 'ounce'].map(u => ({value: u, label: u}));

  //const [added, setAdded] = useState(false);
  
  const [selectedFood, setSelectedFood] = useState<{label: string, value: number} | null>(null);
  const [unit, setUnit] = useState<{value: string, label: string} | null>(null);
  const [massSelection, setMassSelection] = useState(0);

  const resetRow = () => {
    setSelectedFood(null);
    setUnit(null);
    setMassSelection("");

    theRow.food = "";
    theRow.unit = "";
    theRow.amount = 0;
    saveRow(theRow);

  }

  const handleDeleteRow = () => {
    if(areWeAlone) {
      resetRow()
    } else {
      deleteRow(index);
    }
  }

  const handleAddRow = () => {
    addRow()
  }



  const handleMassSelection = (theMassSelection: number) => {
    setMassSelection(theMassSelection);
    theRow.amount = theMassSelection;
    saveRow(theRow);
  }


  return (
    <div>

      <div className="Row" style={{ display: "flex", justifyContent: "left", marginBottom: "8px", gap: "10px",  alignItems: "center"}}>

        {/* Select Food */}
        <div>
          <p>Food Type</p>
          <Selector2
            selectedOption={selectedFood}
            setSelectedOption={setSelectedFood}
          />
          <p>Dev: Selected Option: {selectedFood ? selectedFood.label : 'None'}</p> 
        </div>

        {/* Select Unit */}
        {selectedFood == null ? null : (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", gap: "10px",  alignItems: "center"}}>
            {/* Unit */}
            {/* TODO: in progress
            * Vertically center
            * Add amount text input field
            * Have add only appear once food, unit, and amount are filled in
            * Have add create a new row
            * Have row start off as a button "Add a new food"
            */}
            <div style={{ gap: "10px", alignItems: "center", justifyContent: "center" }}>
              <p>Unit</p>
              <p>{theRow.food}</p>
              <p>{theRow.unit}</p>
              <p>{theRow.amount}</p>
              <p>{theRow.food}</p>
              <p>{theRow.food}</p>
              <Select
                value={unit}
                options={units_options}
                onChange={setUnit}
                menuPosition="fixed"  // Avoid clipping
                placeholder="Unit..."

                styles={{
                  option: (provided) => ({
                    ...provided,
                    color: 'black',
                    backgroundColor: 'white',
                  }),
                }}
              />
              <p>{unit ? unit.label : ""}</p>
            </div>

          </div>
        )}

        {/* Select Mass */}
        {unit == null ? null : (
          <div>
            <p>Amount</p>
            <IntegerInput value={massSelection} onChange={handleMassSelection} />
            <p>{theRow.amount}</p>
          </div>
        )}

      </div>


      <div style={{ display: "flex", justifyContent: "right", marginBottom: "8px", gap: "10px",  alignItems: "center"}}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
            {massSelection == "" ? null : (
              <Button color="primary" variant="shadow" onClick={handleAddRow}>
                add!
              </Button>  
            )}

            <Button color="primary" variant="bordered" onClick={handleDeleteRow}>
              nvm
            </Button>  
          </div>
      </div>

    </div>
  );
};

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

const IntegerInput: React.FC<IntegerInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // Update the temporary input value
  };

  const handleConfirmChange = () => {
    const newValue = Number(inputValue);

    // Validate the input value
    if (newValue >= 1 && newValue <= 50000) {
      onChange(newValue); // Call onChange if it's valid
    } else {
      // Optionally handle invalid input (e.g., reset to the last valid value)
      setInputValue(value.toString());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleConfirmChange(); // Confirm on Enter key press
    }
  };

  return (
    <div>
      <Input
        type="text" // Change to text to allow easier backspacing
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="enter an amount"

      />
    </div>
  );
};


interface IntegerInputProps {
  value: number | ''; 
  onChange: (value: number | '') => void;
};


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
