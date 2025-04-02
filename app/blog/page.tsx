import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PostDTO = {
  id: string;
  userID: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAT: string;
};

export default async function ForumPage() {
  const posts = await getPosts();

  return (
    <>
      <div>
        <section className="grid col-span-2 gap-4">
          {posts.map((post, index) => (
            <Card key={index} className="w-161">
              <a href={`http://localhost:3000/forum/posts/${post.id}`}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.createdAt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={"/plants/patterned-chlorosis.jpg"}
                    alt="Poster image"
                    className="mt-4 w-full max-h-128 rounded-lg"
                  />
                </CardContent>
                <CardFooter></CardFooter>
              </a>
            </Card>
          ))}
        </section>
      </div>
    </>
  );
}

async function getPosts(): Promise<PostDTO[]> {
  const res = await fetch("http://localhost:8767/forum-service/posts", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}
