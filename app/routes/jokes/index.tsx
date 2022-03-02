import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { Joke } from "@prisma/client";

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });

  if (!randomJoke) throw new Error("No joke found!");

  return randomJoke;
};

export default () => {
  const randomJoke = useLoaderData<Joke>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{randomJoke.content}</p>
      <Link to={randomJoke.id}>"{randomJoke.name}" Permalink</Link>
    </div>
  );
};
