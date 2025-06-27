import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
//import Select from 'react-select'; 
import { Button } from "@heroui/react";
//import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@heroui/react";
//import { Input } from '@heroui/react';
import { useState, useCallback } from 'react';
import React from 'react';

import AsyncSelect from 'react-select/async';
import NFLabel from "../Experiments-Warehouse/NFLabel";

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

const alterFoodsDataMap = (data: Record<string, FoodNutrient[]>) => {
  console.log(data)
  return data;
}

// New: Async dropdown for FDC search
import type { FC } from 'react';
import { components as selectComponents } from 'react-select';
import type { SingleValue, OptionProps } from 'react-select';

type FoodOption = { label: string; value: string };
// type FoodNutrient = { nutrientName: string; value: number; unitName: string };
type FoodData = { label: string; value: import('./call').FoodNutrient[] };

