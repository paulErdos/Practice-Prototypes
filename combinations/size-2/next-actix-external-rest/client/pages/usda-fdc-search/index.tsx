import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import RandomNumberFetchButton, { StaticFdcSearchButton } from "@/pages/usda-fdc-search/call"; //from "./call";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Docs</h1>
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
