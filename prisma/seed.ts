import {
  getAlbums,
  getComments,
  getPhotos,
  getPosts,
  getTodos,
  getUsers,
} from "@jay-es/jsonplaceholder-client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("delete");
  await prisma.user.deleteMany();

  console.log("users");
  const users = await getUsers();
  // SQLite に createMany はない。トランザクションにしないと遅い
  await prisma.$transaction(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    users.map(({ address, company, ...data }) => prisma.user.create({ data })),
  );

  console.log("posts");
  const posts = await getPosts();
  await prisma.$transaction(
    posts.map((post) => prisma.post.create({ data: post })),
  );

  console.log("comments");
  const comments = await getComments();
  await prisma.$transaction(
    comments.map((comment) => prisma.comment.create({ data: comment })),
  );

  console.log("todos");
  const todos = await getTodos();
  await prisma.$transaction(
    todos.map((todo) => prisma.todo.create({ data: todo })),
  );

  console.log("albums");
  const albums = await getAlbums();
  await prisma.$transaction(
    albums.map((album) => prisma.album.create({ data: album })),
  );

  console.log("photos");
  const photos = await getPhotos();
  await prisma.$transaction(
    photos.map((photo) => prisma.photo.create({ data: photo })),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
