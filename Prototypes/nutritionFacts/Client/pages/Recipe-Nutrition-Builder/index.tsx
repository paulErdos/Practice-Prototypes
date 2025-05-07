import { useState, useCallback } from 'react';
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