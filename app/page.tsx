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

import Link from "next/link";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <main className="w-full grid gap-12 items-center justify-items-center min-h-screen">
        <div className="h-[520px] w-full flex-wrap bg-[url(/hero-background-image.jpg)] bg-cover">
          <div className="w-full h-full flex flex-col gap-2 justify-center items-center bg-amber-100/10 p-2 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.4)_0%,_rgba(251,191,36,0.15)_20%,_rgba(251,191,36,0)_80%)] text-center">
            <span className="p-2 text-5xl font-bold bg-gradient-to-r from-lime-700 via-green-500 to-lime-700 bg-clip-text text-transparent">
              Қазақстандық егіншілер үшін
            </span>
            <span className="text-8xl font-bold bg-gradient-to-r from-lime-700 via-green-500 to-lime-700 bg-clip-text text-transparent">
              AI-көмекші
            </span>
            <span className="text-xl text-zinc-950/80 font-bold">
              <Button
                asChild
                className="w-44 p-4 font-bold bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
              >
                <a href="http://localhost:3000/image-classifier">Қолдану</a>
              </Button>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center">
          <span className="p-4 text-center text-6xl text-zinc-950/80 font-bold">
            Біз ұсынатын шешімдер
          </span>
        </div>

        <div className="w-full p-10 flex flex-row flex-wrap gap-4 justify-items-center justify-center">
          <section className="flex-1 grid grid-rows-[30%_50%_20%] gap-2 ms-6">
            <div className="flex flex-row flex-wrap justify-start items-center gap-6">
              <Image
                src={"/icons/free-icon-artificial-intelligence.png"}
                height={"60"}
                width={"60"}
                alt="AI icon"
              />
              <span className="text-4xl text-zinc-950/80 font-bold">
                Өсімдік суретін классификациялау
              </span>
            </div>
            <p className="flex flex-row flex-wrap text-2xl text-zinc-950/80">
              <span>Өсімдік жапырағының суретін жүктеңіз.</span>
              <span>
                Жасанды интеллект негізіндегі жүйе өсімдік ауруларын дәл және
                жылдам анықтайды.
              </span>
              <span>
                Ерте диагностика егіннің өнімділігін арттыруға мүмкіндік береді.
              </span>
              <span>Өсімдіктерді қорғауды бүгіннен бастаңыз!</span>
            </p>
            <Button className="w-64 p-10 text-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md transition">
              Қолданып көру
            </Button>
          </section>
          <section className="flex-none">
            <Image
              src={"/gardner-with-microgreens-his-greenhouse.jpg"}
              height={"500"}
              width={"400"}
              className="col-span-1 row-span-2 my-auto aspect-4/5 mx-auto rounded-xl shadow-2xl shadow-slate-400/50"
              alt="Healthy Crop"
            />
          </section>
        </div>

        <div className="w-full p-10 flex flex-row flex-wrap gap-4 justify-items-center justify-center">
          <section className="flex-none ms-6">
            <Image
              src={"/compost-still-life-concept.jpg"}
              height={"500"}
              width={"400"}
              className="col-span-1 row-span-2 my-auto aspect-4/5 mx-auto rounded-xl shadow-2xl shadow-slate-400/50"
              alt="Healthy Crop"
            />
          </section>
          <section className="flex flex-1 grid grid-rows-[30%_50%_20%] gap-2 ms-6">
            <div className="flex flex-row flex-wrap justify-start items-center gap-6">
              <Image
                src={"/icons/free-icon-chatbot.png"}
                height={"60"}
                width={"60"}
                alt="AI icon"
              />
              <span className="text-4xl text-zinc-950/80 font-bold">
                Топырақ құнарлылығын талдау
              </span>
            </div>
            <p className="flex flex-row flex-wrap text-2xl text-zinc-950/80">
              <span>Топырақ құнарлылығын дәл анықтаңыз!</span>
              <span>
                Жетекші жасанды интеллект технологиялары топырақтың құрамын
                талдап, оның сапасын бағалайды.
              </span>
              <span>Егін өнімділігін арттырып, шығынды азайтыңыз!</span>
              <span>
                Құнарлы жер – мол өнімнің кепілі. Бүгін тексеріп көріңіз!
              </span>
            </p>
            <Button className="w-64 p-10 text-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md transition">
              Қолданып көру
            </Button>
          </section>
        </div>

        <div className="w-full p-10 flex flex-row flex-wrap gap-4 justify-items-center justify-center">
          <section className="flex-1 grid grid-rows-[30%_50%_20%] gap-2 ms-6">
            <div className="flex flex-row flex-wrap justify-start items-center gap-6">
              <Image
                src={"/icons/free-icon-location.png"}
                height={"60"}
                width={"60"}
                alt="AI icon"
              />
              <span className="text-4xl text-zinc-950/80 font-bold">
                Егістік алқабын бақылау
              </span>
            </div>
            <p className="flex flex-row flex-wrap text-2xl text-zinc-950/80">
              <span>Егістік алқабыңызды картаға белгілеңіз.</span>
              <span>
                Агротаным арқылы егістік алқабыңызды бақылап, ауа райы мен
                топырақ жағдайын сараптаңыз.
              </span>
              <span>Ерте диагностика өнімділікті арттыруға көмектеседі.</span>
              <span>
                Бүгіннен бастап заманауи технологиялармен егістігіңізді
                қорғаңыз!
              </span>
            </p>
            <Button className="w-64 p-10 text-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md transition">
              Қолданып көру
            </Button>
          </section>
          <section className="flex-none">
            <Image
              src={"/mockup/mockup-image.png"}
              alt="Mockup Image"
              width={500}
              height={400}
              className="col-span-1 row-span-2 my-auto aspect-4/5 mx-auto rounded-xl shadow-2xl shadow-slate-400/50"
            />
          </section>
        </div>
        {/* <div className="w-full grid grid-rows-[30%_70%] gap-5 justify-items-center">
          <span className="text-4xl font-bold">Қолдану нұсқаулығы</span>

          <Carousel className="w-full max-w-screen-lg mx-auto">
            <CarouselContent className="flex">
              <CarouselItem className="flex justify-center">
                <img
                  src="/blackspot-plant-disease.jpg"
                  alt="Blackspot plant disease"
                  className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-auto object-cover rounded-lg"
                />
              </CarouselItem>
              <CarouselItem className="flex justify-center">
                <img
                  src="/wheet-plant-disease.jpg"
                  alt="Wheat plant disease"
                  className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-auto object-cover rounded-lg"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div> */}

        <section className="p-16 h-[60vh] w-full mx-auto flex flex-col justify-center">
          <h1 className="text-4xl text-zinc-950/80 font-bold">
            Жиі қойылатын сұрақтар
          </h1>
          <Accordion
            type="single"
            collapsible
            className="w-full text-zinc-950/80"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-2xl font-semibold">
                Бағдарламаны қолдану тегін бе?
              </AccordionTrigger>
              <AccordionContent className="text-lg">
                Иә, бағдарламаны қолдану толықтай тегін.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-2xl font-semibold">
                Жүктелген қолданушы деректері қалай қолданылады?
              </AccordionTrigger>
              <AccordionContent className="text-lg">
                Қолданушы деректері қолданушыға мүмкіндігінше пайдалы деректер
                ұсыну үшін қолданылады.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-2xl font-semibold">
                Бағдарлама қандай құрылғыларда қолжетімді?
              </AccordionTrigger>
              <AccordionContent className="text-lg">
                Қазіргі уақытта Агротаным тек веб-нұсқада қолжетімді.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </div>
  );
}
