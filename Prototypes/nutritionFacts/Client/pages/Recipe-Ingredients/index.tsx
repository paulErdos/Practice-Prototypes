// Hero
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Input } from '@heroui/react';

// Third Party
import AsyncSelect from 'react-select/async';



// Local
//import NFLabel from '../NutritionFacts/NFLabel';
import NFLabel from './NFLabel';
import { Food, Recipe, FoodNutrient } from './call';



interface RecipeFood {
  label: string;
  value: string;
  nutrients: FoodNutrient[];
  amount: number; // grams
}

const alterUnit = (unit: string) => {
  const map: { [key: string]: string } = {
    "UG": "µg",
    "MG": "mg",
    "KCAL": "kcal",
    "G": "g",
  }
  return unit in map ? map[unit] : unit;
}

const alterResponseData = (data: any[]): any[] => {
  console.log(data)
  return data.map(food => ({
    ...food,
    nutrients: food.nutrients.map((nutrient: any) => ({
      ...nutrient,
      unitName: alterUnit(nutrient.unitName)
    }))
  }))
}

export default function RecipeNutritionBuilder() {
  const [foods, setFoods] = useState<RecipeFood[]>([]);
  const [responseData, setResponseData] = useState();
  const [recipeName, setRecipeName] = useState('');
  const [savedRecipes, setSavedRecipes] = useState<{ [key: string]: RecipeFood[] }>({});
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const router = useRouter();
  const [blink, setBlink] = useState(false);
  const BLINK_FADE_DURATION = 1500; // ms, change as desired
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load options from USDA API
  const loadOptions = useCallback(async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const url = `http://192.168.0.3:9001/search-test/${encodeURIComponent(inputValue)}`;
      const response = await fetch(url);
      const text = await response.text();
      const data = JSON.parse(text);  // TODO: unaddressed failure mode that occurs ...
      if(data.foods === undefined) {
        return [{error: 'Something broke on our end'}]  // TODO: algo mas
      }
      var processed_data = data.foods.map((item: any) => ({  // TODO: ... here
        label: item.description,
        value: item.description,
        nutrients: item.foodNutrients.map((datum: any) => ({
          nutrientName: datum.nutrientName,
          value: datum.value,
          unitName: datum.unitName,
        })),
      }));
      processed_data = alterResponseData(processed_data)
      setResponseData(processed_data);
      return processed_data;
    } catch (error) {
      console.error('Error fetching FDC options:', error);
      return [];
    }
  }, []);

  // Add a new food to the recipe
  const handleAddFood = (option: any) => {
    if (!option) return;
    setFoods([...foods, { ...option, amount: 100 }]); // default to 100g
  };

  // Update the amount for a food
  const handleAmountChange = (idx: number, newAmount: number) => {
    setFoods(foods.map((f, i) => i === idx ? { ...f, amount: newAmount } : f));
  };

  // Remove a food from the recipe
  const handleRemoveFood = (idx: number) => {
    setFoods(foods.filter((_, i) => i !== idx));
  };

  // Build the Recipe object for nutrition facts
  const recipeObj = new Recipe(
    foods.map(f => new Food({ name: f.label, nutrients: f.nutrients, amount: f.amount }))
  );

  // Load saved recipes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedRecipeFoodsMulti');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setSavedRecipes(parsed);
        }
      } catch (e) {
        // TODO: Explore parse errors
      }
    }
    // Check if a recipe should be loaded from sessionStorage
    const loadName = sessionStorage.getItem('loadRecipeName');
    if (loadName && saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed[loadName]) {
          setFoods(parsed[loadName]);
          setRecipeName(loadName);
          setSelectedRecipe(loadName);
        }
      } catch (e) {}
      sessionStorage.removeItem('loadRecipeName');
    }
  }, []);

  // Save all recipes to localStorage
  const saveAllRecipes = (recipes: { [key: string]: RecipeFood[] }) => {
    localStorage.setItem('savedRecipeFoodsMulti', JSON.stringify(recipes));
  };

  // Save current recipe under a name
  const handleSaveRecipe = () => {
    if (!recipeName) return;
    const newRecipes = { ...savedRecipes, [recipeName]: foods };
    setSavedRecipes(newRecipes);
    saveAllRecipes(newRecipes);
    // Trigger blink/fade on View Saved Recipes button
    setBlink(false); // reset in case it's already animating
    void Promise.resolve().then(() => setBlink(true));
    if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    blinkTimeoutRef.current = setTimeout(() => setBlink(false), BLINK_FADE_DURATION);
    // Dispatch custom event for top nav Recipes button
    window.dispatchEvent(new CustomEvent('blinkRecipesNav', { detail: { duration: BLINK_FADE_DURATION } }));
  };

  // Load a recipe by name
  const handleLoadRecipe = (name: string) => {
    if (!name || !savedRecipes[name]) return;
    setFoods(savedRecipes[name]);
    setSelectedRecipe(name);
    setRecipeName(name);
  };

  // Delete a recipe by name
  const handleDeleteRecipe = (name: string) => {
    if (!name) return;
    const { [name]: _, ...rest } = savedRecipes;
    setSavedRecipes(rest);
    saveAllRecipes(rest);
    if (selectedRecipe === name) {
      setFoods([]);
      setSelectedRecipe('');
      setRecipeName('');
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className="text-3xl font-bold mb-2">Recipe Ingredients</h1>
          <p className="mb-4">A recipe is a collection of ingredients and amounts</p>
        </div>
        <div className="flex flex-row flex space-x-4">
          <div className="mt-8">

            {/* TODO: make this its own component */}
            <Card className="max-w-[700px] w-full">

              <CardHeader>
                <div>
                  TODO: nonexistent when no ingredients are added
                </div>

                <div className="flex flex-row gap-2 mt-2 items-center">
                    <Input
                      type="text"
                      value={recipeName}
                      onChange={e => setRecipeName(e.target.value)}
                      placeholder="Recipe name"
                      className="w-40"
                    />
                    <Button color="primary" onClick={handleSaveRecipe} disabled={!recipeName || foods.length === 0}>
                      Save Recipe
                    </Button>
                  </div>
              </CardHeader>

              <Divider />

              <CardHeader>
                <div className="flex flex-col w-full gap-2">
                  <AsyncSelect
                    cacheOptions={false}
                    loadOptions={loadOptions}
                    defaultOptions={[]}
                    onChange={handleAddFood}
                    placeholder="Search for a food to add..."
                    isClearable
                    menuPosition="fixed"
                    styles={{
                      option: (provided, state) => ({
                        ...provided,
                        color: 'black',
                        backgroundColor: state.isFocused ? 'lightblue' : provided.backgroundColor,
                      }),
                    }}
                  />
                  {/*
                  <div className="flex flex-row gap-2 mt-2 items-center">
                    <Button
                      color="secondary"
                      onClick={() => router.push('/Recipes')}
                      className={blink ? 'blink-fade' : ''}
                      style={blink ? { '--blink-fade-duration': `${BLINK_FADE_DURATION}ms` } as React.CSSProperties : {}}
                    >
                      View Saved Recipes
                    </Button>
                  </div>
                  */}
                </div>
              </CardHeader>

              <Divider />
                            
              <CardBody>
                {foods.length === 0 ? (
                  <div>
                  
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {foods.map((food, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex-1 font-semibold">{food.label}</div>
                        <Input
                          type="number"
                          min={0}
                          max={50000}
                          value={food.amount.toString()}
                          onChange={e => handleAmountChange(idx, Number(e.target.value))}
                          className="w-24"
                          placeholder="grams"
                        />
                        <span>g</span>
                        <Button color="danger" variant="light" onClick={() => handleRemoveFood(idx)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>

            </Card>
          </div>

          {/*                                   vvvvvvv Defined on line 100 */}
          <div className="mt-8">
            <NFLabel item={foods.length > 0 ? recipeObj : null} title={'Nutrition Facts'} />
          </div>


          {/* // Dev: display data
          <div>
            <p>{JSON.stringify(responseData)}</p>
          </div>
          */}
        </div>
      </section>
    </DefaultLayout>
  );
} 
