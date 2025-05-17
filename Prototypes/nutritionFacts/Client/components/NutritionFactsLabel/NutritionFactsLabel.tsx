import { Card, Divider } from "@heroui/react";

interface FoodNutrient {
  nutrientName: string;
  value: number;
  unitName: string;
}

interface RenderAnyProps {
  item: { render: () => FoodNutrient[] } | null;
  title?: string;
}

// Section definitions (hardcoded for now, inspired by nutrients-categorized.json)
const SECTION_ORDER = [
  "Macronutrients",
  "Vitamins",
  "Minerals",
  "Aminos",
  "Sugars",
  "Fats",
  "Vitamin A",
  "Vitamin D",
  "Vitamin E",
  "Vitamin K",
  "Sterols",
  "Uncategorized",
  "Other"
];

const SECTIONS: Record<string, string[]> = {
  "Macronutrients": [
    "Energy", 
    "Protein", 
    "Total lipid (fat)", 
    "Carbohydrate, by difference",  // TODO: break this down by starch, sugar, and insoluble fiber
    "Fiber, total dietary", 
    "Total Sugars", 
  ],

  "Vitamins": [
    "Vitamin A, IU", 
    "Thiamin", 
    "Riboflavin", 
    "Folate, total", 
    "Niacin", 
    "Pantothenic acid", 
    "Vitamin B-6", 
    "Vitamin B-12", 
    "Vitamin C, total ascorbic acid", 
    "Vitamin D (D2 + D3)", 
    "Vitamin E (alpha-tocopherol)", 
    "Vitamin K (phylloquinone)", 
  ],

  "Minerals": [
    "Calcium, Ca",
    "Copper, Cu",
    "Iron, Fe",
    "Magnesium, Mg",
    "Manganese, Mn",
    "Phosphorus, P",
    "Potassium, K",
    "Selenium, Se",
    "Sodium, Na",
    "Zinc, Zn",
  ],

  "Aminos": [
    "Alanine",
    "Arginine",
    "Aspartic acid",
    "Cystine",
    "Glutamic acid",
    "Glycine",
    "Histidine",
    "Isoleucine",
    "Leucine",
    "Lysine",
    "Methionine",
    "Phenylalanine",
    "Proline",
    "Serine",
    "Threonine",
    "Tryptophan",
    "Tyrosine",
    "Valine",
  ],

  "Sugars": [
    "Total Sugars", 
    "Glucose",  
    "Sucrose", 
    "Fructose", 
    "Lactose", 
    "Galactose",
    "Maltose", 
  ],

  "Fats": [
    "Fatty acids, total saturated", 
    "Fatty acids, total monounsaturated", 
    "Fatty acids, total polyunsaturated", 
    "Fatty acids, total trans", 

    "PUFA 18:3 n-3 c,c,c (ALA)", 
    "PUFA 20:5 n-3 (EPA)", 
    "PUFA 22:6 n-3 (DHA)", 
    "PUFA 22:5 n-3 (DPA)", 

    "Fatty acids, total trans-monoenoic", 
    "Fatty acids, total trans-polyenoic", 

    "TFA 16:1 t", 
    "TFA 18:1 t", 
    "TFA 18:2 t,t",
    "TFA 18:2 t not further defined", 
    "TFA 22:1 t", 

    "SFA 4:0",
    "SFA 6:0",
    "SFA 8:0",
    "SFA 10:0",
    "SFA 12:0",
    "SFA 13:0",
    "SFA 14:0",
    "SFA 15:0",
    "SFA 16:0",
    "SFA 17:0",
    "SFA 18:0",
    "SFA 20:0",
    "SFA 22:0",
    "SFA 24:0",

    "MUFA 14:1", 
    "MUFA 15:1", 
    "MUFA 16:1", 
    "MUFA 17:1", 
    "MUFA 18:1", 
    "MUFA 20:1", 
    "MUFA 22:1",

    // TODO: research notation
    "MUFA 16:1 c", 
    "MUFA 18:1 c", 
    "MUFA 22:1 c", 
    "MUFA 24:1 c", 

    "PUFA 18:2 n-6 c,c", 
    "PUFA 18:2", 
    "PUFA 18:3", 
    "PUFA 20:4", 
    "PUFA 18:4", 
    "PUFA 18:2 CLAs",  
    "PUFA 18:3i",
    "PUFA 18:3 n-6 c,c,c", 
    "PUFA 20:2 n-6 c,c", 
    "PUFA 20:3", 
    "PUFA 20:3 n-6",
    "PUFA 20:3 n-3", 
    "PUFA 20:4 n-6",
    "PUFA 21:5",  
    "PUFA 22:4",     
  ],

  "Vitamin A": [
    "Carotene, beta", 
    "Carotene, alpha", 
    "Cryptoxanthin, beta",
    "Cryptoxanthin, beta",
    "Lutein + zeaxanthin",
    "Lutein + zeaxanthin",
    "Lycopene",
    "Lycopene",
    "Vitamin A, RAE",
    "Retinol",
  ],
  
  // TODO: add other, also for A, K
  "Vitamin D": [
    "Vitamin D (D2 + D3)", 
    "Vitamin D3 (cholecalciferol)", 
    "Vitamin D2 (ergocalciferol)", 
    "Vitamin D (D2 + D3), International Units", 
  ],

  "Vitamin E": [
    "Vitamin E (alpha-tocopherol)", 
    "Tocopherol, beta",
    "Tocopherol, gamma",
    "Tocotrienol, alpha",
    "Tocotrienol, beta",
    "Tocopherol, delta",
    "Tocotrienol, gamma",
    "Tocotrienol, delta",
    "Vitamin E, added",  
  ],
  
  // TODO: add other, also for A, K
  "Vitamin K": [
    "Vitamin K (Dihydrophylloquinone)",
    "Vitamin K (Menaquinone-4)",  
    "Vitamin K (phylloquinone)", 
  ],

  "Sterols": [
    "Phytosterols",
    "Cholesterol", 
    "Stigmasterol",
    "Campesterol",
    "Beta-sitosterol",
  ],
  
  "Uncategorized": [
    "Starch",
    "Vitamin B-12, added", 
    "Folate, food", 
    "Folic acid", 
    "Folate, DFE",  
    "Alcohol, ethyl", 
    "Caffeine", 
    "Theobromine", 
    "Ash", 
    "Choline, total", 
    "Betaine",
    "Hydroxyproline", 
    "Water",
  ],

  "Other": [
  ]
};


function RenderAny({ item, title }: RenderAnyProps) {
  
  // If item or item.render is missing, or item.render() returns null/undefined, use zeroes for all nutrients
  let result: FoodNutrient[] = [];
  try {
    if (item && typeof item.render === 'function') {
      const rendered = item.render();
      if (rendered && Array.isArray(rendered)) {
        result = rendered;
      } else if (rendered && typeof rendered === 'object' && 'nutrients' in rendered && Array.isArray((rendered as any).nutrients)) {
        result = (rendered as any).nutrients;
      }
    }
  } catch (e) {
    // fallback to empty
    result = [];
  }

  // If result is null/undefined or empty, fill with zeroes for all nutrients in all sections
  let nutrients: FoodNutrient[];
  if (!result || result.length === 0) {
    // Fill with zeroes for all nutrients in all sections
    nutrients = Object.values(SECTIONS).flat().map(name => ({
      nutrientName: name,
      value: 0,
      unitName: ""
    }));
  } else {
    nutrients = result;
  }

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
    <div
      style={{
        maxWidth: "400px",
        minWidth: "400px",
        width: "400px",
        padding: "$10",
        border: "1px solid black",
        borderRadius: "0",
        boxShadow: "none",
      }}
    >
      <Card>
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

          {/*
          <Divider
            css={{
              height: "8px",
              backgroundColor: "black",
              margin: "8px 0",
            }}
          />

          <Divider />

          */}
          
          
          <Divider
            style={{
              height: "4px",
              margin: "8px 0",
              /*backgroundColor: "black",
            */}}
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
    </div>
  );
}

export default RenderAny; 
