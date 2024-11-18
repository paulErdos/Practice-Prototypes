import { Card, CardBody } from '@nextui-org/react';
import rawNutrients from "./nutrients.json";

const nutrients = rawNutrients.foodNutrients.reduce((acc, nutrient) => {
    console.log(acc)
    acc[nutrient.nutrientName] = nutrient;// {value: nutrient.nutrientName, unit: nutrient.unitName};
    return acc;
}, {});

console.log(nutrients);

const NutritionLabel = () => {
  return (
    <Card isHoverable>
      <CardBody>
        {Object.keys(nutrients).map((key) => (
          <div key={key} style={{ marginBottom: '10px' }}>
            <p>{nutrients[key].nutrientName}</p>
            <p>{nutrients[key].unitName}</p>
            <p>{nutrients[key].value}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default NutritionLabel;