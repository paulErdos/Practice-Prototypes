import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<{ [key: string]: any[] }>({});
  const router = useRouter();

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
  }, []);

  const handleLoadRecipe = (name: string) => {
    // Store the selected recipe name in sessionStorage for the builder to pick up
    sessionStorage.setItem('loadRecipeName', name);
    router.push('/Recipe-Nutrition-Builder');
  };

  const handleDeleteRecipe = (name: string) => {
    const { [name]: _, ...rest } = savedRecipes;
    setSavedRecipes(rest);
    localStorage.setItem('savedRecipeFoodsMulti', JSON.stringify(rest));
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center py-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <h2 className="text-xl font-bold">Saved Recipes</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2">
              {Object.keys(savedRecipes).length === 0 ? (
                <div className="text-gray-500">No saved recipes.</div>
              ) : (
                Object.keys(savedRecipes).map(name => (
                  <div key={name} className="flex flex-row items-center gap-2">
                    <Button color="primary" onClick={() => handleLoadRecipe(name)}>{name}</Button>
                    <Button color="danger" variant="light" onClick={() => handleDeleteRecipe(name)}>Delete</Button>
                  </div>
                ))
              )}
            </div>
            <Button className="mt-4" onClick={() => router.push('/Recipe-Nutrition-Builder')}>Back to Builder</Button>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
} 