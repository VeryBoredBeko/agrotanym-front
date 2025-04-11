"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

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

import {
  CreditCard,
  Settings,
  User,
  MoreVertical,
  Trash2,
  CircleCheck,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AcceptAnswerDialog } from "@/components/layout/accept-answer-alert-dialog";

export default function Answers({
  questionId,
  isClosed,
  isQuestionOwner,
}: {
  questionId: string;
  isClosed: boolean;
  isQuestionOwner: boolean;
}) {
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
      body: JSON.stringify({ body: answer }),
    });

    if (res.ok) window.location.reload();
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

    if (res.ok) window.location.reload();
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

  const handleAcceptingAnswer = async (
    questionId: string,
    answerId: string
  ) => {
    try {
      const res = await fetch(
        `/api/forum/questions/${questionId}/answers/${answerId}`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        return toast.error("Іс-әрекетті орындау мүмкін болмады.", {
          description: `Жауап статусы: ${error.message || error.status}`,
        });
      }

      const response = await res.json();

      if (response.status === 200) {
        toast.info("Жауапты қабылдау сәтті орындалды.");
        return window.location.reload();
      } else {
        toast.warning("Жауапты қабылдау сәтсіз аяқталды.", {
          description: `Жауап статусы: ${response.status}`,
        });
      }
    } catch (error) {
      toast.error("Жауапты қабылдау сәтсіз аяқталды.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  };

  if (loading) return <p>Жауаптарды жүктеудеміз...</p>;

  return (
    <>
      {!isClosed && (
        <div className="p-4 border rounded-lg bg-white shadow-md">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showForm ? "Бас тарту" : "Жауап жазу"}
          </button>

          {showForm && (
            <form
              onSubmit={handleNewAnswerSubmit}
              className="mt-4 flex flex-col"
            >
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
      )}

      {answers &&
        answers.map((answer, index) => (
          <Card
            key={index}
            className={
              answer.isAccepted
                ? "w-full rounded-none border-1 border-green-500"
                : "w-full rounded-none"
            }
          >
            <CardHeader className="relative">
              <CardTitle>Қолданушы: {answer.userId}</CardTitle>
              <CardDescription>{answer.createdAt}</CardDescription>
              <div className="absolute right-6 top-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {answer.currentUserAnswer && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              handleAnswerDelete(Number(answer.id))
                            }
                          >
                            <Trash2 />
                            <span>Өшіру</span>
                          </DropdownMenuItem>
                        </>
                      )}
                      {isQuestionOwner &&
                        !answer.currentUserAnswer &&
                        !answer.isAccepted && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleAcceptingAnswer(questionId, answer.id)
                            }
                          >
                            <CircleCheck />
                            <span>Жауапты қабылдау</span>
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>{answer.body}</CardContent>
            <CardFooter>
              {answer.isAccepted && (
                <>
                  <CircleCheck /> Қабылданған жауап
                </>
              )}
            </CardFooter>
          </Card>
        ))}
    </>
  );
}
