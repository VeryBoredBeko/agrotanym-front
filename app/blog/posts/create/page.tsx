import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default async function CardWithForm() {
  interface PostDTO {
    title: string;
    content: string;
  }

  async function createPost(formData: FormData) {
    "use server";

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.accessToken;

    const res = await fetch("http://localhost:8767/forum-service/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        // ⚠️ DO NOT manually set Content-Type when using FormData.
        // fetch will automatically set the correct Content-Type with boundary.
      },
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
      }),
    });

    const data = await res.json();
    return data;
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Жаңа пост жазу</CardTitle>
          <CardDescription>Немен бөліскіңіз келеді?</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPost}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="poster">Пост мұқабасын таңдаңыз</Label>
                <Input id="poster" type="file" accept="image/*" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Пост атауы</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Сіздің постыңыздың атауы"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="content">Пост мазмұны</Label>
                <textarea
                  id="content"
                  name="content"
                  placeholder="Сіздің постыңыздың мазмұны"
                  className={cn(
                    "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    "resize-y min-h-[120px]"
                  )}
                />
              </div>
              <div>
                <input type="reset" value="Қалпына келтіру" />
              </div>
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
