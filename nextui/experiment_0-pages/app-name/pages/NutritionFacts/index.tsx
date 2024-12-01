import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
//import NutritionLabel from "./nfexp0";
import NFExp1 from "./nfexp1";
//import NFExp_negative1 from "./nfexp-1"

import categories from "./nutrients-categorized.json";


export default function NutritionFactsExperimentsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Nutrition Facts Card Experiments</h1>
        </div>

        {/* TODO: fudge a data object giving bogus values for amount and %dv, parametrize this component to take one,
                  and look up values and display them
        */}
        <div>
          <NFExp1 categories={categories} />
        </div>

        {/*
        <div>
          <NutritionLabel />
        </div>

        <div>
          <NFExp_negative1 />
        </div>
        */}

      </section>
    </DefaultLayout>
  );
}
