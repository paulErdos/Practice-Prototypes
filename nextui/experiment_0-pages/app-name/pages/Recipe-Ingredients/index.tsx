import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Select from 'react-select'; 
import {Button} from "@nextui-org/react"
import React, { useState } from 'react';
//import { Card } from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import { Input } from '@nextui-org/react';
import AsyncSelect from 'react-select/async';

const dummy_options = [
  {value: 5, label: 'fif'},
  {value: 'ah plead da fif', label: 'onetwothreefofiiiif'},
  {value: 'real option', label: 'i actually plead the third i refuse to quarter troops in my home'}
]

/*

TODO:
* For secondary rows, "nvm" doesn't show up until food is added. Makes sense for first row? But not others. 
* Have the entire thing covered under a "Create a new Recipe Ingredients" that opens the card
* > Ohhh and that can be reaccassed by pressing 'nvm' on the first card ohhhhhh
* > This will need to be a state variable in rows that pays att
* > No it doesn't need to exist
* Recipe card needs a way to name things.
* And maybe that picture area can be a color theme selector, idk. 
* Save button needs to be able to access the data in each row
* > This means, like, rows or recipecard will need to be the root data storage facility.
* 

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

// Work-In-Progress Recipe Ingredients Card
const RecipeIngredients = () => {
  const [rowsData, setRowsData] = useState([])

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
          <Rows theRows={rowsData}/>
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


const Rows = () => {
  // Initialize with a single Row
  const [rows, setRows] = useState([0]); // Start with one row

  const addRow = () => {
    setRows([...rows, rows.length]); // Add a new row by appending the next index
  };

  const deleteRow = (idToDelete: number) => {
    setRows(rows.filter((index) => index !== idToDelete));
  }

  return (
    <div className="Rows">
      {rows.map((index) => (
        <Row key={index} index={index} addRow={addRow} deleteRow={deleteRow}/>
      ))}
    </div>
  );
};


// Row component
const Row = ({ 
  index, 
  addRow, 
  deleteRow 
}: {
  index: number;
  addRow: () => void;
  deleteRow: () => void;
}) => {
  const [added, setAdded] = useState(false);

  const [selectedFood, setSelectedFood] = useState<{label: string, value: number} | null>(null);

  const [unit, setUnit] = useState<{value: string, label: string} | null>(null);
  const selectUnit = (theUnit: any) => {
    setUnit(theUnit);
  }

  const [massSelection, setMassSelection] = useState("");
  const handleMassSelection = (theMassSelection: string) => {
    console.log(theMassSelection);
    setMassSelection(theMassSelection);
  }

  const resetRow = () => {
    setSelectedFood(null);
    setUnit(null);
    setMassSelection("");
  }

  const units_options = ['g', 'cup', 'ounce'].map(u => ({value: u, label: u}));
  console.log(units_options)

  return (
    <div className="Row" key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", gap: "10px",  alignItems: "center"}}>

      <div>
        <p>Food Type</p>
        <Selector2
          selectedOption={selectedFood}
          setSelectedOption={setSelectedFood}
        />
        <p>Dev: Selected Option: {selectedFood ? selectedFood.label : 'None'}</p> 
      </div>

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

      {unit == null ? null : (
        <div>
          <p>Amount</p>
          <IntegerInput value={massSelection} onChange={handleMassSelection} />
          <p>{massSelection}</p>
        </div>
      )}


      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
        {massSelection == "" ? null : (
          <Button color="primary" variant="shadow" onClick={addRow}>
            add!
          </Button>  
        )}

        {selectedFood == null ? null : (
          <Button color="primary" variant="bordered" onClick={deleteRow}>
            nvm
          </Button>  
        )}
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
    console.log(selection)
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


const ParentComponent = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div>
      <Selector2 selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <p>Selected option: {selectedOption ? selectedOption.label : 'None'}</p>
    </div>
  );
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

//import { useState } from 'react';
//import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Link, Image } from "@nextui-org/react";

const DynamicInfoCardTest0 = () => {
  const [rows, setRows] = useState<number[]>([]);

  const addRow = () => {
    setRows([...rows, Math.floor(Math.random() * 100)]);
  };

  return (
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
        <p>Make beautiful websites regardless of your design experience.</p>
        {rows.map((num, index) => (
          <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <p></p> {/*// For some reason, having this in place center justifies following elements */}
            <DoubleOpenableSelector key={index} /> 
            <Button onClick={addRow} size="sm">Add Row</Button>
          </div>
        ))}
        <Button onClick={addRow}>Add Initial Row</Button>
      </CardBody>

      <Divider />

      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://github.com/nextui-org/nextui"
        >
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
  );
};

function DoubleOpenableSelector() {
  const [toggled, setToggled] = useState<boolean>(true);
  function handleClick() {
    setToggled(!toggled);
    setFoodSelection("");
  }

  const [foodSelection, setFoodSelection] = useState("");
  const handleFoodSelection = (theFoodSelection) => {
    setFoodSelection(theFoodSelection);
  }

  const [massSelection, setMassSelection] = useState(100);
  const handleMassSelection = (theMassSelection) => {
    setMassSelection(theMassSelection);
  }

  const [unit, setUnit] = useState('g');
  const selectUnit = (theUnit) => {
    setUnit(theUnit);
  }

  const [labelTriggerToggled, setlabelTriggerToggled] = useState<boolean>(true);
  const setLabelButton = (theLabel) => {
    setlabelTriggerToggled(theLabel);
  }

  return (
    <div className="px-4 py-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500">
      {toggled ? 
        (
          <div>
            <ToggleButtonWithProps state={toggled} setState={handleClick} />
          </div>
        ) : (
          <div>
            <div className="flex flex-row">

              {/* Exit out as needed */}
              <ToggleButtonWithProps state={toggled} setState={handleClick} />

              {/* Food selection drop down */}
              <Select 
                value={foodSelection}
                onChange={handleFoodSelection}
                options={dummy_options}
                styles={{
                    option: (provided) => ({
                    ...provided,
                    color: 'black',
                    backgroundColor: 'white',
                    }),
                }}
              />
              
              {/* Quantity + Unit to appear when food selection is made */}
              {foodSelection && (
                <div className="flex flex-row">

                  {/* Quantity */}
                  <div className="flex flex-row">
                    <IntegerInput value={massSelection} onChange={handleMassSelection} />
                    <p>{massSelection}</p>
                  </div>

                  {/* Unit */}
                  <div className="flex flex-row">
                    <div className="flex flex-row">
                        <Select
                            value={unit}
                            options={units_options}
                            styles={{
                                option: (provided) => ({
                                ...provided,
                                color: 'black',
                                backgroundColor: 'white',
                                }),
                            }}
                        />
                        <p>{unit}</p>
                    </div>
                  </div>

                  {/* Make API Call */}
                  {/* TODO: Can divs have an onclick? */}
                  {/**/} */
                  <div>
                    {labelTriggerToggled ? (
                      <LabelTriggerToggle
                        state={labelTriggerToggled}
                        setState={setLabelButton}
                        textForSetState={"Set"}
                        textForUnsetState={""}
                      />
                    ) : (
                      <LabelTriggerToggle
                        state={labelTriggerToggled}
                        setState={setLabelButton}
                        textForSetState={""}
                        textForUnsetState={"Unset"}
                      />
                    )}
                  </div>
                  
                  {/**/}
 
                </div>
              )}


            </div>   
          </div>     
        )
      }
    </div>
  );
};





const ToggleButtonWithProps = ({state, setState}) => {
  return (
    <Button color="primary" variant="solid" onClick={setState}>
      {state ? "Add New" : "X"}
    </Button>
  );
};

const LabelTriggerToggle = ({state, setState, textForSetState, textForUnsetState}) => {
  return (
    <Button color="primary" variant="solid" onClick={setState}>
      {state ? textForUnsetState : textForSetState}
    </Button>
  );
};




