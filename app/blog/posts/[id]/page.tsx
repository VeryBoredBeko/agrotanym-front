import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Comments from "./Comments";

interface PostDTO {
  id: string;
  userID: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAT: string;
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const post = await getPost(Number(id));

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>{post.createdAt}</CardDescription>
        </CardHeader>
        <CardContent>{post.content}</CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Suspense fallback={<p>Загрузка комментариев...</p>}>
        <Comments postId={id} />
      </Suspense>
    </>
  );
}

// ✅ This runs on the server at request time (SSR)
async function getPost(id: number): Promise<PostDTO> {
  const res = await fetch(`http://localhost:8767/forum-service/posts/${id}`, {
    cache: "no-store", // makes it SSR, no caching
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}
