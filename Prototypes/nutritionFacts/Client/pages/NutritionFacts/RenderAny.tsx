import { Card, Divider } from "@heroui/react";

interface FoodNutrient {
  nutrientName: string;
  value: number;
  unitName: string;
}

interface RenderAnyProps {
  item: { render: () => FoodNutrient[] };
  title?: string;
}

// Section definitions (hardcoded for now, inspired by nutrients-categorized.json)
const SECTION_ORDER = [
  "Macronutrients",
  "Vitamins",
  "Minerals",
  "Aminos",
  "Fats",
  "Carotenoids",
  "Other"
];

const SECTIONS: Record<string, string[]> = {
  "Macronutrients": [
    "Protein", "Fiber, total dietary", "Total Sugars", "Energy", "Total lipid (fat)", "Carbohydrate, by difference", "Water"
  ],
  "Vitamins": [
    "Vitamin A, IU", "Retinol", "Vitamin A, RAE", "Carotene, beta", "Carotene, alpha", "Vitamin D3 (cholecalciferol)", "Vitamin D (D2 + D3)", "Cryptoxanthin, beta", "Lycopene", "Vitamin C, total ascorbic acid", "Thiamin", "Riboflavin", "Folate, total", "Vitamin B-12", "Vitamin K (phylloquinone)", "Folate, food", "Vitamin B-12, added", "Vitamin E (alpha-tocopherol)", "Vitamin D (D2 + D3), International Units", "Vitamin D2 (ergocalciferol)", "Lutein + zeaxanthin", "Niacin", "Pantothenic acid", "Vitamin B-6", "Choline, total", "Folic acid", "Folate, DFE", "Vitamin E, added"
  ],
  "Minerals": [
    "Iron, Fe", "Magnesium, Mg", "Phosphorus, P", "Sodium, Na", "Copper, Cu", "Manganese, Mn", "Calcium, Ca", "Potassium, K", "Zinc, Zn", "Selenium, Se"
  ],
  "Aminos": [
    // Add amino acids here as needed
  ],
  "Fats": [
    "Fatty acids, total trans", "Fatty acids, total saturated", "Fatty acids, total trans-monoenoic", "Fatty acids, total monounsaturated", "Fatty acids, total polyunsaturated", "Fatty acids, total trans-polyenoic", "SFA 8:0", "SFA 12:0", "SFA 14:0", "PUFA 22:6 n-3 (DHA)", "SFA 22:0", "MUFA 14:1", "MUFA 16:1", "PUFA 20:5 n-3 (EPA)", "PUFA 22:5 n-3 (DPA)", "SFA 17:0", "SFA 24:0", "TFA 16:1 t", "MUFA 24:1 c", "MUFA 18:1 c", "PUFA 18:2 n-6 c,c", "MUFA 22:1 c", "MUFA 17:1", "MUFA 15:1", "PUFA 18:3 n-3 c,c,c (ALA)", "PUFA 20:3 n-3", "PUFA 18:3i", "PUFA 22:4", "SFA 4:0", "SFA 6:0", "SFA 10:0", "SFA 16:0", "SFA 18:0", "SFA 20:0", "MUFA 18:1", "PUFA 18:2", "PUFA 18:3", "PUFA 20:4", "PUFA 18:4", "MUFA 20:1", "MUFA 22:1", "SFA 15:0", "TFA 18:1 t", "TFA 22:1 t", "TFA 18:2 t not further defined", "PUFA 18:2 CLAs", "PUFA 20:2 n-6 c,c", "MUFA 16:1 c", "PUFA 18:3 n-6 c,c,c", "PUFA 20:3", "PUFA 20:3 n-6"
  ],
  "Carotenoids": [
    "Carotene, beta", "Carotene, alpha", "Cryptoxanthin, beta", "Lycopene", "Lutein + zeaxanthin"
  ],
  "Other": [
    "Ash", "Alcohol, ethyl", "Cholesterol", "Caffeine", "Theobromine", "Fructose", "Lactose", "Galactose", "Sucrose", "Glucose", "Maltose"
  ]
};

function RenderAny({ item, title }: RenderAnyProps) {
  const result = item.render();
  const nutrients: FoodNutrient[] = result.nutrients || result;

  // Map of nutrientName to FoodNutrient
  const nutrientMap: Record<string, FoodNutrient> = {};
  for (const n of nutrients) {
    nutrientMap[n.nutrientName] = n;
  }

  // Find all nutrients present
  const allNutrientNames = new Set([
    ...Object.keys(nutrientMap),
    ...Object.values(SECTIONS).flat()
  ]);

  // For each section, collect nutrients (default to 0 if missing)
  const sectioned: Record<string, FoodNutrient[]> = {};
  for (const section of SECTION_ORDER) {
    sectioned[section] = [];
    for (const name of SECTIONS[section] || []) {
      if (nutrientMap[name]) {
        sectioned[section].push(nutrientMap[name]);
      } else {
        // Default missing nutrients to 0
        sectioned[section].push({ nutrientName: name, value: 0, unitName: "" });
      }
    }
  }

  // Any nutrients not in any section go in Other
  const allSectionNutrients = new Set(Object.values(SECTIONS).flat());
  const extraNutrients = nutrients.filter(n => !allSectionNutrients.has(n.nutrientName));
  if (extraNutrients.length > 0) {
    sectioned["Other"] = sectioned["Other"].concat(extraNutrients);
  }

  return (
    <Card
      css={{
        maxWidth: "300px",
        padding: "$10",
        backgroundColor: "white",
        border: "1px solid black",
        borderRadius: "0",
        boxShadow: "none",
      }}
    >
      <div style={{ padding: "16px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "5px",
            fontSize: "28px",
            fontWeight: "900",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {title || "Nutrition Data"}
        </h2>

        <Divider
          css={{
            height: "8px",
            backgroundColor: "black",
            margin: "8px 0",
          }}
        />

        <Divider
          css={{
            height: "4px",
            backgroundColor: "black",
            margin: "8px 0",
          }}
        />

        {SECTION_ORDER.map(section => (
          <div key={section} style={{ marginBottom: "16px" }}>
            <strong style={{ display: "block", fontSize: "16px", marginTop: "16px", marginBottom: "8px" }}>{section}</strong>
            {sectioned[section].map((nutrient, idx) => (
              <div
                key={nutrient.nutrientName + idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  fontSize: "14px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  margin: "4px 0",
                }}
              >
                <div style={{ flex: 1 }}>{nutrient.nutrientName}</div>
                <div style={{ textAlign: "right", minWidth: "60px" }}>
                  {nutrient.value} {nutrient.unitName}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RenderAny; 