import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Select from 'react-select'; 
import {Button} from "@nextui-org/react"
import React, { useState } from 'react';
//import { Card } from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";


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

        <div>
          <ItemCard />
        </div>

      {/*
        <div>
          <ButtonCard />
        </div>
      */}

        <div>
          <DoubleButton />
        </div>

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

const ItemCard: React.FC = () => {
  return (
    <Card className="max-w-[400px]">
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
      <Divider/>
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
      <Divider/>
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
}

const ToggleButton: React.FC = () => {
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const handleClick = () => {
    setIsToggled(!isToggled);
  };

  return (
    <Button color="primary" variant="solid" onClick={handleClick}>
      {isToggled ? "Add New" : "X"}
    </Button>
  );
};

const ToggleButtonWithProps = ({state, setState}) => {
  return (
    <Button color="primary" variant="solid" onClick={setState}>
      {state ? "Add New" : "X"}
    </Button>
  );
};

function DoubleButton() {
  const [toggled, setToggled] = useState<boolean>(true);

  function handleClick() {
    console.log('handling click')
    console.log('toggle is')
    console.log(toggled)
    setToggled(!toggled);
    console.log('and now it is')
    console.log(toggled)
  };


  return (
    <div> {/* onClick={setToggled}> */}
      {toggled ? 
        (
          <div>{/* onClick={setToggled}>*/}
            <ToggleButtonWithProps state={toggled} setState={handleClick} />
          </div>
        ) : (
          <div>{/*onClick={setToggled}>*/}
            <div>
              <ToggleButtonWithProps state={toggled} setState={handleClick} />
              <ToggleButtonWithProps state={toggled} setState={handleClick} />
            </div>   
          </div>     
        )
      }
    </div>
  );
}





