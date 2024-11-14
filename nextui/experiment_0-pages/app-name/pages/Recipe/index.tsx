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

const units_options = ['g', 'cup', 'ounce'].map(u => ({value: u, label: u}));

export default function RecipePage() {
  const [buttonPushed, setButtonPushed] = useState(false);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Pricing</h1>
          <div>I intend to put this in a card: "https://react-select.com/home"</div>
          <div>Note: if recipes can be saved, named, and used as ingredients, meals of recipe servings are trivial</div>
        </div>


        <div className="flex flex-wrap gap-4 items-center">
          <Button color="primary" variant="faded">
            Faded
          </Button>  
          <Button color="primary" variant="bordered">
            Bordered
          </Button>  
          <Button color="primary" variant="flat">
            Flat
          </Button>  
        </div>


        <div>
          <DynamicInfoCardTest0 />
        </div>


        <div>
          <DynamicInfoCardTest1 />
        </div>

        <div>
          <Selector2 />
        </div>

      </section>
    </DefaultLayout>
  );
}

{/* Begin Async Experiment 1 */}
{/*} This allows for selecting newly-added options, but
  > doesn't show the added options when the down arrow is clicked
*/}
const Selector2 = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (selection: any) => {
    setSelectedOption(selection);
  }

  var s2options = [{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }];

  const s2FilterOptions = (inputValue: string) => {
    return s2options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const s2InputChange = (inputValue: string) => {
    console.log('>>>');
    console.log(inputValue);
    // Add a new option to the list
    const newOption = { label: inputValue, value: s2options.length + 1 };
    s2options = [...s2options, newOption];
    console.log(s2options);
    console.log('<<<')
  }

  const s2LoadOptions = (
    inputValue: string,
    callback: (options: {label: string, value: number}[]) => void
  ) => {
    console.log(inputValue);
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



// Row component
const Row = ({ index }) => {
  const [selection, setSelection] = useState("");
  const [selectedOption, setSelectedOption] = useState("");


  return (
    <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", gap: "10px",  alignItems: "center"}}>

      <div>

        <Select
          options={[{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }]} // Replace with your options
          placeholder="Add A Food"
          styles={{
            option: (provided) => ({
              ...provided,
              color: 'black',
              backgroundColor: 'white',
            }),
          }}
          onChange={setSelection}
          menuPosition="fixed"  // Avoid clipping
        />
      </div>
      
      <div>
        {selection == "" ? null : (
            <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
              <Button color="primary" variant="bordered">
                Add
              </Button>  
              <Button color="primary" variant="bordered">
                X
              </Button>  
            </div>
          )
        }
      </div>

    </div>
  );
};


// Rows component
const Rows = () => {
  // Initialize with a single Row
  const [rows, setRows] = useState([0]); // Start with one row

  const addRow = () => {
    setRows([...rows, rows.length]); // Add a new row by appending the next index
  };

  return (
    <div>
      {rows.map((index) => (
        <Row key={index} index={index} />
      ))}
    </div>
  );
};

// Recipe Card Experiment
const DynamicInfoCardTest1 = () => {
  return (
    <div>
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
          <Rows />
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
      <p>IntegerInput</p>
      <Input
        type="text" // Change to text to allow easier backspacing
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter a number between 1 and 50000"
      />
      <Button onClick={handleConfirmChange}>Confirm</Button>
    </div>
  );
};


interface IntegerInputProps {
  value: number | ''; 
  onChange: (value: number | '') => void;
};





