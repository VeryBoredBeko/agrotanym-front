import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { Comment } from "@/interfaces/comment";

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
): Promise<NextResponse<{ comments: Comment[] }>> {
  const props = await params;
  const postId = props.postId;

  const comments: Comment[] = await fetchCommentsByPostId(Number(postId));

  return NextResponse.json<{ comments: Comment[] }>({
    comments,
  });
}

async function fetchCommentsByPostId(postId: Number): Promise<Comment[]> {
  try {
    const session = await auth();
    let accessToken = null;

    if (session) {
      accessToken = session.accessToken;
    }

    console.log(`${process.env.FORUM_SERVICE_URL}/posts/${postId}/comments`);

    const response = await fetch(
      `${process.env.FORUM_SERVICE_URL}/posts/${postId}/comments`,
      {
        method: "GET",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка при запросе комментариев: ${response.status}`);
    }

    const data = await response.json();

    return data as Comment[];
  } catch (error) {
    console.error("Ошибка получения комментариев:", error);
    return [];
  }
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const props = await params;
  const postId = props.postId;

  const body = await request.json();
  const content = body;

  const comment = await addCommentToPostById(Number(postId), content);
  return NextResponse.json({ success: true });
}

async function addCommentToPostById(postId: Number, content: JSON) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `${process.env.FORUM_SERVICE_URL}/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Exception while making POST request: ${response.status}`
      );
    }

    const data = await response.json();
    return data as Comment;
  } catch (error) {
    console.error("Exception while uploading comment:", error);
    return [];
  }
}

// // Обработка POST-запроса для добавления комментария
// export async function PUT(
//   request: Request,
//   { params }: { params: { postId: string, commentId: string } }
// ) {
//   const props = await params;
//   const postId = props.postId;
//   const commentId = props.commentId;

//   const body = await request.json();
//   const content = body;

//   const comment = await editCommentById(Number(postId), Number(commentId), content);
//   return NextResponse.json({ success: true });
// }

// async function editCommentById(postId: Number, commentId: Number, content: JSON) {
//   const session = await auth();

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const accessToken = session.accessToken;

//   try {
//     const response = await fetch(
//       `${process.env.FORUM_SERVICE_URL}/posts/${postId}/comments`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//           // Если есть авторизация, например JWT
//           // 'Authorization': `Bearer ${yourToken}`,
//         },
//         body: JSON.stringify(content),
//         // credentials: 'include' // если работаешь с cookie-сессиями
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Exception while making POST request: ${response.status}`
//       );
//     }

//     const data = await response.json();

//     // Предположим, сервер возвращает объект вида { comments: [...] }
//     return data as Comment;

//     // Если сервер возвращает массив напрямую, тогда:
//     // return data as Comment[];
//   } catch (error) {
//     console.error("Ошибка получения комментариев:", error);
//     return [];
//   }
// }

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string; commentId: string } }
) {
  const props = await params;

  const postId = props.postId;
  const commentId = props.commentId;

  const comment = await deleteCommentById(Number(postId), Number(commentId));
  return NextResponse.json({ success: true });
}

async function deleteCommentById(postId: Number, commentId: Number) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `${process.env.FORUM_SERVICE_URL}/posts/${postId}/comments/${commentId}`,
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

    // Need redirect
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Exception while making DELETE request", error);
    return;
  }
}
