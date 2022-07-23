import type { NextPage } from "next";
import Head from "next/head";
import Container from "src/components/Container";


const Settings: NextPage = () => {
  return (
    <>
      <Head>
        <title>Settings | Flaaj Kanban Board</title>
        <meta name="description" content="A fullstack kanban app made with t3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className="flex justify-center items-center h-full"></div>
      </Container>
    </>
  );
};

export default Settings;
