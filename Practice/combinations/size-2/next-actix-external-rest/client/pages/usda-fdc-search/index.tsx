import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import RandomNumberFetchButton, { StaticFdcSearchButton, Selector2 } from "@/pages/usda-fdc-search/call"; //from "./call";
import { useState } from "react";

export default function DocsPage() {
  const [food, setFood] = useState("");
  
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Docs</h1>
        </div>

        <div>
          <Selector2 selectedOption={food} setSelectedOption={setFood}/>
        </div>

        <div>
          <RandomNumberFetchButton />
        </div>

        <div>
          <StaticFdcSearchButton />
        </div>

      </section>
    </DefaultLayout>
  );
}
