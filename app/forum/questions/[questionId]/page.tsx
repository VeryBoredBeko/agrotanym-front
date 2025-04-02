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

export default async function Page({
  params,
}: {
  params: { questionId: string };
}) {
  const { questionId } = await params;
  const fetchResult = await getQuestion(Number(questionId));

  const error = fetchResult.error;
  const status = fetchResult.status;

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
          <CardHeader>
            <CardTitle>{question.title}</CardTitle>
            <CardDescription>{question.createdAt}</CardDescription>
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
          <Answers questionId={questionId} />
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
    const res = await fetch(
      `${process.env.FORUM_SERVICE_URL}/questions/${id}`,
      {
        cache: "no-store",
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
