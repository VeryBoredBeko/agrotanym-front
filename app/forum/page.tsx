"use server";
import { Question } from "@/interfaces/question";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Eye,
  ArrowUp,
  ArrowDown,
  CircleCheck,
  MessageCircleMore,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { redirect } from "next/navigation";

// defines forum page properties
// page - page number
// tagId - questions cetegory
interface ForumPageProps {
  searchParams: {
    page?: string;
    tagId?: string;
  };
}

export default async function ForumPage({ searchParams }: ForumPageProps) {

  // getting forum page seacrh parameters
  const params = await searchParams;

  const pageNumber = Number(params.page) || 0;
  const tagId = params.tagId || "";

  // validating page number from being negative
  if (pageNumber < 0) {
    redirect(`/forum?page=0&tagId=${tagId}`);
  }

  // making call to function to fetch specified questions
  const fetchResult = await getQuestions(pageNumber, tagId);

  const error = fetchResult.error;
  const status = fetchResult.status;

  if (error) {
    return (
      <>
        <div className="flex justify-center text-4xl text-destructive ">
          <span>Сұрақтарды жүктеу кезінде қате туындады: {status}.</span>
        </div>
      </>
    );
  }

  const questions = fetchResult.data;

  if (questions) {
    return (
      <>
        <div>
          <section className="grid col-span-2 gap-4">
            {questions &&
              questions.map((question, index) => (
                <Card key={index} className="w-161">
                  <a
                    href={`http://localhost:3000/forum/questions/${question.id}`}
                  >
                    <CardHeader>
                      <CardTitle>{question.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">{question.body}</CardContent>
                    <Separator />
                    <CardFooter className="pt-2 flex grid grid-cols-4 grid-cols-[20%_20%_20%_40%]">
                      <section className="flex flex-row justify-evenly rounded-lg">
                        <ArrowUp />
                        {question.votesCount ? (
                          <span>{question.votesCount}</span>
                        ) : (
                          <span>0</span>
                        )}
                        <ArrowDown />
                      </section>
                      <section className="flex flex-row justify-center gap-2 rounded-lg">
                        <Eye />{" "}
                        {question.views ? (
                          <span>{question.views}</span>
                        ) : (
                          <span>0</span>
                        )}
                      </section>
                      <section className="flex flex-row justify-center gap-2 rounded-lg">
                        <MessageCircleMore />{" "}
                        {question.answersCount ? (
                          <span>{question.answersCount}</span>
                        ) : (
                          <span>0</span>
                        )}
                      </section>
                      <section className="flex flex-row justify-center gap-2 rounded-lg">
                        {question.isClosed && (
                          <span className="w-full flex flex-row justify-center gap-2">
                            <CircleCheck /> Сұрақ жабылған
                          </span>
                        )}
                      </section>
                    </CardFooter>
                  </a>
                </Card>
              ))}

            <Pagination>
              <PaginationContent>
                {pageNumber > 0 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/forum?page=${pageNumber - 1}&tagId=${tagId}`}
                    />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink href="" isActive={true}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                {questions.length === 10 && (
                  <PaginationItem>
                    <PaginationNext
                      href={`/forum?page=${pageNumber + 1}&tagId=${tagId}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </section>
        </div>
      </>
    );
  }
}

async function getQuestions(
  pageNumber: number,
  tagId: string
): Promise<{
  data: Question[] | null;
  error?: string;
  status: number;
}> {
  try {
    const fetchURL = `${process.env.FORUM_SERVICE_URL}/questions?page=${pageNumber}&tagId=${tagId}`;

    const res = await fetch(fetchURL, {
      cache: "no-store",
    });

    const status = res.status;

    if (!res.ok) {
      return {
        data: null,
        error: `Failed to fetch questions. Status: ${status}`,
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
