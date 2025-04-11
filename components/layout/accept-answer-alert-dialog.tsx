import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export const AcceptAnswerDialog = ({
  questionId,
  answerId,
  open,
  setOpen,
  onAccept,
}: {
  questionId: string;
  answerId: string;
  open: boolean,
  setOpen: (open: boolean) => void;
  onAccept: (questionId: string, answerId: string) => void;
}) => {

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Сіз сенімдісіз бе?</AlertDialogTitle>
            <AlertDialogDescription>
              Жауапты қабылдағаннан соң, бұл әрекетті қайтару мүмкін емес.
              Сіздің сұрағыңыз жабылып, өзге ешкім оған жауап бере алмайды.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Бас тарту</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onAccept(questionId, answerId);
                setOpen(false);
              }}
            >
              Қабылдау
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
