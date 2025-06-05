"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";

const formSchema = z.object({
  nitrogen: z.number().int().min(0).max(100),
  phosphorus: z.number().int().min(0).max(100),
  potassium: z.number().int().min(0).max(100),
  temperature: z.number(),
  humidity: z.number().nonnegative(),
  pH: z.number().nonnegative(),
  rainfall: z.number().nonnegative(),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      temperature: 0,
      humidity: 0,
      pH: 0,
      rainfall: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`/api/dirt-diagnosis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nitrogen: values.nitrogen,
          phosphorus: values.phosphorus,
          potassium: values.potassium,
          temperature: values.temperature,
          humidity: values.humidity,
          ph: values.pH,
          rainfall: values.rainfall,
        }),
      });

      if (!res.ok) {
        return toast.error("Іс-әрекетті орындау мүмкін болмады.");
      }

      const response = await res.json();
      setPlantName(response.data.prediction);
      toast.info(`Іс-әрекет сәтті аяқталды.`);
    } catch (error) {
      toast.error("Іс-әрекетті орындау мүмкін болмады.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  }

  const [plantName, setPlantName] = React.useState();

  return (
    <>
      {plantName && (
        <div className="flex justify-center mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Нәтиже</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Топырақтың құрамын талдай келе, сізге келесі өсімдікті өсіруге
                кеңес береміз: {plantName}.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="flex flex-row justify-center">
        <Card className="flex w-[75%] m-4">
          <CardHeader>
            <CardTitle>Топырақ құрамын талдау</CardTitle>
            <CardDescription>
              Топырақ құрамының қай өсімдікті өсіруге сай екендігін анықтаңыз
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-4 gap-4 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="nitrogen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Азот</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Топырақ құрамындағы азот көлемі
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phosphorus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Фосфор</FormLabel>
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
                      <FormDescription>
                        Топырақ құрамындағы фосфор көлемі
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="potassium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Калий</FormLabel>
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
                      <FormDescription>
                        Топырақ құрамындағы калий көлемі
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Температура</FormLabel>
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
                      <FormDescription>Орташа температура</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="humidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ылғалдылық</FormLabel>
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
                      <FormDescription>
                        Орташа топырақ ылғалдылығы
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Қышқылдылық</FormLabel>
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
                      <FormDescription>Топырақ қышқылдылығы</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rainfall"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Жауын-шашын</FormLabel>
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
                      <FormDescription>
                        Жауын-шашын мөлшері, мм-мен
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="col-start-2 col-span-2">
                  Жүктеу
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
