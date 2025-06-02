import { Card, Divider, Button, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { SECTION_ORDER, SECTIONS } from "./NFLabelData"
//import nutrient_envelope from '../../data/Combined-RDA-TUI.json';
import nutrient_envelope from '../../data/Clean-RDA-TUI-Data.json';
interface FoodNutrient {
  nutrientName: string;
  value: number;
  unitName: string;
}

interface NFLabelProps {
  item: { render: () => FoodNutrient[] } | null;
  title?: string;
}

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
  
  const values = nutrient_envelope[lifeStageGroup]?.[nutrient.nutrientName];
  if (!values) return "ND";
  
  const percentage = (nutrient.value / values.rda) * 100;
  return `${percentage.toFixed(0)}%`;
}

// Helper function to calculate percentage of limit
function calculateLimit(nutrient: FoodNutrient, lifeStageGroup: string): string {
  console.log(nutrient.nutrientName)
  if (!nutrient) return "ND";
  
  const values = (nutrient_envelope as NutrientDatabase)[lifeStageGroup]?.[nutrient.nutrientName];
  if (!values) return "ND";
                                            // Tolerable Upper Intake
  const percentage = (nutrient.value / values.tui) * 100;
  return `${percentage.toFixed(0)}%`;
}

const LIFE_STAGE_GROUPS = Object.keys(nutrient_envelope)

function NFLabel({ item, title }: NFLabelProps) {
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

export default NFLabel; 
