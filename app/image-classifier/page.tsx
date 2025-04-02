"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ImageDTO } from "@/interfaces/image-dto";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function ImageClassifierPage() {
  const [imageURL, setImageURL] = useState<string | undefined>();
  const [image, setImage] = useState<File | null>(null);

  const [fetchedImages, setFetchedImages] = useState<ImageDTO[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/images");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch images");
        }

        const data = await res.json();

        console.log("Fetched images:", data.imageDTOs);

        setFetchedImages(data.imageDTOs);
      } catch (err: any) {
        console.error("Error fetching images:", err);
      } finally {
      }
    };

    fetchImages();
  }, []);

  const [response, setResponse] = useState<ImageDTO>();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageURL(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/classify", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResponse(data);
  };

  const [count, setCount] = useState(0);

  const handleLoadMore = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div className="p-5 min-h-screen">
      <Card className="min-h-screen">
        <CardHeader>
          <CardTitle className="text-4xl">Өсімдік классификаторы</CardTitle>
          <CardDescription>
            Ауруға шалдыққан өсімдік жапырағының суретін жүктеңіз, ал жасанды
            интеллект оның ауруын анықтайды.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 grid-rows-3 gap-4 h-88 p-4">
          <Label htmlFor="picture" className="text-3xl row-start-1 text-center">
            Суретті жүктеңіз
          </Label>

          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="row-start-2"
          />

          <Button
            onClick={handleSubmit}
            disabled={!image}
            className="w-full row-start-3"
          >
            Жүктеу
          </Button>

          <div className="col-start-2 row-span-3 bg-black flex items-center justify-center p-4 rounded-lg min-h-[200px]">
            {image ? (
              <img
                src={imageURL}
                alt="Uploaded"
                className="max-h-64 object-contain"
              />
            ) : (
              <span className="text-white">Өсімдік жапырағы суретін жүктеңіз...</span>
            )}
          </div>
        </CardContent>
        <CardContent>
          {response && (
            <div className="p-4 flex flex-col gap-4 justify-center rounded-xl border-2 border-lime-600/90">
              <h1 className="p-2 text-4xl text-center text-white font-bold bg-lime-600/90 rounded-xl">
                Нәтиже
              </h1>
              <div className="flex flex-row justify-evenly">
                <div>
                  <img
                    src={response.url}
                    alt="Uploaded"
                    className="max-h-64 object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center text-2xl">
                  <span>Сурет атауы: {response.imageName}</span>
                  <br></br>
                  <span>Сурет типі: {response.contentType}</span>
                  <br></br>
                  <span>
                    Сараптама нәтижесі: <span className="text-3xl">{response.classifiedLabel}</span>
                  </span>
                  <br></br>
                  <span>Өңдеу уақыты: {response.processedAt}</span>
                  <br></br>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="grid grid-flow-row">
          <div className="flex flex-col items-center justify-items-center content-center p-5 max-h-200 overflow-hidden overflow-y-auto">
            <section className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {fetchedImages.map((dto, index) => (
                <div key={index} className="break-inside-avoid">
                  <img
                    src={dto.url}
                    alt="Plant disease"
                    className="w-full h-auto rounded-t-xl shadow-2xl shadow-slate-800/50"
                  />
                  <p className="w-full p-4 text-sm font-mono italic bg-white bottom-0 rounded-b-lg border-1 border-black">
                    <span className="">{dto.classifiedLabel}</span>
                    <br />
                    <span className="text-xs">
                      Сурет өңделді: {dto.processedAt}
                    </span>
                  </p>
                </div>
              ))}
            </section>
            <Button className="mt-10">Тағы жүктеу</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
