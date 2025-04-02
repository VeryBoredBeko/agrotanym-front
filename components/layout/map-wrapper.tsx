"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";

import { Field } from "@/interfaces/field";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

const MapView = dynamic(() => import("@/components/layout/map-view"), {
  ssr: false,
});

type MapWrapperProps = {
  fields: Field[];
};

export default function MapWrapper({ fields }: MapWrapperProps) {
  const [selectedField, setSelectedField] = useState<Field | undefined>(
    undefined
  );

  const selectField = async (fieldId: Number) => {
    const res = await fetch(`/api/farm/fields/${fieldId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) redirect("/api/auth/signin");

    const field = await res.json();
    setSelectedField(field.data);
  };

  return (
    <div className="flex grid-cols-2">
      <Suspense fallback={<div>Картаны жүктеу...</div>}>
        <MapView fields={fields} selectedField={selectedField} />
      </Suspense>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Алқаптар тізімі</h1>
        <ul className="space-y-4">
          {fields.map((field) => (
            <li
              key={field.id}
              className="border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <p
                className="text-xl font-semibold"
                onClick={() => {
                  selectField(field.id);
                }}
              >
                {field.name}
              </p>
              <p>Ауданы: {field.area} м²</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
