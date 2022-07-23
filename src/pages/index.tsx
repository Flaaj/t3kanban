import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Container from "src/components/Container";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Flaaj Kanban Board</title>
        <meta name="description" content="A fullstack kanban app made with t3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container></Container>
    </>
  );
};

export default Home;
