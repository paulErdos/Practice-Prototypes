import { Link } from "@heroui/link";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://www.laoganmausa.com/products?pgid=lqprp10a-2f47ee36-93b5-43b5-bf7f-1318f436a291"
          title="no affiliation"
        >
          <span className="text-default-400">Powered by</span>
          <p className="text-primary">spicy chili oil</p>
        </Link>
      </footer>
    </div>
  );
}
