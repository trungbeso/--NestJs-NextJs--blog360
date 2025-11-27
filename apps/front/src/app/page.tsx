import Hero from "@/components/hero";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;

  return (
    <main>
      <Hero />
    </main>
  );
}
