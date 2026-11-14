import { notFound } from "next/navigation";
import { About, Contact, Footer, Header, Hero, Rack } from "@/components/Site";
import { isLocale } from "@/i18n/dict";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <Header locale={locale} />
      <main>
        <Hero locale={locale} />
        <Rack locale={locale} />
        <About locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
