"use client";
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { toast } from "sonner";

export function ItemDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item className="shadow-md hover:shadow-lg transition-shadow" variant="outline">
        <ItemContent>
          <ItemTitle>Example Item</ItemTitle>
          <ItemDescription>
            A simple example to demonstrate the sandbox pattern
          </ItemDescription>
        </ItemContent>
        <ItemActions onClick={() => toast("Action clicked!")}>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm" asChild>
        <a href="#">
          <ItemMedia>
            <BadgeCheckIcon className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </a>
      </Item>
    </div>
  )
}
