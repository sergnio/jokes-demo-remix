import { db } from "~/utils/db.server";
import { Link, LoaderFunction, useLoaderData } from "remix";
import type { Joke } from "@prisma/client";

const getJoke = async (jokeId: string) =>
  await db.joke.findUnique({
    where: { id: jokeId },
  });

export const loader: LoaderFunction = async ({ params: { jokeId } }) => {
  if (!jokeId) throw new Error("jokeId missing in parameters");

  const joke = await getJoke(jokeId);
  if (!joke) throw new Error("Joke not found");

  return joke;
};

export default () => {
  const joke = useLoaderData<Joke>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
};
