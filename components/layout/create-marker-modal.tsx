import { useState, useRef, useEffect } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Coordinate, Marker } from "@/interfaces/field";
import { ImageDTO } from "@/interfaces/image-dto";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import Image from "next/image";

const markerformSchema = z.object({
  name: z.string().min(8).max(255),
  description: z.string().min(2).max(255),
  imageURL: z.string().min(8).max(255),
});

export function CreateMarkerModal({
  isMarkerModalOpen,
  setMarkerModalOpen,
  selectedFieldId,
  userCreatedMarkerCoordinates,
}: {
  isMarkerModalOpen: boolean;
  setMarkerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFieldId: number | undefined;
  userCreatedMarkerCoordinates: Coordinate | undefined;
}) {
  const markerForm = useForm<z.infer<typeof markerformSchema>>({
    resolver: zodResolver(markerformSchema),
    defaultValues: {
      name: "",
      description: "",
      imageURL: "",
    },
  });

  async function onMarkerFormSubmit(values: z.infer<typeof markerformSchema>) {
    const userCreatedMarker: Marker = {
      id: 0,
      name: values.name,
      description: values.description,
      imageURL: values.imageURL,
      coordinate: userCreatedMarkerCoordinates!,
    };

    const result = await fetch(`/api/farm/fields/${selectedFieldId!}/markers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCreatedMarker),
    });

    if (result.ok) {
      window.location.reload();
    }
  }

  const [imageUploadOption, setImageUploadOption] = useState(false);

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
        setFetchedImages([]);
      }
    };

    fetchImages();
  }, []);

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  const handleLoadMore = async () => {
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
        if (response.imageDTOs.length < 10) setHasNext(false);
        setFetchedImages((prevItems) => [...prevItems, ...response.imageDTOs]);
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
    <Dialog open={isMarkerModalOpen} onOpenChange={setMarkerModalOpen}>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Егістік алқабына маркерді енгізу</DialogTitle>
          <DialogDescription>Маркер жайында деректер</DialogDescription>
        </DialogHeader>

        <Form {...markerForm}>
          <form
            onSubmit={markerForm.handleSubmit(onMarkerFormSubmit)}
            className="space-y-8"
          >
            <FormField
              control={markerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Маркер атауы</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ауруға шалдыққан өсімдік анықталды"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Маркерді қоюдың себебін атаңыз.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={markerForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Маркердің анықтамасы</FormLabel>
                  <FormControl>
                    <Input placeholder="Қызанақ ауруға шалдыққан" {...field} />
                  </FormControl>
                  <FormDescription>
                    Маркердің анықтамасын енгізіңіз.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center">
              <Switch
                id="airplane-mode"
                checked={imageUploadOption}
                onCheckedChange={setImageUploadOption}
              />
              <Label htmlFor="airplane-mode">Суретті құрылғыдан жүктеу</Label>
            </div>

            <FormField
              control={markerForm.control}
              name="imageURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Маркер суреті</FormLabel>
                  {imageUploadOption ? (
                    <FormControl>
                      <Input placeholder="Маркер суретіне сілтеме" {...field} />
                    </FormControl>
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Маркер суретін таңдаңыз" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fetchedImages.map((dto, index) => (
                          <SelectItem value={`${dto.url}`} key={index}>
                            <Image
                              src={dto.url}
                              width={30}
                              height={30}
                              alt={dto.imageName}
                            />{" "}
                            {dto.imageName}
                          </SelectItem>
                        ))}
                        <div className="flex justify-center p-2">
                          <Button onClick={handleLoadMore}>Тағы жүктеу</Button>
                        </div>
                      </SelectContent>
                    </Select>
                  )}
                  <FormDescription>
                    Маркердің картада белгіленетін суретін таңдаңыз
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Қабылдау</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
