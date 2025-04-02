"use client";

import { useEffect, useState } from "react";

import { useRouter } from 'next/navigation';

import { Answer } from "@/interfaces/answer";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { CreditCard, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";

export default function Answers({ questionId }: { questionId: string }) {

  const router = useRouter();

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleNewAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/forum/questions/${questionId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: answer }),
    });
    
    router.refresh();
  };

  const handleAnswerDelete = async (answerId: Number) => {
    const res = await fetch(
      `/api/forum/questions/${questionId}/answers/${answerId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  useEffect(() => {
    if (!questionId) return;

    async function fetchComments() {
      try {
        const res = await fetch(`/api/forum/questions/${questionId}/answers`);
        const data = await res.json();
        setAnswers(data.answers);
      } catch (err) {
        console.error("Exception while fetching comments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [questionId]);

  if (loading) return <p>Жауаптарды жүктеудеміз...</p>;

  if (!answers.length) return <p>Әзірге ешбір жауап жоқ.</p>;

  return (
    <>
      <div className="p-4 border rounded-lg bg-white shadow-md">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {showForm ? "Бас тарту" : "Жауап жазу"}
        </button>

        {showForm && (
          <form onSubmit={handleNewAnswerSubmit} className="mt-4 flex flex-col">
            <textarea
              className="border p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Жауабыңызды енгізіңіз..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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
      {answers &&
        answers.map((answer, index) => (
          <Card key={index} className="w-full rounded-none">
            <CardHeader className="relative">
              <CardTitle>Қолданушы: {answer.userId}</CardTitle>
              <CardDescription>{answer.createdAt}</CardDescription>
              <div className="absolute right-6 top-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Settings />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <User />
                        <span>Профильге өту</span>
                      </DropdownMenuItem>
                      {answer.currentUserAnswer && (
                        <>
                          <DropdownMenuItem>
                            <CreditCard />
                            <span>Өзгерту</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAnswerDelete(Number(answer.id))
                            }
                          >
                            <Settings />
                            <span>Өшіру</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>{answer.body}</CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))}
    </>
  );
}
