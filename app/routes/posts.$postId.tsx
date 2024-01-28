import {
  getPost,
  getPostComments,
  getUser,
} from "@jay-es/jsonplaceholder-client";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.postId, "Missing postId param");
  const postId = parseInt(params.postId, 10);

  const commentsPromise = getPostComments(postId);
  const post = await getPost(postId);
  const user = await getUser(post.userId);

  return json({ post, user, comments: await commentsPromise });
};

export default function Post() {
  const { post, user, comments } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>{post.title}</h1>
      <strong>by {user.name}</strong>
      <p>{post.body}</p>
      <Link className="text-primary" to={`/posts/${post.id}/edit`}>
        Edit
      </Link>
      <h2>Comments</h2>
      <ul>
        {comments.map(({ id, name, body }) => (
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
