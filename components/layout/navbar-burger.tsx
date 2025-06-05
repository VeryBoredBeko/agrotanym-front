"use server";

import {
  Book,
  Menu,
  Sunset,
  Trees,
  Zap,
  Leaf,
  Sprout,
  MessageCircleQuestion,
  Wheat,
  Carrot,
  TreeDeciduous,
  BugOff,
  MessageCirclePlus,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Session } from "next-auth";
import { auth } from "@/auth";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  authRef?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
  session?: Session;
}

export async function Navbar1({
  logo = {
    url: "/",
    src: "/icons/agriculture.png",
    alt: "Agrotanym Logo",
    title: "Agrotanym",
  },
  menu = [
    { title: "Бастапқы бет", url: "/" },
    {
      title: "Форум",
      url: "/forum",
      items: [
        {
          title: "Сұрақ қою",
          icon: <MessageCirclePlus className="size-5 shrink-0" />,
          url: "/forum/questions/create",
        },
        {
          title: "Барлық сұрақтар",
          icon: <MessageCircleQuestion className="size-5 shrink-0" />,
          url: "/forum",
        },
        {
          title: "Дәнді дақылдарды өсіру",
          description: "Дәнді дақылдарды өсіру жайындағы сұрақтар",
          icon: <Wheat className="size-5 shrink-0" />,
          url: "/forum?tagId=6",
        },
        {
          title: "Көкөніс шаруашылығы",
          description: "Көкөніс шаруашылығы жайындағы сұрақтар",
          icon: <Carrot className="size-5 shrink-0" />,
          url: "/forum?tagId=7",
        },
        {
          title: "Жеміс ағаштары және жүзім өсіру",
          icon: <TreeDeciduous className="size-5 shrink-0" />,
          url: "/forum?tagId=8",
        },
        {
          title: "Топырақты өңдеу және себу технологиялары",
          icon: <TreeDeciduous className="size-5 shrink-0" />,
          url: "/forum?tagId=9",
        },
        {
          title: "Өсімдіктерді қорғау (аурулар, зиянкестер)",
          icon: <BugOff className="size-5 shrink-0" />,
          url: "/forum?tagId=10",
        },
      ],
    },
    {
      title: "AI көмегі",
      url: "/",
      items: [
        {
          title: "Өсімдік ауруын анықтау",
          description:
            "Өсімдік жапырағының суретін жүктеп, оның ауруын анықтаңыз",
          icon: <Leaf className="size-5 shrink-0" />,
          url: "/image-classifier",
        },
        {
          title: "Топырақ құрамын талдау",
          description: "Топырақ құрамына сай дақыл түрін анықтаңыз",
          icon: <Sprout className="size-5 shrink-0" />,
          url: "/dirt-diagnosis",
        },
      ],
    },
    {
      title: "Мониторинг",
      url: "/farm/fields",
    },
  ],
  authRef = {
    login: { title: "Кіру", url: `${process.env.AUTH_SIGNIN_PATH}` },
    signup: { title: "Шығу", url: `${process.env.AUTH_SIGNOUT_PATH}` },
  },
}: Navbar1Props) {
  const session = await auth();

  return (
    <section className="px-4 py-2">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="tracking-tighter font-bold text-xl text-lime-600/90">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            {session ? (
              <Button asChild size="sm">
                <a href={authRef.signup.url}>{authRef.signup.title}</a>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <a href={authRef.login.url}>{authRef.login.title}</a>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-8" alt={logo.alt} />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {session ? (
                      <Button asChild>
                        <a href={authRef.signup.url}>{authRef.signup.title}</a>
                      </Button>
                    ) : (
                      <Button asChild variant="outline">
                        <a href={authRef.login.url}>{authRef.login.title}</a>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="text-zinc-950/80 font-bold text-sm">{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-bold transition-colors hover:bg-muted hover:text-accent-foreground text-zinc-950/80"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline text-zinc-950/80">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold text-zinc-950/80">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};
