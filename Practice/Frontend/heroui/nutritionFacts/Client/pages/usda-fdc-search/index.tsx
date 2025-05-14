import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import RandomNumberFetchButton, { DynamicFdcSearchButton, StaticFdcSearchButton, Selector2, FdcAsyncDropdown } from "@/pages/usda-fdc-search/call"; //from "./call";
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
          <FdcAsyncDropdown />
        </div>

        <div>
          <RandomNumberFetchButton />
        </div>

        <div>
          <StaticFdcSearchButton />
        </div>

        <div>
          <DynamicFdcSearchButton />
        </div>

      </section>
    </DefaultLayout>
  );
}