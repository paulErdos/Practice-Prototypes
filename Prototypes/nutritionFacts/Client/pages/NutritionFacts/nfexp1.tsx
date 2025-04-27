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
  categories: { sections: Section[] };
  nutrientsData: NutrientData[];
}

// nfexp1 component to render the nutrition facts
function nfexp1({ categories, nutrientsData }: nfexp1Props) {
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
          Nutrition Facts
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

        {categories.sections.map((section, index) => (
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
                    {nutrient ? `${nutrient.value} ${nutrient.unitName}` : "N/A"}
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      minWidth: "60px",
                    }}
                  >
                    {/* Placeholder for Percent DV (you can implement this calculation as needed) TODO current format: incorrect, will need another vector of daily value and tolerable upper intake level*/}
                    {nutrient ? `${(nutrient.value / 100).toFixed(2)}%` : "N/A"}
                  </div>
                </div>
              );
            })}
            <Divider
              css={{
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

