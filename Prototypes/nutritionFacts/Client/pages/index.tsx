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
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Get&nbsp;</span>
          <span className={title({ color: "violet" })}>complete&nbsp;</span>
          <br />
          <span className={title()}>
            nutrition facts labels for everything you eat
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Just add ingredients
          </div>
        </div>

        <div>
          {/* Styled elements I might want to use later */}
          {/* This will go back in
          <div className="flex gap-3">
            <Link
              //isExternal
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href={siteConfig.links.docs}
            >
              Documentation
            </Link>

            <Link
              //isExternal
              className={buttonStyles({ variant: "bordered", radius: "full" })}
              href={siteConfig.links.github}
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>
          */}
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
            Try it
          </Link>
        </div>

      </section>
    </DefaultLayout>
  );
}
