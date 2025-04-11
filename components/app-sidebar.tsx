import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { title } from "process";
import { url } from "inspector";

const data = {
  versions: ["1.0"],
  navMain: [
    {
      title: "Форум",
      url: "/forum",
      items: [
        {
          title: "Сұрақ қою",
          url: "/forum/questions/create",
        },
        {
          title: "Менің сұрақтарым",
          url: "/forum/my-questions",
        },
        {
          title: "Хабарландыру",
          url: "#",
        }
      ],
    },
    {
      title: "Сұрақ санаттары",
      url: "#",
      items: [
        {
          title: "Дәнді дақылдарды өсіру",
          url: "/forum?tagId=6",
        },
        {
          title: "Көкөніс шаруашылығы",
          url: "/forum?tagId=7",
        },
        {
          title: "Жеміс ағаштары және жүзім өсіру",
          url: "/forum?tagId=8",
        },
        {
          title: "Топырақты өңдеу және себу технологиялары",
          url: "/forum?tagId=9",
        },
        {
          title: "Өсімдіктерді қорғау (аурулар, зиянкестер)",
          url: "/forum?tagId=10",
        }
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
