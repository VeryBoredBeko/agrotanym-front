"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/interfaces/comment";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CommentMenu from "@/components/layout/comment-menu";

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/forum/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: comment }),
    });
  };

  const handleCommentDelete = async (commentId: Number) => {
    const res = await fetch(
      `/api/forum/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  useEffect(() => {
    if (!postId) return;

    async function fetchComments() {
      try {
        const res = await fetch(`/api/blog/posts/${postId}/comments`);
        const data = await res.json();
        setComments(data.comments);
      } catch (err) {
        console.error("Exception while fetching comments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [postId]);

  if (loading) return <p>Комментарийлерді жүктеудеміз...</p>;

  if (!comments.length) return <p>Әзірге ешбір комментарий жоқ.</p>;

  return (
    <>
      <div className="p-4 border rounded-lg bg-white shadow-md">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showForm ? "Бас тарту" : "Комментарий жазу"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col">
            <textarea
              className="border p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Комментарийді енгізіңіз..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Жүктеу
            </button>
          </form>
        )}
      </div>
      {comments &&
        comments.map((comment, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="relative">
              <CardTitle>Қолданушы: {comment.userId}</CardTitle>
              <CardDescription>{comment.createdAt}</CardDescription>
              <div className="absolute right-6 top-0">
                <CommentMenu commentId={comment.id} />
              </div>
            </CardHeader>
            <CardContent>{comment.content}</CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))}
    </>
  );
}
