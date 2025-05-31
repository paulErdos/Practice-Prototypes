import { Card, Divider } from "@heroui/react";

// Interface for Section and the passed data
interface Section {
  title: string;
  items: string[];
}

interface NutrientData {
  label: string;
  value: {
    nutrientName: string;
    value: number;
    unitName: string;
  }[];
}

interface nfexp1Props {
  categories?: { sections: Section[] };
  nutrientsData: NutrientData[];
}

// RDAs for vitamins (in their respective units)
const VITAMIN_RDAS: Record<string, number> = {
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
};

// Helper function to calculate percentage of RDA
function calculateRDA(nutrient: { nutrientName: string; value: number; unitName: string } | undefined): string {
  if (!nutrient) return "ND";
  
  const rda = VITAMIN_RDAS[nutrient.nutrientName];
  if (!rda) return "ND";
  
  const percentage = (nutrient.value / rda) * 100;
  return `${percentage.toFixed(0)}%`;
}

// nfexp1 component to render the nutrition facts
function nfexp1({ categories, nutrientsData }: nfexp1Props) {
  return (
    <Card
      style={{
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
          Nutrition Facts
        </h2>

        <Divider
          style={{
            height: "8px",
            backgroundColor: "black",
            margin: "8px 0",
          }}
        />

        <Divider
          style={{
            height: "4px",
            backgroundColor: "black",
            margin: "8px 0",
          }}
        />

        {categories?.sections.map((section, index) => (
          <div
            key={index}
            style={{
              marginBottom: index < categories.sections.length - 1 ? "16px" : "0",
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: "16px",
                marginTop: "16px",
                marginBottom: "16px",
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              {section.title}
            </strong>
            {section.items.map((item, idx) => {
              // Find the corresponding nutrient data for the item
              const nutrient = nutrientsData[0]?.value.find(
                (nutrient) => nutrient.nutrientName === item
              );

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    fontSize: "14px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    margin: "4px 0",
                    marginBottom:
                      idx === section.items.length - 1 ? "32px" : "4px",
                  }}
                >
                  <div style={{ flex: 1 }}>{item}</div>
                  <div
                    style={{
                      textAlign: "right",
                      minWidth: "60px",
                    }}
                  >
                    {/* Display the amount (or a placeholder if missing) */}
                    {nutrient ? `${nutrient.value} ${nutrient.unitName}` : "ND"}
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      minWidth: "60px",
                    }}
                  >
                    {/* Display percentage of RDA for vitamins */}
                    {nutrient ? calculateRDA(nutrient) : "ND"}
                  </div>
                </div>
              );
            })}
            <Divider
              style={{
                height: "1px",
                backgroundColor: "black",
                margin: "8px 0",
              }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default nfexp1;

