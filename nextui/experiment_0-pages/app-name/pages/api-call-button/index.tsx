import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Select from 'react-select'; 
import { Button } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { Input } from '@nextui-org/react';
import { useState } from 'react';

export default function DocsPage() {
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
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>API Call Button</h1>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Button color="primary" variant="solid" onClick={handleButtonClick}>
            Fetch Random Number
          </Button>

          {firstNumber && <p>{firstNumber}</p>}
        </div>
      </section>
    </DefaultLayout>
  );
}