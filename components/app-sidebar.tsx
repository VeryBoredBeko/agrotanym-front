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
          url: "/forum/questions/user",
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
          title: "Өсімдік шаруашылығы",
          url: "#",
        },
        {
          title: "Мал шаруашылығы",
          url: "#",
        },
        {
          title: "Агроинновациялар",
          url: "#",
        },
        {
          title: "Техника және құрал-жабдықтар",
          url: "#",
        },
        {
          title: "Климат / ауа-райы",
          url: "#",
        },
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
