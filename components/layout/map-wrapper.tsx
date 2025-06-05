"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";

import { Field } from "@/interfaces/field";
import { redirect } from "next/navigation";

import { ClimatologyData } from "@/interfaces/climatology";
import ClimatologyTable from "./climatology-table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { WeatherData } from "@/interfaces/weather-api-response";

import { WeatherApiResponse } from "@/interfaces/weather-forecast-api-response";
import { WeatherCard } from "./weather-card";
import MarkerMenu from "./marker-menu";
import FieldUsers from "./field-users";
import FieldHistory from "./field-history";

import { Separator } from "@/components/ui/separator";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

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

  const [climatologyData, setClimatologyData] =
    useState<ClimatologyData | null>(null);

  useEffect(() => {
    if (!selectedField) return;

    async function fetchNASAAPI() {
      const longitude = selectedField?.coordinates[0].longitude;
      const latitude = selectedField?.coordinates[0].latitude;

      const res = await fetch(
        `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,PS,WS10M,SI_EF_TILTED_SURFACE&community=AG&longitude=${longitude}&latitude=${latitude}&format=JSON&wind-surface=SeaIce&wind-elevation=50&site-elevation=50`
      );

      const data = await res.json();

      setClimatologyData(data);
    }

    fetchNASAAPI();

    async function fetchWeatherAPI() {
      const longitude = Number(
        selectedField?.coordinates[0].longitude.toFixed(4)
      );
      const latitude = Number(
        selectedField?.coordinates[0].latitude.toFixed(4)
      );

      const res = await fetch(
        `/api/weather-api?latitude=${latitude}&longitude=${longitude}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      const result = await res.json();

      setWeatherApiResponse(result.data);
    }

    fetchWeatherAPI();
  }, [selectedField]);

  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [weatherApiResponse, setWeatherApiResponse] =
    useState<WeatherApiResponse>();

  async function onDelete() {
    if (!selectedField) return;

    try {
      const res = await fetch(`/api/farm/fields/${selectedField.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        return toast.error("Іс-әрекетті орындау мүмкін болмады.");
      }

      toast.info(`Іс-әрекет сәтті аяқталды.`);
      window.location.reload();
    } catch (error) {
      toast.error("Іс-әрекетті орындау мүмкін болмады.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  }

  return (
    <div className="">
      <div className="flex grid grid-cols-2">
        <Suspense fallback={<div>Картаны жүктеу...</div>}>
          <MapView fields={fields} selectedField={selectedField} />
        </Suspense>
        <div className="p-6 max-w-4xl mx-auto h-[500px] overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 bg-white">
            Алқаптар тізімі
          </h1>
          <ul className="space-y-4">
            {fields.map((field) => (
              <li
                key={field.id}
                className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="text-xl font-semibold text-gray-800 cursor-pointer mb-3"
                  onClick={() => selectField(field.id)}
                >
                  {field.name}
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Дәнді-дақыл:</span>{" "}
                    {field.crop}
                  </div>
                  <div>
                    <span className="font-medium">Гибрид:</span> {field.hybrid}
                  </div>
                  <div>
                    <span className="font-medium">Себу күні:</span>{" "}
                    {field.sowingDate}
                  </div>
                  <div>
                    <span className="font-medium">Ауданы:</span> {field.area} м²
                  </div>
                  <div>
                    <span className="font-medium">Топырақ түрі:</span>{" "}
                    {field.soilType}
                  </div>
                  <div>
                    <span className="font-medium">Жер өңдеу:</span>{" "}
                    {field.tillageType}
                  </div>
                  <div>
                    <span className="font-medium">Жауапты:</span>{" "}
                    {field.manager}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedField && selectedField.markers.length > 0 && (
        <section className="overflow-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                  ID
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                  Атауы
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                  Анықтама
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                  Маркер суреті
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                  Меню
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedField.markers.map((marker, idy) => (
                <tr
                  key={idy}
                  className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-700 border-b border-gray-300">
                    {marker.id}
                  </td>
                  <td className="p-4 text-sm text-gray-700 border-b border-gray-300">
                    {marker.name}
                  </td>
                  <td className="p-4 text-sm text-gray-700 border-b border-gray-300">
                    {marker.description}
                  </td>
                  <td className="p-4 border-b border-gray-300">
                    <img
                      src={marker.imageURL}
                      alt={marker.name}
                      className="h-12 w-12 object-cover rounded-full shadow-sm"
                    />
                  </td>
                  <td className="p-4 text-sm text-gray-700 border-b border-gray-300">
                    <MarkerMenu
                      fieldId={selectedField.id!}
                      markerId={marker.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {weatherApiResponse && (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 mt-4">
          <WeatherCard data={weatherApiResponse} />
        </div>
      )}

      {selectedField && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Жерсеріктік климаттық деректер</AccordionTrigger>
            <AccordionContent>
              {climatologyData && (
                <div className="w-full overflow-x-auto">
                  <ClimatologyTable data={climatologyData} />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {selectedField && <FieldUsers fieldId={selectedField.id} />}
      {selectedField && <FieldHistory fieldId={selectedField.id} />}

      {selectedField && (
        <div className="flex flex-col gap-2">
          <Separator />
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">
              Егістік алқабын өшіру
            </h4>
            <p className="text-sm text-muted-foreground">
              Бұл іс-әрекетті орындау барысында егістік алқабына қатысты
              деректердің барлығы толықтай өшіріледі. Әрекет орындалғаннан соң,
              деректерді қайта қалпына келтіру мүмкін емес.
            </p>
          </div>
          <Button
            className="w-[250px]"
            onClick={() => {
              onDelete();
            }}
          >
            <Trash2 /> Егістік алқабын өшіру
          </Button>
        </div>
      )}
    </div>
  );
}
