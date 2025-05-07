import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';
import AsyncSelect from 'react-select/async';
import RenderAny from '../NutritionFacts/RenderAny';
import { Food, Recipe, FoodNutrient } from '../usda-fdc-search/call';
import { Button, Card, CardBody, CardHeader, Divider, Input } from '@heroui/react';

interface RecipeFood {
  label: string;
  value: string;
  nutrients: FoodNutrient[];
  amount: number; // grams
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
      const data = JSON.parse(text);
      const processed_data = data.foods.map((item: any) => ({
        label: item.description,
        value: item.description,
        nutrients: item.foodNutrients.map((datum: any) => ({
          nutrientName: datum.nutrientName,
          value: datum.value,
          unitName: datum.unitName,
        })),
      }));
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
        // Ignore parse errors
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
          <h1 className="text-3xl font-bold mb-2">Recipe Nutrition Facts Builder</h1>
          <p className="mb-4">Build a recipe by adding foods and specifying the amount (in grams) for each. The nutrition facts label below will update automatically.</p>
        </div>
        <div className="flex flex-row">
          <div className="mt-8">
            <Card className="max-w-[700px] w-full">
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
                  <div className="flex flex-row gap-2 mt-2 items-center">
                    <Button
                      color="secondary"
                      onClick={() => router.push('/Recipe-Nutrition-Builder/SavedRecipes')}
                      className={blink ? 'blink-fade' : ''}
                      style={blink ? { '--blink-fade-duration': `${BLINK_FADE_DURATION}ms` } as React.CSSProperties : {}}
                    >
                      View Saved Recipes
                    </Button>
                  </div>
                  <Button color="secondary" className="mt-2 w-fit" onClick={() => { setFoods([]); setRecipeName(''); setSelectedRecipe(''); }} disabled={foods.length === 0}>
                    Clear Current
                  </Button>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                {foods.length === 0 ? (
                  <div className="text-center text-gray-500">No foods added yet.</div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {foods.map((food, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="flex-1 font-semibold">{food.label}</div>
                        <Input
                          type="number"
                          min={1}
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
          <div className="mt-8">
            <RenderAny item={foods.length > 0 ? recipeObj : null} title={foods.length > 0 ? 'Recipe Nutrition Facts' : 'No recipe yet'} />
          </div>
          <div>
            <p>{JSON.stringify(responseData)}</p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
} 