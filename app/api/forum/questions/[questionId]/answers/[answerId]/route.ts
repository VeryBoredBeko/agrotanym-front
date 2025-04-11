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

export async function PATCH(
  req: Request,
  { params }: { params: { questionId: string, answerId: string } }
) {
  const props = await params;

  const questionId = props.questionId;
  const answerId = props.answerId;

  if (!questionId && !answerId)
    return NextResponse.json({ error: "QuestionId and AnswerId have to be specified!" });

  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL(`${process.env.AUTH_SIGNIN_PATH}`));
  }

  const accessToken = session.accessToken;

  try {
    const result = await fetch(
      `${process.env.FORUM_SERVICE_URL}/questions/${questionId}/answers/${answerId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!result.ok) {
      const error = await result.json();
      return NextResponse.json(
        { error: "Error while connecting to Forum-Service:", details: error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong fetching images", details: String(error) },
      { status: 500 }
    );
  }
}
