import { Card, Divider, Button, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

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

// Import path for UL data - to be updated when real data is available
const LIMIT_DATA_PATH = './nutrient-limits.json';  // This will be replaced with the real path

// RDAs for nutrients (in their respective units)
const NUTRIENT_RDAS: Record<string, number> = {
  // Vitamins
  "Vitamin A, IU": 5000, // IU
  "Vitamin A, RAE": 900, // µg
  "Vitamin C, total ascorbic acid": 90, // mg
  "Vitamin D (D2 + D3)": 20, // µg
  "Vitamin D (D2 + D3), International Units": 800, // IU
  "Vitamin E (alpha-tocopherol)": 15, // mg
  "Vitamin K (phylloquinone)": 120, // µg
  "Thiamin": 1.2, // mg
  "Riboflavin": 1.3, // mg
  "Niacin": 16, // mg
  "Vitamin B-6": 1.7, // mg
  "Folate, total": 400, // µg
  "Vitamin B-12": 2.4, // µg
  "Pantothenic acid": 5, // mg

  // Macronutrients
  "Protein": 50, // g
  "Total lipid (fat)": 65, // g
  "Carbohydrate, by difference": 300, // g
  "Fiber, total dietary": 28, // g

  // Minerals
  "Calcium, Ca": 1300, // mg
  "Copper, Cu": 0.9, // mg
  "Iron, Fe": 18, // mg
  "Magnesium, Mg": 420, // mg
  "Manganese, Mn": 2.3, // mg
  "Phosphorus, P": 1250, // mg
  "Potassium, K": 4700, // mg
  "Selenium, Se": 55, // µg
  "Sodium, Na": 2300, // mg
  "Zinc, Zn": 11, // mg
};

// Temporary ULs (using RDAs as placeholders until real data is available)
const NUTRIENT_LIMITS: Record<string, number> = {
  // Vitamins
  "Vitamin A, IU": 5000, // IU
  "Vitamin A, RAE": 900, // µg
  "Vitamin C, total ascorbic acid": 90, // mg
  "Vitamin D (D2 + D3)": 20, // µg
  "Vitamin D (D2 + D3), International Units": 800, // IU
  "Vitamin E (alpha-tocopherol)": 15, // mg
  "Vitamin K (phylloquinone)": 120, // µg
  "Thiamin": 1.2, // mg
  "Riboflavin": 1.3, // mg
  "Niacin": 16, // mg
  "Vitamin B-6": 1.7, // mg
  "Folate, total": 400, // µg
  "Vitamin B-12": 2.4, // µg
  "Pantothenic acid": 5, // mg

  // Macronutrients
  "Protein": 50, // g
  "Total lipid (fat)": 65, // g
  "Carbohydrate, by difference": 300, // g
  "Fiber, total dietary": 28, // g

  // Minerals
  "Calcium, Ca": 1300, // mg
  "Copper, Cu": 0.9, // mg
  "Iron, Fe": 18, // mg
  "Magnesium, Mg": 420, // mg
  "Manganese, Mn": 2.3, // mg
  "Phosphorus, P": 1250, // mg
  "Potassium, K": 4700, // mg
  "Selenium, Se": 55, // µg
  "Sodium, Na": 2300, // mg
  "Zinc, Zn": 11, // mg
};

// Structure for Life-Stage Group specific values
interface NutrientValues {
  rda: number;
  limit: number;
}

// Type for the complete nutrient database
type NutrientDatabase = Record<string, Record<string, NutrientValues>>;

// Temporary database structure (to be replaced with real data)
const NUTRIENT_DATABASE: NutrientDatabase = {
  "Females 19-30 years": {
    // Vitamins
    "Vitamin A, IU": { rda: 5000, limit: 5000 },
    "Vitamin A, RAE": { rda: 900, limit: 900 },
    "Vitamin C, total ascorbic acid": { rda: 90, limit: 90 },
    "Vitamin D (D2 + D3)": { rda: 20, limit: 20 },
    "Vitamin D (D2 + D3), International Units": { rda: 800, limit: 800 },
    "Vitamin E (alpha-tocopherol)": { rda: 15, limit: 15 },
    "Vitamin K (phylloquinone)": { rda: 120, limit: 120 },
    "Thiamin": { rda: 1.2, limit: 1.2 },
    "Riboflavin": { rda: 1.3, limit: 1.3 },
    "Niacin": { rda: 16, limit: 16 },
    "Vitamin B-6": { rda: 1.7, limit: 1.7 },
    "Folate, total": { rda: 400, limit: 400 },
    "Vitamin B-12": { rda: 2.4, limit: 2.4 },
    "Pantothenic acid": { rda: 5, limit: 5 },

    // Macronutrients
    "Protein": { rda: 50, limit: 50 },
    "Total lipid (fat)": { rda: 65, limit: 65 },
    "Carbohydrate, by difference": { rda: 300, limit: 300 },
    "Fiber, total dietary": { rda: 28, limit: 28 },

    // Minerals
    "Calcium, Ca": { rda: 1300, limit: 1300 },
    "Copper, Cu": { rda: 0.9, limit: 0.9 },
    "Iron, Fe": { rda: 18, limit: 18 },
    "Magnesium, Mg": { rda: 420, limit: 420 },
    "Manganese, Mn": { rda: 2.3, limit: 2.3 },
    "Phosphorus, P": { rda: 1250, limit: 1250 },
    "Potassium, K": { rda: 4700, limit: 4700 },
    "Selenium, Se": { rda: 55, limit: 55 },
    "Sodium, Na": { rda: 2300, limit: 2300 },
    "Zinc, Zn": { rda: 11, limit: 11 },
  },
  // Add other life stage groups here with their specific values
};

// Helper function to calculate percentage of RDA
function calculateRDA(nutrient: FoodNutrient | undefined, lifeStageGroup: string): string {
  if (!nutrient) return "ND";
  
  const values = NUTRIENT_DATABASE[lifeStageGroup]?.[nutrient.nutrientName];
  if (!values) return "ND";
  
  const percentage = (nutrient.value / values.rda) * 100;
  return `${percentage.toFixed(0)}%`;
}

// Helper function to calculate percentage of limit
function calculateLimit(nutrient: FoodNutrient | undefined, lifeStageGroup: string): string {
  if (!nutrient) return "ND";
  
  const values = NUTRIENT_DATABASE[lifeStageGroup]?.[nutrient.nutrientName];
  if (!values) return "ND";
  
  const percentage = (nutrient.value / values.limit) * 100;
  return `${percentage.toFixed(0)}%`;
}

// Life-Stage Group options
const LIFE_STAGE_GROUPS = [
  "Infants 0-6 months",
  "Infants 7-12 months",
  "Children 1-3 years",
  "Children 4-8 years",
  "Children 9-13 years",
  "Males 14-18 years",
  "Females 14-18 years",
  "Males 19-30 years",
  "Females 19-30 years",
  "Males 31-50 years",
  "Females 31-50 years",
  "Males 51-70 years",
  "Females 51-70 years",
  "Males >70 years",
  "Females >70 years",
  "Pregnancy 14-18 years",
  "Pregnancy 19-30 years",
  "Pregnancy 31-50 years",
  "Lactation 14-18 years",
  "Lactation 19-30 years",
  "Lactation 31-50 years"
];

function RenderAny({ item, title }: RenderAnyProps) {
  const [showLifeStage, setShowLifeStage] = useState(false);
  const [selectedLifeStage, setSelectedLifeStage] = useState("Females 19-30 years");

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
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
            <Button
              size="sm"
              color="primary"
              variant="light"
              onClick={() => setShowLifeStage(!showLifeStage)}
            >
              {showLifeStage ? "Less Specific" : "More Specific"}
            </Button>
          </div>

          {showLifeStage && (
            <div style={{ marginBottom: "16px" }}>
              <Select
                label="Life-Stage Group"
                selectedKeys={[selectedLifeStage]}
                onSelectionChange={(keys) => setSelectedLifeStage(Array.from(keys)[0] as string)}
                style={{ width: "100%" }}
              >
                {LIFE_STAGE_GROUPS.map((group) => (
                  <SelectItem key={group}>
                    {group}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}

          <Divider
            style={{
              height: "4px",
              margin: "8px 0",
            }}
          />

          {/* Column headers */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              fontSize: "14px",
              fontFamily: "Helvetica, Arial, sans-serif",
              margin: "4px 0",
              fontWeight: "bold",
              borderBottom: "1px solid black",
              paddingBottom: "4px",
            }}
          >
            <div style={{ flex: 1 }}>Nutrient</div>
            <div style={{ textAlign: "right", minWidth: "60px" }}>Amount</div>
            <div style={{ textAlign: "right", minWidth: "60px" }}>RDA</div>
            <div style={{ textAlign: "right", minWidth: "60px" }}>Limit</div>
          </div>

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
                  <div style={{ textAlign: "right", minWidth: "60px" }}>
                    {calculateRDA(nutrient, selectedLifeStage)}
                  </div>
                  <div style={{ textAlign: "right", minWidth: "60px" }}>
                    {calculateLimit(nutrient, selectedLifeStage)}
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
