import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import Select from 'react-select'; 

const dummy_options = [
  {value: 5, label: 'fif'},
  {value: 'ah plead da fif', label: 'onetwothreefofiiiif'},
  {value: 'real option', label: 'i actually plead the third i refuse to quarter troops in my home'}
]

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Pricing</h1>
          <div>I intend to put this in a card: "https://react-select.com/home"</div>
          <div>Note: if recipes can be saved, named, and used as ingredients, meals of recipe servings are trivial</div>
        </div>

        <div>
          <Select options={dummy_options} />
        </div>

      </section>
    </DefaultLayout>
  );
}
