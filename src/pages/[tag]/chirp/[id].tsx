import { ChirpBigView } from "@/components/chirp/big-view";
import { Layout } from "@/components/layout";
import { api } from "@/utils/api";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/router";

const ChirpPage: React.FC = () => {
  const router = useRouter();
  const chirpQuery = api.chirp.getById.useQuery(
    { id: router.query.id as string },
    { enabled: !!router.query.id }
  );

  return (
    <Layout>
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/80 px-2 py-1.5 backdrop-blur-sm 2xl:pt-8">
        <div
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full hover:bg-muted"
          role="button"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon />
        </div>

        <div>
          <p className="text-xl font-bold">Chirp</p>
        </div>
      </div>

      <div className="border-b px-4 pb-2 pt-4">
        {chirpQuery.status === "success" && (
          <ChirpBigView chirp={chirpQuery.data} />
        )}
      </div>
    </Layout>
  );
};

export default ChirpPage;
