"use client";

import { useState, useEffect } from "react";

import { CirclePlus, Pencil, EllipsisVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldSeason } from "@/interfaces/field-season";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FieldHistoryComponentProps = {
  fieldId: number;
};

const formSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  crop: z.string().nonempty(),
  treatments: z.string().nonempty(),
  yield: z.number(),
});

export default function FieldHistory({ fieldId }: FieldHistoryComponentProps) {
  const [seasons, setSeasons] = useState<FieldSeason[]>();

  useEffect(() => {
    if (!fieldId) return;
    fetchFieldSeasons();
  }, [fieldId]);

  async function fetchFieldSeasons() {
    const res = await fetch(`/api/farm/fields/${fieldId}/seasons`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    const response = await res.json();
    setSeasons(response.data);
  }

  const [isEditMode, setEditModeState] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<Partial<FieldSeason>>({});

  function openInEditMode(season: FieldSeason) {
    setEditModeState(true);
    setDefaultValues(season);
    setAddSeasonDataOpen(true);
  }

  const [isAddSeasonDataModalOpen, setAddSeasonDataOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      crop: "",
      treatments: "",
      yield: 0,
    },
  });

  useEffect(() => {
    if (isAddSeasonDataModalOpen) {
      form.reset({
        year: defaultValues.year ?? new Date().getFullYear(),
        crop: defaultValues.crop ?? "",
        treatments: defaultValues.treatments ?? "",
        yield: defaultValues.yield ?? 0,
      });
    }
  }, [defaultValues, isAddSeasonDataModalOpen, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `/api/farm/fields/${fieldId}/seasons/${defaultValues.id}`
      : `/api/farm/fields/${fieldId}/seasons`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        return toast.error("Іс-әрекетті орындау мүмкін болмады.", {
          description: `Жауап статусы: ${error.message || error.status}`,
        });
      }

      toast.info("Егістік тарихы сәтті жаңартылды.");

      if (isEditMode) {
        setDefaultValues({});
        setEditModeState(false);
      }

      setAddSeasonDataOpen(false);
      fetchFieldSeasons();
    } catch (error) {
      toast.error("Егістік тарихын жаңарту сәтсіз аяқталды.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  }

  async function onDelete(seasonId: number) {
    try {
      const res = await fetch(
        `/api/farm/fields/${fieldId}/seasons/${seasonId}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        return toast.error("Іс-әрекетті орындау мүмкін болмады.", {
          description: `Жауап статусы: ${error.message || error.status}`,
        });
      }

      const response = await res.json();
      toast.info("Егістік тарихын жаңарту сәтті аяқталды.");

      fetchFieldSeasons();
    } catch (error) {
      toast.error("Егістік тарихын жаңарту сәтсіз аяқталды.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="flex justify-end">
        <Button onClick={() => setAddSeasonDataOpen(true)}>
          <CirclePlus /> Егістік тарихын жаңарту
        </Button>
      </section>
      {seasons && seasons.length > 0 && (
        <div>
          <Carousel>
            <CarouselContent>
              {seasons.map((season, idy) => (
                <CarouselItem key={idy} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="relative">
                    <CardHeader>
                      <CardTitle>{season.year} жыл</CardTitle>
                      <CardDescription></CardDescription>
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Іс-әрекеттер</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openInEditMode(season)}
                            >
                              <Pencil />
                              <span>Өзгерту</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(season.id!)}
                            >
                              <Trash2 />
                              <span>Өшіру</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {season.crop} - {season.yield}
                      </p>
                      <p>{season.treatments}</p>
                    </CardContent>
                    <CardFooter>
                      <p>{season.updatedAt}</p>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      <section>
        <Dialog
          open={isAddSeasonDataModalOpen}
          onOpenChange={setAddSeasonDataOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Егістік алқабының тарихын енгізіңіз</DialogTitle>
              <DialogDescription>
                Егістік алқабының маусымдық тарихын енгізіңіз.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Жыл</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="crop"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дақыл түрі</FormLabel>
                        <FormControl>
                          <Input placeholder="Қызанақ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="treatments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Қолданылған химикаттар</FormLabel>
                        <FormControl>
                          <Input placeholder="Қызанақ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yield"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Өскен дақыл көлемі, тоннамен есептегенде
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Қосу</Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
