import macros from './RDA-Macros-and-Water.json' assert { type: 'json' };
import vitamins from './RDA-Vitamins.json' assert { type: 'json' };
import elements from './RDA-Elements.json' assert { type: 'json' };
import tuiMacros from './TUI-Macros-placeholder.json' assert { type: 'json' };
import tuiVitamins from './TUI-Vitamins-placeholder.json' assert { type: 'json' };
import tuiElements from './TUI-Elements-placeholder.json' assert { type: 'json' };

// Map nutrient names from JSON format (with units) to SECTIONS format (without units)
const nutrientNameMap = {
  // Vitamins
  "Vitamin A (μg/d)a": "Vitamin A, RAE",
  "Vitamin C (mg/d)": "Vitamin C, total ascorbic acid",
  "Vitamin D (μg/d)b,c": "Vitamin D (D2 + D3)",
  "Vitamin E (mg/d)d": "Vitamin E (alpha-tocopherol)",
  "Vitamin K (μg/d)": "Vitamin K (phylloquinone)",
  "Thiamin (mg/d)": "Thiamin",
  "Riboflavin (mg/d)": "Riboflavin",
  "Niacin (mg/d)e": "Niacin",
  "Vitamin B6 (mg/d)": "Vitamin B-6",
  "Folate (μg/d)f": "Folate, total",
  "Vitamin B12 (μg/d)": "Vitamin B-12",
  "Pantothenic Acid (mg/d)": "Pantothenic acid",
  "Choline (mg/d)g": "Choline, total",

  // Minerals/Elements
  "Calcium (mg/d)": "Calcium, Ca",
  "Copper (μg/d)": "Copper, Cu",
  "Iron (mg/d)": "Iron, Fe",
  "Magnesium (mg/d)": "Magnesium, Mg",
  "Manganese (mg/d)": "Manganese, Mn",
  "Phosphorus (mg/d)": "Phosphorus, P",
  "Potassium (mg/d)": "Potassium, K",
  "Selenium (μg/d)": "Selenium, Se",
  "Sodium (mg/d)": "Sodium, Na",
  "Zinc (mg/d)": "Zinc, Zn",

  // Macros
  "Water": "Water",
  "Carbohydrate, by difference": "Carbohydrate, by difference",
  "Fiber, total dietary": "Fiber, total dietary",
  "Total lipid (fat)": "Total lipid (fat)",
  "Protein": "Protein"
};

const nd2 = {};

// Get all life stage groups
const lifeStages = new Set([
  ...Object.keys(macros),
  ...Object.keys(vitamins),
  ...Object.keys(elements)
]);

// Process each life stage group
for (const lifeStage of lifeStages) {
  nd2[lifeStage] = {};
  
  // Process all nutrients from all sources
  const allNutrients = {
    ...macros[lifeStage],
    ...vitamins[lifeStage],
    ...elements[lifeStage]
  };
  
  const allLimits = {
    ...tuiMacros[lifeStage],
    ...tuiVitamins[lifeStage],
    ...tuiElements[lifeStage]
  };
  
  // Add each nutrient directly to the life stage group
  for (const [key, value] of Object.entries(allNutrients)) {
    if (key !== 'Life Stage Group' && key !== 'Life-Stage Group') {
      const mappedName = nutrientNameMap[key] || key;
      nd2[lifeStage][mappedName] = {
        rda: value || 0,
        limit: allLimits[key] || 0
      };
    }
  }
}

export default nd2; 