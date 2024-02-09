import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { prisma } from "~/lib/prisma";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.postId, "Missing postId param");
  const postId = parseInt(params.postId, 10);

  const post = await prisma.post.findUniqueOrThrow({
    include: {
      author: true,
      comments: true,
    },
    where: { id: postId },
  });

  return json({ post });
};

export default function Post() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>{post.title}</h1>
      <strong>by {post.author.name}</strong>
      <p>{post.body}</p>
      <Link className="text-primary" to={`/posts/${post.id}/edit`}>
        Edit
      </Link>
      <h2>Comments</h2>
      <ul>
        {post.comments.map(({ id, name, body }) => (
          <li key={id}>
            <p>
              <strong>by {name}</strong>
              <br />
              {body}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
