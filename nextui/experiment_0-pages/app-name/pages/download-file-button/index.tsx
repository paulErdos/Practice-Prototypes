import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function DocsPage() {
  const [firstNumber, setFirstNumber] = useState(null);

  const handleDownload = () => {
    // Generate random numbers for CSV data
    const rows = Array.from({ length: 10 }, () =>
      Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 1)
    );

    // Convert rows to CSV format
    const csvContent = rows.map((row) => row.join(",")).join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "random_numbers.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>New Page Test</h1>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Button color="primary" variant="solid" onClick={handleDownload}>
            Download CSV
          </Button>

          {firstNumber && <p>First Number: {firstNumber}</p>}
        </div>
      </section>
    </DefaultLayout>
  );
}
