import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Select from 'react-select'; 
import {Button} from "@nextui-org/react"
import React, { useState } from 'react';
import { Card } from "@nextui-org/react";

const dummy_options = [
  {value: 5, label: 'fif'},
  {value: 'ah plead da fif', label: 'onetwothreefofiiiif'},
  {value: 'real option', label: 'i actually plead the third i refuse to quarter troops in my home'}
]

export default function DocsPage() {
  const [buttonPushed, setButtonPushed] = useState(false);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Pricing</h1>
          <div>I intend to put this in a card: "https://react-select.com/home"</div>
          <div>Note: if recipes can be saved, named, and used as ingredients, meals of recipe servings are trivial</div>
        </div>

        <div>
          <Select options={dummy_options} />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Button color="primary" variant="solid">
            Solid
          </Button>
          <Button color="primary" variant="faded">
            Faded
          </Button>  
          <Button color="primary" variant="bordered">
            Bordered
          </Button>  
          <Button color="primary" variant="light">
            Light
          </Button>  
          <Button color="primary" variant="flat">
            Flat
          </Button>  
          <Button color="primary" variant="ghost">
            Ghost
          </Button>  
          <Button color="primary" variant="shadow">
            Shadow
          </Button>  
        </div>

        <div>
          <ToggleButton />
        </div>

      {/*
        <div>
          <ButtonCard />
        </div>
      */}

      </section>
    </DefaultLayout>
  );
}

const ButtonCard: React.FC = () => {
  return (
    <Card>
      <Card.Body>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4">
            <ToggleButton />
            <ToggleButton />
            <ToggleButton />
          </div>
          <div className="flex space-x-4">
            <ToggleButton />
            <ToggleButton />
            <ToggleButton />
          </div>
          <div className="flex space-x-4">
            <ToggleButton />
            <ToggleButton />
            <ToggleButton />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const ToggleButton: React.FC = () => {
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const handleClick = () => {
    setIsToggled(!isToggled);
  };

  return (
    <Button color="primary" variant="solid" onClick={handleClick}>
      {isToggled ? "On" : "Off"}
    </Button>
  );
};