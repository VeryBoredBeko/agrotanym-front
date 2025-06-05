"use server";

import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { Answer } from "@/interfaces/answer";

export async function GET(
  request: Request,
  { params }: { params: { questionId: string } }
): Promise<NextResponse<{ answers: Answer[] }>> {
  const props = await params;
  const questionId = props.questionId;

  const answers: Answer[] = await fetchAnswersByQuestionId(Number(questionId));

  return NextResponse.json<{ answers: Answer[] }>({
    answers,
  });
}

async function fetchAnswersByQuestionId(questionId: Number): Promise<Answer[]> {
  try {
    const session = await auth();
    let accessToken = null;

    if (session) {
      accessToken = session.accessToken;
    }

    const response = await fetch(
      `${process.env.FORUM_SERVICE_URL}/questions/${questionId}/answers`,
      {
        method: "GET",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 401) {
      redirect("/auth/signin");
    }

    if (!response.ok) {
      throw new Error(`Error while fetching answers: ${response.status}`);
    }

    const data = await response.json();

    return data as Answer[];
  } catch (error) {
    console.error("Error while fetching answers:", error);
    return [];
  }
}

export async function POST(
  request: Request,
  { params }: { params: { questionId: string } }
) {
  const questionId = (await params).questionId;
  const body = await request.json();

  const session = await auth();

  if (!session) {
    return NextResponse.redirect("/api/auth/signin");
  }

  const accessToken = session.accessToken;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No available access token" },
      { status: 401 }
    );
  }

  const result = await addAnswerToQuestionById(
    Number(questionId),
    body,
    accessToken
  );

  if (result.error === "Unauthorized") {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/signin`
    );
  }

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function addAnswerToQuestionById(
  questionId: number,
  body: JSON,
  accessToken: string
) {
  try {
    const response = await fetch(
      `${process.env.FORUM_SERVICE_URL}/questions/${questionId}/answers`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (response.status === 401) {
      console.warn("Access token expired or invalid");
      return { error: "Unauthorized" };
    }

    if (!response.ok) {
      return { error: `Request failed with status ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Exception while uploading answer:", error);
    return { error: "Server error" };
  }
}

// export async function POST(
//   request: Request,
//   { params }: { params: { questionId: string } }
// ) {
//   const props = await params;
//   const questionId = props.questionId;

//   const body = await request.json();
//   const content = body;

//   const answer = await addAnswerToQuestionById(Number(questionId), content);
//   return NextResponse.json({ success: true });
// }

// async function addAnswerToQuestionById(questionId: Number, content: JSON) {
//   const session = await auth();

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const accessToken = session.accessToken;

//   try {
//     const response = await fetch(
//       `${process.env.FORUM_SERVICE_URL}/questions/${questionId}/answers`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(content),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Exception while making POST request: ${response.status}`
//       );
//     }

//     const data = await response.json();
//     return data as Answer;
//   } catch (error) {
//     console.error("Exception while uploading comment:", error);
//     return [];
//   }
// }
