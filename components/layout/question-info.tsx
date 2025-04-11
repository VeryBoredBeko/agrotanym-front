"use client";

import { Question } from "@/interfaces/question";
import {
  Eye,
  ArrowUp,
  ArrowDown,
  CircleCheck,
  MessageCircleMore,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { useState } from "react";

export default function QuestionInfo({ question }: { question: Question }) {
  const [votes, setVotes] = useState(question.votesCount || 0);
  const [isVoted, setIsVoted] = useState(question.isVoted || false);
  const [voteType, setVoteType] = useState(question.voteType || null);

  const handleVoting = async (voteType: string) => {

    if (question.isVoted && question.voteType === voteType) {
      return undoVoting(voteType);
    }

    try {
      const res = await fetch(
        `/api/forum/questions/${question.id}/votes?voteType=${voteType}`,
        {
          method: "POST",
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
        if (voteType === "UP")
           setVotes(votes + 1);
        else setVotes(votes - 1);
        setIsVoted(true);
        setVoteType(voteType);
        toast.info("Сіздің дауысыңыз қабылданды.");
      } else {
        toast.warning("Сіздің дауысыңызды қабылдау кезінде қате орын алды.", {
          description: `Жауап статусы: ${response.status}`,
        });
      }
    } catch (error) {
      toast.error("Дауыс беру сәтсіз аяқталды.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  };

  const undoVoting = async (voteType: string) => {
    try {
      const res = await fetch(
        `/api/forum/questions/${question.id}/votes`,
        {
          method: "DELETE",
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
        if (voteType === "UP") setVotes(votes - 1);
        else setVotes(votes + 1);
        setIsVoted(false);
        toast.info("Сіздің дауысыңыз кері қайтарылды.");
      } else {
        toast.warning("Сіздің дауысыңызды кері қайтару кезінде қате орын алды.", {
          description: `Жауап статусы: ${response.status}`,
        });
      }
    } catch (error) {
      toast.error("Дауысты қайтарып алу сәтсіз аяқталды.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  };

  return (
    <>
      <section className="flex flex-row items-center gap-2 rounded-lg">
        <Button
          variant={isVoted && voteType === "UP" ? "default" : "outline"}
          size="icon"
          onClick={() => handleVoting("UP")}
        >
          <ArrowUp />
        </Button>
        <span className="w-6 text-center">{votes}</span>
        <Button
          variant={isVoted && voteType === "DOWN" ? "default" : "outline"}
          size="icon"
          onClick={() => handleVoting("DOWN")}
        >
          <ArrowDown />
        </Button>
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
            <CircleCheck /> Сұрақ жабылған.
          </span>
        )}
      </section>
    </>
  );
}
