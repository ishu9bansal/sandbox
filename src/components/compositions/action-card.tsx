"use client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"


type ActionCardProps = {
  title: string;
  description?: string;
  actionChildren?: React.ReactNode;
  children?: React.ReactNode;
  className?: string
}
export default function ActionCard({ className, title, description, children, actionChildren }: ActionCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>{actionChildren}</CardAction>
      </CardHeader>
      <Separator />
      <CardContent>{children}</CardContent>
    </Card>
  )
}
