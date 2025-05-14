import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
//import Select from 'react-select'; 
import { Button } from "@heroui/react";
//import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@heroui/react";
//import { Input } from '@heroui/react';
import { useState, useCallback } from 'react';
import React from 'react';

import AsyncSelect from 'react-select/async';
import RenderAny from "../NutritionFacts/RenderAny";

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

// Abstract Data Type: Food
export type FoodNutrient = { nutrientName: string; value: number; unitName: string };

export class Food {
  name: string;
  amount: number; // in grams
  nutrients: FoodNutrient[];
  rda: number = 0

  constructor({ name, nutrients, amount = 100 }: {
    name: string,
    nutrients: FoodNutrient[],
    amount?: number
  }) {
    this.name = name;
    this.nutrients = nutrients;
    this.amount = amount;
  }

  // Returns the scaled nutrients for the given amount in grams
  render(amountInGrams?: number): FoodNutrient[] {
    const amt = amountInGrams === undefined ? this.amount : amountInGrams;
    const scale = amt / 100;
    return this.nutrients.map(n => ({
      nutrientName: n.nutrientName,
      value: n.value * scale,
      unitName: n.unitName
    }));
  }
}

// New: Recipe class
export class Recipe {
  foods: Food[];

  constructor(foods: Food[]) {
    this.foods = foods;
  }

  // Sums the nutrients from all foods in the recipe
  render() {
    const nutrientMap: Record<string, {nutrientName: string, value: number, unitName: string}> = {};
    for (const food of this.foods) {
      const rendered = food.render();
      for (const n of rendered) {
        if (!nutrientMap[n.nutrientName]) {
          nutrientMap[n.nutrientName] = { ...n };
        } else {
          nutrientMap[n.nutrientName].value += n.value;
        }
      }
    }
    return Object.values(nutrientMap);
  }
}



// New: Async dropdown for FDC search
import type { FC } from 'react';
import { components as selectComponents } from 'react-select';
import type { SingleValue, OptionProps } from 'react-select';

type FoodOption = { label: string; value: string };
// type FoodNutrient = { nutrientName: string; value: number; unitName: string };
type FoodData = { label: string; value: import('./call').FoodNutrient[] };

export const FdcAsyncDropdown: FC = () => {
  const [selectedOption, setSelectedOption] = useState<SingleValue<FoodOption>>(null);
  const [highlightedOption, setHighlightedOption] = useState<SingleValue<FoodOption>>(null);
  const [foodsDataMap, setFoodsDataMap] = useState<Record<string, FoodNutrient[]>>({});
  const [selectedFoodNutrients, setSelectedFoodNutrients] = useState<FoodNutrient[] | null>(null);
  const [highlightedFoodNutrients, setHighlightedFoodNutrients] = useState<FoodNutrient[] | null>(null);

  // Fetch options from API as user types
  const loadOptions = useCallback(async (inputValue: string): Promise<FoodOption[]> => {
    if (!inputValue) return [];
    try {
      const url = `http://192.168.0.3:9001/search-test/${encodeURIComponent(inputValue)}`;
      const response = await fetch(url);
      const text = await response.text();
      const data = JSON.parse(text);
      const options: FoodOption[] = [];
      const foodsMap: Record<string, FoodNutrient[]> = {};
      for (const item of data.foods) {
        const nutrients: FoodNutrient[] = item.foodNutrients.map((datum: any) => ({
          nutrientName: datum.nutrientName,
          value: datum.value,
          unitName: datum.unitName,
        }));
        options.push({ label: item.description, value: item.description });
        foodsMap[item.description] = nutrients;
      }
      setFoodsDataMap(foodsMap);
      return options;
    } catch (error) {
      console.error('Error fetching FDC options:', error);
      return [];
    }
  }, []);

  // When an option is selected, show its nutrients
  const handleChange = (option: SingleValue<FoodOption>) => {
    setSelectedOption(option);
    setHighlightedOption(null); // Clear highlight on select
    if (option && foodsDataMap[option.label]) {
      setSelectedFoodNutrients(foodsDataMap[option.label]);
    } else {
      setSelectedFoodNutrients(null);
    }
  };

  // When an option is highlighted, show its nutrients
  const handleHighlight = (option: FoodOption | null) => {
    if (option) {
      setHighlightedOption(option);
      if (foodsDataMap[option.label]) {
        setHighlightedFoodNutrients(foodsDataMap[option.label]);
      } else {
        setHighlightedFoodNutrients(null);
      }
    } else {
      setHighlightedOption(null);
      setHighlightedFoodNutrients(null);
    }
  };

  // Custom Option component for react-select
  const CustomOption = (props: OptionProps<FoodOption, false>) => {
    const { isFocused, data } = props;
    // Only call handleHighlight when focus changes to true
    React.useEffect(() => {
      if (isFocused) {
        handleHighlight(data);
      }
    }, [isFocused, data]);
    return <selectComponents.Option {...props} />;
  };

  // Decide which nutrients to show: highlighted or selected
  const nutrientsToShow = highlightedFoodNutrients || selectedFoodNutrients;
  const optionToShow = highlightedOption || selectedOption;

  return (
    <div className="flex flex-row gap-4 items-start">
      <div style={{ width: 250 }} >
        <AsyncSelect
          cacheOptions={false}
          loadOptions={loadOptions}
          defaultOptions={[]}
          onChange={handleChange}
          value={selectedOption}
          placeholder="Search for a food..."
          styles={{
            option: (provided, state) => ({
              ...provided,
              color: 'black',
              backgroundColor: state.isFocused ? 'lightblue' : provided.backgroundColor,
              width: "300px"
            }),
          }}
          menuPosition="fixed"
          isClearable
          components={{ Option: CustomOption }}
        />
      </div>
      {/* Render RenderAny for the highlighted or selected food */}
      
      {optionToShow ? (
        <RenderAny item={new Food({ name: optionToShow.label, nutrients: nutrientsToShow || [] })} title={optionToShow.label} />
      ) : (
        <RenderAny item={null} title={"No food selected"} />
      )}

    </div>
  );
};