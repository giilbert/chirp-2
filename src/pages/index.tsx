import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "@/utils/api";

const Home: NextPage = () => {
  return (
    <div>
      <h1>Hello world</h1>
    </div>
  );
};

export default Home;
