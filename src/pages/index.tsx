import ReactSwagger from "@/component/swaggerui";
import GetApiDocsV01Beta from "@/lib/swagger-v0.1-beta";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function Home({
  spec,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    // NOTE: overflow-hidden must not be deleted
    <div className="bg-white m-0 p-0 overflow-hidden min-h-screen">
      <ReactSwagger spec={spec} />
    </div>
  );
}

export const getServerSideProps = (async () => {
  const spec = await GetApiDocsV01Beta();
  return { props: { spec } };
}) satisfies GetServerSideProps<{ spec: Object }>;
