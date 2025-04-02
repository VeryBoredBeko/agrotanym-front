"use server";

import MapWrapper from "@/components/layout/map-wrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Field } from "@/interfaces/field";
import { Session } from "next-auth";

export default async function FieldsPage() {
  const session = await auth();

  if (!session || session.error) redirect("/api/auth/signin");

  const fields = await getFields(session);

  return (
    <div className="grid gap-4 p-4">
      <section className="flex justify-center">
        <MapWrapper fields={fields} />
      </section>
    </div>
  );
}

async function getFields(session: Session): Promise<Field[]> {
  try {
    const accessToken = session.accessToken;

    const response = await fetch("http://localhost:8098/fields", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      redirect("/api/auth/signin");
    };

    const data: Field[] = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}
