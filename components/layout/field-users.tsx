"use client";

import { UserRole } from "@/interfaces/user";
import { useState, useEffect } from "react";

import { CirclePlus, CircleX, EllipsisVertical } from "lucide-react";

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

type FieldUsersComponentProps = {
  fieldId: number;
};

const formSchema = z.object({
  userId: z.string().uuid(),
});

export default function FieldUsers({ fieldId }: FieldUsersComponentProps) {
  const [users, setUsers] = useState<UserRole[]>();

  useEffect(() => {
    if (!fieldId) return;
    fetchFieldUsers();
  }, [fieldId]);

  async function fetchFieldUsers() {
    const res = await fetch(`/api/farm/fields/${fieldId}/users`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    const response = await res.json();
    setUsers(response.data);
  }

  const [isAddUserModalOpen, setAddModalUserOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(
        `/api/farm/fields/${fieldId}/users?userId=${values.userId}`,
        {
          method: "POST",
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
      toast.info("Қолданушы сәтті тіркелді.");

      fetchFieldUsers();
    } catch (error) {
      toast.error("Қолданушыны тіркеу сәтсіз аяқталды.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  }

  async function onDelete(userId: string) {
    try {
      const res = await fetch(
        `/api/farm/fields/${fieldId}/users?userId=${userId}`,
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
      toast.info("Қолданушының рұқсаты сәтті өшірілді.");

      fetchFieldUsers();
    } catch (error) {
      toast.error("Қолданушыны рұқсатын қайтару сәтсіз аяқталды.", {
        description: "Іс-әрекетті орындау кезінде қате орын алды.",
      });
    }
  }

  return (
    <>
      {users && users.length > 0 && (
        <div className="flex flex-col gap-4">
          <section className="flex justify-end">
            <Button onClick={() => setAddModalUserOpen(true)}>
              <CirclePlus /> Қолданушыны қосу
            </Button>
          </section>
          <section className="overflow-auto">
            <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-300"></th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                    Қолданушы ID
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                    Рөлі
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-300"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idy) => (
                  <tr
                    key={idy}
                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-700 border-b border-gray-300"></td>
                    <td className="p-4 text-sm text-gray-700 border-b border-gray-300">
                      {user.userId}
                    </td>
                    <td className="p-4 text-sm text-gray-700 border-b border-gray-300">
                      {user.role}
                    </td>
                    <td className="">
                      {user.role !== "OWNER" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Іс-әрекеттер</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                onDelete(user.userId);
                              }}
                            >
                              <CircleX />
                              <span>Рұқсатты кері алу</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section>
            <Dialog
              open={isAddUserModalOpen}
              onOpenChange={setAddModalUserOpen}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Қолданушыны қосыңыз</DialogTitle>
                  <DialogDescription>
                    Өзге қолданушыларға да егістік алқабын бақылауға рұқсатты
                    ұсыныңыз.
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
                        name="userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Қолданушы ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="f7665472-c6dd-4aea-a6bd-67a7cfb27bde"
                                {...field}
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
      )}
    </>
  );
}
