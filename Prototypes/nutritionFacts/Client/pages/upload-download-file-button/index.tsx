import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/react";
import { useState } from "react";

export default function DocsPage() {
  {/*const [firstNumber, setFirstNumber] = useState(null);*/}

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

          <CsvUploader />

          {/*{firstNumber && <p>First Number: {firstNumber}</p>}*/}
        </div>
      </section>
    </DefaultLayout>
  );
}

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


import React from 'react';
import { Input } from "@heroui/react";

const CsvUploader = () => {
  const [csvContent, setCsvContent] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const clearContent = () => {
    setCsvContent('');
  };

  return (
    <div>
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        label="Choose CSV file"
      />
      <Button onClick={clearContent} color="default">
        Clear
      </Button>
      {csvContent && (
        <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
          <h3>Uploaded CSV Content:</h3>
          <pre>{csvContent}</pre>
        </div>
      )}
    </div>
  );
};

