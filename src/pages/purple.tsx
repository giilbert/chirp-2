import { Layout } from "@/components/layout";
import type { NextPage } from "next";
import styles from "@/styles/purple.module.css";
import {
  BadgeCheckIcon,
  MicIcon,
  SlidersHorizontalIcon,
  TicketIcon,
} from "lucide-react";

const PurplePage: NextPage = () => {
  return (
    <Layout>
      <div>
        <h1
          className={`mt-16 text-center text-5xl font-bold xs:text-6xl lg:text-7xl ${
            styles.purple as string
          }`}
        >
          Chirp Purple
        </h1>

        <div
          className={`relative left-1/2 -z-10 -mb-[64rem] h-[64rem] w-full -translate-x-1/2 -translate-y-1/2 ${
            styles.spotlight as string
          }`}
        />

        <div className="flex flex-col items-center gap-4">
          <TicketIcon size={200} className="mt-4 -rotate-6 text-purple-500" />

          <p className="mt-16 text-xl text-white/50">
            Improve your Chirp Experience.
          </p>
          <p className="text-4xl font-bold">Join Today.</p>
        </div>

        <hr className="mt-16" />

        <div className="border-b p-8">
          <BadgeCheckIcon className="mb-4 h-24 w-24 text-purple-500" />
          <h1 className="text-2xl font-bold md:text-4xl">You get a badge.</h1>
          <p>
            This badge will show up everywhere - on your profile, on your
            chirps, making you better than everyone else. Who doesn&apos;t want
            a badge?
          </p>
        </div>

        <div className="border-b p-8">
          <MicIcon className="mb-4 h-24 w-24 text-purple-500" />
          <h1 className="text-2xl font-bold md:text-4xl">
            Protection from punishments.
          </h1>
          <p>
            With Purple, you will not be able to be silenced on this platform.
            Basically you&apos; buying youre freedom to speak (This isn&apos;t
            the US).
          </p>
        </div>

        <div className="border-b p-8">
          <SlidersHorizontalIcon className="mb-4 h-24 w-24 text-purple-500" />
          <h1 className="text-2xl font-bold md:text-4xl">
            More favored in the algorithm.
          </h1>
          <p>
            Make yourself more discoverable, by boosting your rank in the Chirp
            algorithm. More people will be able to find you with Purple.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PurplePage;
