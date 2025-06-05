import { auth } from "@/auth";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <div className="p-2 min-w-full flex flex-wrap flex-row justify-around bg-white">
      <div className="flex justify-center ms-4 items-center gap-2">
        <img src="/icons/agriculture.png" className="h-10 w-10" />
        <span className="font-bold text-xl text-lime-600/90">Agrotanym</span>
      </div>
      <NavigationMenu>
        <NavigationMenuList className="flex flex-wrap justify-center text-zinc-950/80 font-bold text-lg">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink>Бастапқы бет</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/forum" legacyBehavior passHref>
              <NavigationMenuLink>Форум</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/image-classifier" legacyBehavior passHref>
              <NavigationMenuLink>Өсімдік ауруын анықтау</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/dirt-diagnosis" legacyBehavior passHref>
              <NavigationMenuLink>AI-көмекші</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/farm/fields" legacyBehavior passHref>
              <NavigationMenuLink>Мониторинг</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {session ? (
            <>
              <NavigationMenuItem>
                <Link href="/api/auth/signout" legacyBehavior passHref>
                  <NavigationMenuLink>Шығу</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <Link href="/api/auth/signin" legacyBehavior passHref>
                <NavigationMenuLink>Кіру</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
