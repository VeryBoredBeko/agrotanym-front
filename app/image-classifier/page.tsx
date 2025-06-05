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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

import { EllipsisVertical, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

export default function ImageClassifierPage() {
  const router = useRouter();

  // user uploaded image URL, to show it on browser
  const [imageURL, setImageURL] = useState<string | undefined>();

  // user uploaded image file which needed to make POST request
  const [image, setImage] = useState<File | null>(null);

  // all fetched images from backend
  const [fetchedImages, setFetchedImages] = useState<ImageDTO[]>([]);

  // fetching images to display it on browser
  // function would be called while client rendering
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/images");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch images");
        }

        const data = await res.json();

        setFetchedImages(data.imageDTOs);
      } catch (err: any) {
        console.error("Error fetching images:", err);
      } 
    };

    fetchImages();
  }, []);

  // backend response, describes the image processing results
  const [response, setResponse] = useState<ImageDTO>();

  // if user upload an image it would be set it's image URL and file itself
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageURL(URL.createObjectURL(file));
      setImage(file);
    }
  };

  // function which handles user submit action
  // makes POST request to Next.js API
  // awaits response as ImageDTO
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

  // function which handles image deletition by its unique id
  // makes a request to Next.js API
  // API returns only status code
  const handleImageDelete = async (imageId: string) => {
    try {
      const res = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        return toast.error("Іс-әрекетті орындау мүмкін болмады.", {
          description: `Жауап статусы: ${error.message || error.status}`,
        });
      }

      const response = await res.json();

      if (response.status === 200) {
        toast.info("Суретті өшіру сәтті аяқталды.");
        // after successfull deletition update list of fetched images
        setFetchedImages(prevItems => prevItems.filter(item => item.id !== imageId));
      } else {
        toast.warning("Суретті өшіру сәтсіз аяқталды.", {
          description: `Жауап статусы: ${response.status}`,
        });
      }
    } catch (error) {
      toast.error("Суретті өшіру сәтсіз аяқталды.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  };

  // param which used while making request to backend
  // for pagination purposes
  const [page, setPage] = useState(1);

  // indicates is all images in database are fetched 
  const [hasNext, setHasNext] = useState(true);

  // function to load next page of images
  const handleLoadMore = async() => {

    if (!hasNext) return toast.info("Барлық суреттер жүктелді!");

    try {
      const res = await fetch(`/api/images?page=${page}`, {
        method: "GET",
      });

      if (!res.ok) {
        const error = await res.json();
        return toast.error("Іс-әрекетті орындау мүмкін болмады.", {
          description: `Жауап статусы: ${error.message || error.status}`,
        });
      }

      const response = await res.json();

      if (response.status === 200) {
        setPage(page + 1);
        // if last fetched images list's length fewer than 10
        // all images has been fetched and there is no pages left
        if (response.imageDTOs.length < 10) setHasNext(false);
        setFetchedImages(prevItems => [...prevItems, ...response.imageDTOs]);
        toast.info("Суреттерді жүктеу сәтті аяқталды.");
      } else {
        toast.warning("Суреттерді жүктеу сәтсіз аяқталды.", {
          description: `Жауап статусы: ${response.status}`,
        });
      }
    } catch (error) {
      toast.error("Суреттерді жүктеу кезінде қателік орын алды.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
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
              <span className="text-white">
                Өсімдік жапырағы суретін жүктеңіз...
              </span>
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
                    Сараптама нәтижесі:{" "}
                    <span className="text-3xl">{response.classifiedLabel}</span>
                  </span>
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
                <div key={index} className="break-inside-avoid relative group">
                  <img
                    src={dto.url}
                    alt="Plant disease"
                    className="w-full h-auto rounded-t-xl shadow-2xl shadow-slate-800/50"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Іс-әрекеттер</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => {
                              handleImageDelete(dto.id);
                            }}
                          >
                            <Trash2 />
                            <span>Өшіру</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
            <Button className="mt-10" onClick={() => {handleLoadMore()}}>Тағы жүктеу</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
