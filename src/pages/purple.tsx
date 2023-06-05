import { Layout } from "@/components/layout";
import type { NextPage } from "next";
import styles from "@/styles/purple.module.css";
import { type Variants, motion } from "framer-motion";
import {
  BadgeCheckIcon,
  MicIcon,
  SlidersHorizontalIcon,
  TicketIcon,
} from "lucide-react";

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

const PurplePage: NextPage = () => {
  return (
    <Layout>
      <motion.div initial="hidden" animate="show">
        <motion.h1
          className={`mt-16 text-center text-5xl font-bold xs:text-6xl lg:text-7xl ${
            styles.purple as string
          }`}
          variants={{
            hidden: {
              opacity: 0,
              y: 100,
            },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                ease: "easeOut",
                duration: 4,
              },
            },
          }}
        >
          Chirp Purple
        </motion.h1>

        <motion.div
          className={`relative left-1/2 -z-10 -mb-[64rem] h-[64rem] w-full -translate-x-1/2 -translate-y-1/2 ${
            styles.spotlight as string
          }`}
          variants={{
            hidden: {
              opacity: 0,
            },
            show: {
              opacity: 1,
              transition: {
                duration: 3,
                delay: 1,
              },
            },
          }}
        />

        <motion.div
          className="flex flex-col items-center gap-4"
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: 4,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: -20,
              },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 4,
                  delay: 3,
                },
              },
            }}
          >
            <TicketIcon size={200} className="mt-4 -rotate-6 text-purple-500" />
          </motion.div>

          <motion.p
            className="mt-16 text-xl text-white/50"
            variants={{
              hidden: {
                opacity: 0,
              },
              show: {
                opacity: 1,
              },
            }}
          >
            Improve your Chirp Experience.
          </motion.p>
          <motion.p
            className="text-4xl font-bold"
            variants={{
              hidden: {
                opacity: 0,
              },
              show: {
                opacity: 1,
              },
            }}
          >
            Join Today.
          </motion.p>
        </motion.div>

        <hr className="mt-16" />

        <motion.div
          variants={{
            hidden: {
              opacity: 0,
            },
            show: {
              opacity: 1,
              transition: {
                delayChildren: 5,
                staggerChildren: 1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div className="border-b p-8" variants={sectionVariants}>
            <BadgeCheckIcon className="mb-4 h-24 w-24 text-purple-500" />
            <h1 className="text-2xl font-bold md:text-4xl">You get a badge.</h1>
            <p>
              This badge will show up everywhere - on your profile, on your
              chirps, making you better than everyone else. Who doesn&apos;t
              want a badge?
            </p>
          </motion.div>

          <motion.div className="border-b p-8" variants={sectionVariants}>
            <MicIcon className="mb-4 h-24 w-24 text-purple-500" />
            <h1 className="text-2xl font-bold md:text-4xl">
              Protection from punishments.
            </h1>
            <p>
              With Purple, you will not be able to be silenced on this platform.
              Basically you&apos; buying youre freedom to speak (This isn&apos;t
              the US).
            </p>
          </motion.div>

          <motion.div className="border-b p-8" variants={sectionVariants}>
            <SlidersHorizontalIcon className="mb-4 h-24 w-24 text-purple-500" />
            <h1 className="text-2xl font-bold md:text-4xl">
              More favored in the algorithm.
            </h1>
            <p>
              Make yourself more discoverable, by boosting your rank in the
              Chirp algorithm. More people will be able to find you with Purple.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default PurplePage;
