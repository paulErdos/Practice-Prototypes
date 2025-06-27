export const SECTION_ORDER = [
  "Macronutrients",
  "Vitamins",
  "Minerals",
  "Aminos",
  "Sugars",
  "Vitamin A",
  "Vitamin D",
  "Vitamin E",
  "Vitamin K",
  "Sterols",
  "Fats",
  "Uncategorized",
  "Other"
];

export const SECTIONS: Record<string, string[]> = {
  "Macronutrients": [
    "Energy", 
    "Protein", 
    "Carbohydrate, by difference",  // TODO: break this down by starch, sugar, and insoluble fiber
    "Starch",
    "Total Sugars", 
    "Fiber, total dietary", 
    "Total lipid (fat)", 
    "Water",
  ],

  "Vitamins": [
    "Thiamin", 
    "Riboflavin", 
    "Folic acid", 
    "Niacin", 
    "Pantothenic acid", 
    "Vitamin A, RAE",
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
    "Sucrose", 
    "Glucose",  
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
    "Vitamin A, RAE",
    "Carotene, beta", 
    "Carotene, alpha", 
    "Cryptoxanthin, beta",
    "Lutein + zeaxanthin",
    "Lycopene",
    "Lycopene",
    "Vitamin A, IU", 
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

  "Vitamin B": [
    "Vitamin B-12, added", 
    "Folate, total", 
    "Folate, food", 
    "Folate, DFE",  
  ],

  "Sterols": [
    "Phytosterols",
    "Cholesterol", 
    "Stigmasterol",
    "Campesterol",
    "Beta-sitosterol",
  ],
  
  "Uncategorized": [
    "Alcohol, ethyl", 
    "Caffeine", 
    "Theobromine", 
    "Ash", 
    "Choline, total", 
    "Betaine",
    "Hydroxyproline", 
  ],

  "Other": [
  ]
};
