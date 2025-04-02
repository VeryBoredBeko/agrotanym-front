import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { fieldId: string; markerId: string } }
) {
  const props = await params;

  const fieldId = props.fieldId;
  const markerId = props.markerId;

  const response = await deleteMarkerByFieldId(Number(fieldId), Number(markerId));
  return NextResponse.json({ success: true });
}

async function deleteMarkerByFieldId(fieldId: Number, markerId: Number) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.accessToken;

  try {
    const response = await fetch(
      `${process.env.FARM_MONITORING_SERVICE_URL}/fields/${fieldId}/markers/${markerId}`,
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
