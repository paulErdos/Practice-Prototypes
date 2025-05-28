import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      {/*  See notes.txt.ignore  */}

      {/*  Layout is a column of two rows  */}
      {/* <section className="flex flex-row items-center justify-center gap-4 py-8 md:py-10"> */}
      <section className="flex flex-row gap-4 py-8 md:py-10">

        {/*  First, the left of two screen-height columns  */}
        <section className="flex flex-col justify-left gap-4 py-8 md:py-10 bg-gray-900 py-6 px-6 rounded-3xl">
          {/*  First, the top of two half-screen-height,half-screen-width rows  */}
          <div className="inline-block max-w-xl text-left justify-center bg-gray-700 py-6 px-6 rounded-3xl">
            <span className={title()}>Make&nbsp;</span>
            <span className={title({ color: "violet" })}>complete&nbsp;</span>
            <br />
            <span className={title()}>
              nutrition facts labels
            </span>
          </div>
          {/*  Second, right of two rows  */}
          <div className="flex flex-row max-w-xl text-right justify-center bg-gray-700 py-6 px-6 rounded-3xl">
            <div className="flex gap-3">
              <Link
                className={buttonStyles({
                  color: "primary",
                  radius: "full",
                  variant: "shadow",
                })}
                href="/Recipe-Ingredients"
              >
                Try it
              </Link>
            </div>
          </div>
        {/*  End of first column  */}
        </section>

        {/* TODO: move all todos to issues
            TODO: section vs div
         */}
        {/*  Second, right of two screen-height columns  */}
        <div className="flex flex-row justify-left gap-4 py-8 md:py-10 bg-gray-900 py-6 px-6 rounded-3xl">
          {/*  First, left, a column one-third of this column's width  */}
          <div className="flex flex-col max-w-xl text-right justify-center bg-gray-700 py-6 px-6 rounded-3xl">
          </div>
          {/*  Second, right, a column two-thirds of this column's width  */}
          <div className="flex flex-col max-w-xl text-right justify-center bg-gray-700 py-6 px-6 rounded-3xl">
            {/*  This section has one giant region, populated by
                 a series of semi-overlapping tiles with increasing right
                 and increasing z (gotta see the nutrients and not the
                 numbers).

                 These tiles will be an example complete nutrition facts label
                 going off the bottom of the screen, reappearing at the top,
                 higher (z) and right a bit, looping around to show how detailed
                 it can be.

                 Perhaps toggle between the three sizes. I want to showcase
                 the small size.
             */}
          </div>
        {/*  End of second main column  */}
        </div>

      </section>
    </DefaultLayout>
  );
}
