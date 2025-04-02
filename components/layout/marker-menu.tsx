"use client";

import { Archive, Settings, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MarkerMenu({ fieldId, markerId }: { fieldId: number, markerId: number }) {
  async function deleteMarker() {
    const result = await fetch(`/api/farm/fields/${fieldId}/markers/${markerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (result.ok) {
        window.location.reload();
      }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Операциялар</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Archive />
            <span>Архивтеу</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {deleteMarker()}}>
            <Trash2 />
            <span>Өшіру</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
