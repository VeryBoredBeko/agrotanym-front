import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { questionId: string; answerId: string } }
) {
  const props = await params;

  const questionId = props.questionId;
  const answerId = props.answerId;

  const comment = await deleteCommentById(Number(questionId), Number(answerId));
  return NextResponse.json({ success: true });
}

async function deleteCommentById(questionId: Number, answerId: Number) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `${process.env.FORUM_SERVICE_URL}/questions/${questionId}/answers/${answerId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Exception while making DELETE request: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Exception while making DELETE request", error);
    return;
  }
}
