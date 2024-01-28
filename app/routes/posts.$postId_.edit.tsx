import { getPost, patchPost } from "@jay-es/jsonplaceholder-client";
import {
  ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import * as v from "valibot";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.postId, "Missing postId param");
  const postId = parseInt(params.postId, 10);
  const post = await getPost(postId);

  return json({ post });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.postId, "Missing postId param");
  const postId = parseInt(params.postId, 10);

  const formData = await request.formData();
  const updates = v.parse(
    v.object({ title: v.string(), body: v.string() }),
    Object.fromEntries(formData),
  );
  await patchPost(postId, updates);

  return redirect(`/posts/${postId}`);
};

export default function PostEdit() {
  const { post } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form className="flex flex-col gap-y-8" method="post">
      <fieldset className="form-control">
        <div className="label">
          <label htmlFor="title" className="label-text">
            title:
          </label>
        </div>
        <input
          id="title"
          name="title"
          className="input input-bordered w-full"
          defaultValue={post.title}
          required
        />
      </fieldset>
      <fieldset className="form-control">
        <div className="label">
          <label htmlFor="body" className="label-text">
            body:
          </label>
        </div>
        <textarea
          id="body"
          name="body"
          className="textarea textarea-bordered w-full h-40"
          defaultValue={post.body}
          required
        />
      </fieldset>

      <div className="flex gap-x-4">
        <button
          type="button"
          className="btn btn-outline btn-primary btn-sm"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          Save
        </button>
      </div>
    </Form>
  );
}
