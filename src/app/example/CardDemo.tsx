import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ChevronDown } from "lucide-react"


type CardDemoProps = {
  title: string;
  children?: React.ReactNode;
  description?: string;
  className?: string
}
export function CardDemo({ className, title, description, children }: CardDemoProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
          <ChevronDown />
        <Separator />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
