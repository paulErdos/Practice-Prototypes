import { Card, Divider } from "@nextui-org/react";

const nutritionDatas = [
    {
      servingSize: "1 Cup (228g)",
      calories: 250,
      sections: [
        { title: "Total Fat", items: [{ name: "Total Fat", amount: "8", dailyValue: "10%" }, { name: "Saturated Fat", amount: "5", dailyValue: "25%" }] },
        { title: "Cholesterol & Sodium", items: [{ name: "Cholesterol", amount: "30", dailyValue: "10%" }, { name: "Sodium", amount: "470", dailyValue: "20%" }] },
        { title: "Total Carbohydrate", items: [{ name: "Total Carbohydrate", amount: "37", dailyValue: "13%" }, { name: "Dietary Fiber", amount: "4", dailyValue: "14%" }, { name: "Total Sugars", amount: "12", dailyValue: "" }] },
        { title: "Protein", items: [{ name: "Protein", amount: "5", dailyValue: "10%" }] },
      ],
    },
    {
      servingSize: "1 Cup (228g)",
      calories: 300,
      sections: [
        { title: "Total Fat", items: [{ name: "Total Fat", amount: "10", dailyValue: "15%" }, { name: "Saturated Fat", amount: "6", dailyValue: "30%" }] },
        { title: "Cholesterol & Sodium", items: [{ name: "Cholesterol", amount: "40", dailyValue: "15%" }, { name: "Sodium", amount: "500", dailyValue: "22%" }] },
        { title: "Total Carbohydrate", items: [{ name: "Total Carbohydrate", amount: "40", dailyValue: "14%" }, { name: "Dietary Fiber", amount: "5", dailyValue: "18%" }, { name: "Total Sugars", amount: "15", dailyValue: "" }] },
        { title: "Protein", items: [{ name: "Protein", amount: "7", dailyValue: "14%" }] },
      ],
    },
  ];
  
  // Function to sum nutrition data
  const sumNutritionData = (dataArray) => {
    const totalNutrition = {
      servingSize: dataArray[0].servingSize,
      calories: dataArray.reduce((acc, curr) => acc + curr.calories, 0),
      sections: [],
    };
  
    dataArray[0].sections.forEach((section, index) => {
      const totalItems = section.items.map((item) => ({
        ...item,
        amount: dataArray.reduce((acc, curr) => acc + parseFloat(curr.sections[index].items.find(i => i.name === item.name).amount), 0).toString(),
      }));
  
      totalNutrition.sections.push({ title: section.title, items: totalItems });
    });
  
    return totalNutrition;
  };
  
  const totalNutritionData = sumNutritionData(nutritionDatas);
  
  function NutritionFacts() {
    return (
      <Card css={{ maxWidth: "300px", padding: "$10", backgroundColor: "#f5f5f5" }}>
        <h2 style={{ textAlign: "center", marginBottom: "5px" }}>Nutrition Facts</h2>
        <Divider />
        <div><strong>{`Serving Size: ${totalNutritionData.servingSize}`}</strong></div>
        <div>{`Calories: ${totalNutritionData.calories}`}</div>
        <Divider />
        {totalNutritionData.sections.map((section, index) => (
          <div key={index}>
            <strong>{section.title}</strong>
            {section.items.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                <div>{item.name}</div>
                <div>{item.amount} {item.dailyValue && `(${item.dailyValue})`}</div>
              </div>
            ))}
            <Divider />
          </div>
        ))}
      </Card>
    );
  }
  
  export default NutritionFacts;