"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

import { Tag } from "@/interfaces/tag";
import { Question } from "@/interfaces/question";
import { redirect } from "next/navigation";

const formSchema = z.object({
  title: z
    .string({
      required_error: "Сұрақ атауын жазу міндетті!",
    })
    .min(10, {
      message: "Сұрақ тақырыбы 10 символдан артық болуы тиіс!",
    })
    .max(255),
  body: z
    .string({
      required_error: "Сұрақ атауын жазу міндетті!",
    })
    .min(10, {
      message: "Сұрақ мәтіні 10 символдан артық болуы тиіс!",
    }),
  tag: z.string({
    required_error: "Сұрақ категориясын таңдау міндетті!",
  }),
});

export default function QuestionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await fetch(`/api/forum/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: values.title,
        body: values.body,
        tagIdList: [values.tag],
      }),
    });

    if (result.ok) {
      redirect("/forum");
    } else {
      // toast show-up
    }
  }

  const [fetchedTags, setFetchedTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/forum/tags");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch tags");
        }

        const data = await res.json();
        setFetchedTags(data.tags);
      } catch (err: any) {
        console.error("Error while fetching tags:", err);
      }
    };

    fetchTags();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сұрақ тақырыбы</FormLabel>
              <FormControl>
                <Input placeholder="Сіздің сұрағыңыздың тақырыбы" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сұрақтың мәтіні</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Сіздің сұрағыңыздың мәтінін"
                  className=""
                  {...field}
                />
                {/* <Input placeholder="Сіздің сұрағыңыздың мәтіні" {...field} /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сұрақ категориясы</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Сұрақ категориясын таңдаңыз" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fetchedTags &&
                    fetchedTags.map((tag, index) => {
                      return (
                        <SelectItem key={index} value={`${tag.id}`}>
                          {tag.name}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Жариялау</Button>
      </form>
    </Form>
  );
}

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { cn } from "@/lib/utils";

// import { auth } from "@/auth";
// import { redirect } from "next/navigation";

// export default async function CardWithForm() {
//   async function createPost(formData: FormData) {
//     "use server";

//     const session = await auth();

//     if (!session || session.error) {
//       redirect(`${process.env.AUTH_SIGNIN_PATH}`);
//     }

//     const accessToken = session.accessToken;

//     const res = await fetch(`${process.env.FORUM_SERVICE_URL}/questions`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         title: formData.get("title"),
//         body: formData.get("content"),
//         tagIdList: [9]
//       }),
//     });

//     if (!res.ok) redirect("/forum?error");

//     redirect("/forum");
//   }

//   return (
//     <>
//       <Card className="w-full">
//         <CardHeader>
//           <CardTitle>Жаңа сұрақ қою</CardTitle>
//           <CardDescription>Қандай сұрағыныңыз бар?</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form action={createPost}>
//             <div className="grid w-full items-center gap-4">
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="title">Сұрақ</Label>
//                 <Input
//                   id="title"
//                   name="title"
//                   placeholder="Сіздің сұрағыңыз"
//                 />
//               </div>
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="content">Сұрақ мазмұны</Label>
//                 <textarea
//                   id="content"
//                   name="content"
//                   placeholder="Сіздің сұрағыңыздың мазмұны"
//                   className={cn(
//                     "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//                     "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//                     "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//                     "resize-y min-h-[120px]"
//                   )}
//                 />
//               </div>
//               <div>
//                 <input type="reset" value="Қалпына келтіру" />
//               </div>
//               <Button variant="outline">Бас тарту</Button>
//               <Button>Жүктеу</Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </>
//   );
// }
