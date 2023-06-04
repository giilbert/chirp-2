import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const FourOhFourPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <motion.h1
            className="text-[8rem] font-bold md:text-[10rem] lg:text-[16rem]"
            animate={{
              rotate: 4,
              transition: {
                delay: 1,
              },
            }}
          >
            404
          </motion.h1>
          <p>This page could not be found.</p>
          <Button
            size="sm"
            className="w-40"
            onClick={() => {
              router.back();
            }}
          >
            Go back
          </Button>
        </div>
      </div>
    </>
  );
};

export default FourOhFourPage;
