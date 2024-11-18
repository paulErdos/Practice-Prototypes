import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import NutritionLabel from "./nfexp0";
import NFExp1 from "./nfexp1";
import NFExp_negative1 from "./nfexp-1"


export default function NutritionFactsExperimentsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Nutrition Facts Card Experiments</h1>
        </div>

        <div>
          <NFExp1 />
        </div>

        <div>
          <NutritionLabel />
        </div>

        <div>
          <NFExp_negative1 />
        </div>

      </section>
    </DefaultLayout>
  );
}
