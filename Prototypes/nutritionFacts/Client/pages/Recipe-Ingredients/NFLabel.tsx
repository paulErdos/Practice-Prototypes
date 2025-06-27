import { Card, Divider, Button, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { SECTION_ORDER, SECTIONS } from "./NFLabelData"
import nutrient_envelope from '../../data/RDA-TUI-Data.json';


const LIFE_STAGE_GROUPS = Object.keys(nutrient_envelope)

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
  tui: number;
}
// Type for the complete nutrient database
type NutrientDatabase = Record<string, Record<string, NutrientValues>>;


// Helper function to calculate percentage of RDA
function calculateRDA(nutrient: FoodNutrient | undefined, lifeStageGroup: string): string {
  if (!nutrient) return "ND";
  if (nutrient.value === 0) return "0%";
    
  const values = nutrient_envelope[lifeStageGroup]?.[nutrient.nutrientName];
  if (!values || values.rda === "ND" || values.tui === "ND") return "ND";

  // TODO: Some of the raw data values have footnote letters, and need to be cleaned out
  if (typeof values.rda !== 'number' || typeof values.tui !== 'number') return "ND";
  
  const percentage = (nutrient.value / values.rda) * 100;
  return `${percentage.toFixed(0)}%`;
}

// Helper function to calculate percentage of limit
function calculateLimit(nutrient: FoodNutrient | undefined, lifeStageGroup: string): string {
  if (!nutrient) return "ND";
  if (nutrient.value === 0) return "0%";
  
  const values = nutrient_envelope[lifeStageGroup]?.[nutrient.nutrientName];

  if (!values || values.rda === "ND" || values.tui === "ND") return "ND";

  // TODO: Some of the raw data values have footnote letters, and need to be cleaned out
  if (typeof values.rda !== 'number' || typeof values.tui !== 'number') return "ND";
  
  const percentage = (nutrient.value / values.tui) * 100;
  return `${percentage.toFixed(0)}%`;
}


function NFLabel({ item, title }: NFLabelProps) {
  const [showLifeStage, setShowLifeStage] = useState(false);
  const [selectedLifeStage, setSelectedLifeStage] = useState("Females 19–30 y");

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
              gap: "8px",
              fontSize: "14px",
              fontFamily: "Helvetica, Arial, sans-serif",
              margin: "4px 0",
              fontWeight: "bold",
              borderBottom: "1px solid black",
              paddingBottom: "4px",
            }}
          >
            <div style={{ flex: 1 }}>Nutrient</div>
            <div style={{ textAlign: "right", width: "80px" }}>Amount</div>
            <div style={{ textAlign: "right", width: "60px" }}>RDA</div>
            <div style={{ textAlign: "right", width: "60px" }}>Limit</div>
          </div>

          {/* Everything Happens Here */}
          {SECTION_ORDER.map(section => (
            <div key={section} style={{ marginBottom: "16px" }}>
              <strong style={{ display: "block", fontSize: "16px", marginTop: "16px", marginBottom: "8px" }}>{section}</strong>
              {sectioned[section].map((nutrient, idx) => (
                <div
                  key={nutrient.nutrientName + idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                    fontSize: "14px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    margin: "4px 0",
                  }}
                >
                  <div style={{ flex: 1 }}>{nutrient.nutrientName}</div>
                  <div style={{ textAlign: "right", width: "80px" }}>
                    {nutrient.value.toFixed(2)} {nutrient.unitName}
                  </div>
                  <div style={{ textAlign: "right", width: "60px" }}>
                    {calculateRDA(nutrient, selectedLifeStage)}
                  </div>
                  <div style={{ textAlign: "right", width: "60px" }}>
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
