import { Question } from "@/interfaces/question";
import {
  Eye,
  ArrowUp,
  ArrowDown,
  CircleCheck,
  MessageCircleMore,
} from "lucide-react";

export default function QuestionInfo({ question }: { question: Question }) {
  return (
    <>
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
        {question.views ? <span>{question.views}</span> : <span>0</span>}
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
            <CircleCheck /> Question is closed.
          </span>
        )}
      </section>
    </>
  );
}
