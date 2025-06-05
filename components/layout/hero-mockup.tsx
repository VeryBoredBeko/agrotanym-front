"use client";

import { Users, Eye, Bot } from "lucide-react";
import React from "react";

import { Separator } from "@/components/ui/separator";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Hero45Props {
  badge?: string;
  heading: string;
  imageSrc?: string;
  imageAlt?: string;
  features?: Feature[];
}

const Hero45 = ({
  heading = "Agrotanym",
  imageSrc = "/AA9AevNjIn5.png",
  imageAlt = "placeholder",
  features = [
    {
      icon: <Bot className="h-auto w-5" />,
      title: "AI көмегі",
      description:
        "AI көмегі арқылы өсімдік ауруларын анықтаңыз және сауалдар алыңыз",
    },
    {
      icon: <Users className="h-auto w-5" />,
      title: "Егіншілер қоғамы",
      description:
        "Отандық егіншілермен білім және тәжірибе алмасыңыз",
    },
    {
      icon: <Eye className="h-auto w-5" />,
      title: "Егіс алқабын нақты уақытта бақылаңыз",
      description:
        "Өз егіс алқабыңыздың тарихын жүргізіңіз",
    },
  ],
}: Hero45Props) => {
  return (
    <section className="py-4">
      <div className="container overflow-hidden">
        <div className="mb-20 flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold lg:text-5xl">{heading}</h1>
        </div>
        <div className="relative mx-auto max-w-screen-lg">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="aspect-video max-h-[500px] w-full rounded-xl object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute -top-28 -right-28 -z-10 aspect-video h-72 w-96 [background-size:12px_12px] opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] sm:bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]"></div>
          <div className="absolute -top-28 -left-28 -z-10 aspect-video h-72 w-96 [background-size:12px_12px] opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] sm:bg-[radial-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]"></div>
        </div>
        <div className="mx-auto mt-10 flex max-w-screen-lg flex-col md:flex-row">
          {features.map((feature, index) => (
            <React.Fragment key={feature.title}>
              {index > 0 && (
                <Separator
                  orientation="vertical"
                  className="mx-6 hidden h-auto w-[2px] bg-gradient-to-b from-muted via-transparent to-muted md:block"
                />
              )}
              <div
                key={index}
                className="flex grow basis-0 flex-col rounded-md bg-background p-4"
              >
                <div className="mb-6 flex size-10 items-center justify-center rounded-full bg-background drop-shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Hero45 };
