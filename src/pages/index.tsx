import { Geist, Geist_Mono } from "next/font/google";
import ReactSwagger from "@/component/swaggerui";
import GetApiDocsV01Beta from "@/lib/swagger-v0.1-beta";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home({
  spec,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <section className="bg-white">
      <ReactSwagger spec={spec} />
    </section>
  );
}

export const getServerSideProps = (async () => {
  const spec = await GetApiDocsV01Beta();
  return { props: { spec } };
}) satisfies GetServerSideProps<{ spec: Object }>;
