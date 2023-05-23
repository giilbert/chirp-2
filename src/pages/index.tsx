import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

const Home: NextPage = () => {
  return (
    <Layout>
      <header className="border-b px-6 py-4 xl:pt-12">
        <h1 className="text-2xl font-bold">Home</h1>
      </header>

      <main>
        <section className="flex flex-col border-b px-6 pb-2 pt-4">
          <div className="flex">
            <div>
              <div className="h-14 w-14 rounded-full bg-gray-400" />
            </div>

            <div
              contentEditable
              placeholder="What do you want to complain about today?"
              className="ml-4 mt-4 w-full bg-background text-xl outline-none"
            />
          </div>

          <Button className="ml-auto mt-2 w-24" size="sm">
            Chirp
          </Button>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
