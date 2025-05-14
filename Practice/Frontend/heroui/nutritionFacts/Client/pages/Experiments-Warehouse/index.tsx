import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Experiments Warehouse</h1>
        </div>


      <div className="flex gap-3">
        <Link
          //isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/usda-fdc-search"
        >
          USDA FDC Search Experiments
        </Link>
      </div>

      <div className="flex gap-3">
        <Link
          //isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/API-Search-Dropdown"
        >
          API Search Dropdown
        </Link>
      </div>

      <div className="flex gap-3">
        <Link
          //isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/Search-Dropdown"
        >
          Search Dropdown
        </Link>
      </div>

      <div className="flex gap-3">
        <Link
          //isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/Recipe-Ingredients"
        >
          Ingredient List / Recipe Card UI Experiments
        </Link>
      </div>

      <div className="flex gap-3">
        <Link
          //isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/NutritionFacts"
        >
          Nutrition Facts Label UI Tests
        </Link>
      </div>

      <div className="flex gap-3">
        <Link
          //isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/api-call-button"
        >
          Button-Triggered API Call Tests
        </Link>
      </div>

    <div className="flex gap-3">
      <Link
        //isExternal
        className={buttonStyles({
          color: "primary",
          radius: "full",
          variant: "shadow",
        })}
        href="/Recipe-Ingredients"
      >
        Recipe Card Experiments
      </Link>
    </div>

    <div className="flex gap-3">
      <Link
        //isExternal
        className={buttonStyles({
          color: "primary",
          radius: "full",
          variant: "shadow",
        })}
        href="/upload-download-file-button"
      >
        Upload / Download File Button Experiments
      </Link>
    </div>

    <div className="flex gap-3">
      <Link
        className={buttonStyles({
          color: "primary",
          radius: "full",
          variant: "shadow",
        })}
        href="/Recipe-Nutrition-Builder"
      >
        Recipe Nutrition Facts Builder
      </Link>
    </div>

      </section>
    </DefaultLayout>
  );
}
