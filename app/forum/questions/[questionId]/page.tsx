"use server";

import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Question } from "@/interfaces/question";
import Answers from "./answers";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import QuestionInfo from "@/components/layout/question-info";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { CreditCard, Settings, User, MoreVertical, Trash2 } from "lucide-react";

export default async function Page({
  params,
}: {
  params: { questionId: string };
}) {
  const { questionId } = await params;
  const fetchResult = await getQuestion(Number(questionId));

  const error = fetchResult.error;
  const status = fetchResult.status;

  if (status === 401) redirect(`${process.env.AUTH_SIGNIN_PATH}`);

  if (error) {
    return (
      <>
        <div className="flex justify-center text-4xl text-destructive ">
          <span>Сұрақты жүктеу кезінде қате туындады: {status}.</span>
        </div>
      </>
    );
  }

  const question = fetchResult.data;

  if (question) {
    return (
      <>
        <Card className="w-full">
          <CardHeader className="relative">
            <CardTitle>{question.title}</CardTitle>
            <CardDescription>{question.createdAt}</CardDescription>
            {/* <div className="absolute right-6 top-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {question.isOwner && (
                      <>
                        <DropdownMenuItem>
                          <CreditCard />
                          <span>Өзгерту</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 />
                          <span>Өшіру</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}
          </CardHeader>
          <CardContent>{question.body}</CardContent>
          <Separator />
          <CardFooter className="pt-2 flex grid grid-cols-4 grid-cols-[20%_20%_20%_40%]">
            <Suspense fallback={<p>Деректерді жүктеу...</p>}>
              <QuestionInfo question={question} />
            </Suspense>
          </CardFooter>
        </Card>
        <Suspense fallback={<p>Жауаптарды жүктеу...</p>}>
          <Answers questionId={questionId} isClosed={question.isClosed} isQuestionOwner={question.isOwner} />
        </Suspense>
      </>
    );
  }
}

async function getQuestion(id: number): Promise<{
  data: Question | null;
  error?: string;
  status: number;
}> {
  try {
    const session = await auth();

    const accessToken = session?.accessToken;

    const res = await fetch(
      `${process.env.FORUM_SERVICE_URL}/questions/${id}`,
      {
        cache: "no-store",
        headers: {
          ...(session
            ? { Authorization: `Bearer ${session.accessToken}` }
            : {}),
        },
      }
    );

    const status = res.status;

    if (!res.ok) {
      return {
        data: null,
        error: `Failed to fetch question. Status: ${status}`,
        status,
      };
    }

    const data = await res.json();

    return {
      data,
      status,
    };
  } catch (error) {
    return {
      data: null,
      error: "Unexpected server error",
      status: 500,
    };
  }
}

async function voteToQuestion(id: number, voteType: string) {
  const session = await auth();

  if (!session || session.error || !session.accessToken)
    redirect(`${process.env.AUTH_SIGNIN_PATH}`);

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `${process.env.FORUM_SERVICE_URL}/questions/${id}/votes?voteType=${voteType}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.status === 401) {
      redirect("/api/auth/signin");
    }

    const data = await response.json();

    return {
      data,
    };
  } catch (error) {
    return {
      data: null,
      error: "Unexpected server error",
      status: 500,
    };
  }
}
