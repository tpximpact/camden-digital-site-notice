import Head from "next/head";
import { client } from "../../util/client";

const Home = ({ data }: any) => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ul>
          {data && data.map(({id, title}: any) =>  {
            return (
              <li key={id}>
                <b>{title}</b>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
};

export async function getStaticProps() {
  const query = `*[_type == "post"] {
    id,
    title,
    description
  }`;

  const data = await client.fetch(query);

  return {
    props: {
      data,
    },
  };
}

export default Home;
