import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";


type DialogBoxProps = {
  triggerText?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  submitText?: string;
  onSubmit?: () => void;
}
export function DialogBox({
  triggerText = "Open Dialog",
  title,
  description,
  children,
  submitText = "Submit",
  onSubmit,
}: DialogBoxProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={() => alert("Submitted")}>
        <DialogTrigger asChild>
          <Button variant="outline">{triggerText}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={() => {
              if(onSubmit?.()) {
                // close the dialog only if onSubmit returns true
                setOpen(false);
              }
            }}>{submitText}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
