import { Card, Divider } from "@heroui/react";
//import categories from "./nutrients-categorized.json";

interface Section {
  title: string;
  items: string[];
}

// TODO: use above interface to produce type annotation
function nfexp1({categories}) {
    return (
      <Card css={{ 
        maxWidth: "300px", 
        padding: "$10", 
        backgroundColor: "white",
        border: "1px solid black",
        borderRadius: "0",
        boxShadow: "none"
      }}>
        <div style={{ padding: "16px" }}>
          <h2 style={{ 
            textAlign: "center", 
            marginBottom: "5px",
            fontSize: "28px",
            fontWeight: "900",
            fontFamily: "Helvetica, Arial, sans-serif"
          }}>Nutrition Facts</h2>

          <Divider css={{ 
            height: "8px", 
            backgroundColor: "black",
            margin: "8px 0"
          }} />

          {/* ... existing commented serving size and calories ... */}

          <Divider css={{ 
            height: "4px", 
            backgroundColor: "black",
            margin: "8px 0"
          }} />

          {categories.sections.map((section, index) => (
              <div key={index} style={{ 
                marginBottom: index < categories.sections.length - 1 ? "16px" : "0" 
              }}>
                  <strong style={{ 
                    display: "block",
                    fontSize: "16px",
                    marginTop: "16px",
                    marginBottom: "16px",
                    fontFamily: "Helvetica, Arial, sans-serif"
                  }}>{section.title}</strong>
                  {section.items.map((item, idx) => (
                      <div key={idx} style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        gap: "16px",
                        fontSize: "14px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        margin: "4px 0",
                        marginBottom: idx === section.items.length - 1 ? "32px" : "4px"
                      }}>
                          <div style={{ flex: 1 }}>{item}</div>
                          <div style={{ textAlign: "right", minWidth: "60px" }}>{"amount"}</div>
                          <div style={{ textAlign: "right", minWidth: "60px" }}>{"percent dv"}</div>
                      </div>
                  ))}
                  <Divider css={{ 
                    height: "1px", 
                    backgroundColor: "black",
                    margin: "8px 0"
                  }} />
              </div>
          ))}
        </div>
      </Card>
    );
}

export default nfexp1;