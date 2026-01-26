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
import { ChevronDown, ChevronUp } from "lucide-react"
import { useCallback, useState } from "react";


type CardProps = {
  title?: string;
  children?: React.ReactNode;
  description?: string;
  collapsible?: boolean;
  className?: string
  defaultCollapsed?: boolean;
}
export default function CardComposition({ className, title, description, children, defaultCollapsed, collapsible }: CardProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsible && defaultCollapsed);
  const toggleCollapse = useCallback(() => collapsible && setIsCollapsed(prev => !prev), [collapsible])
  return (
    <Card className={className}>
      { title &&
        <CardHeader onClick={toggleCollapse}>
          <CardTitle className={`text-xl flex justify-between items-center ${ collapsible ? "cursor-pointer" : ""}`}>
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
          <CardAction>
            {collapsible && ( isCollapsed ? <ChevronUp /> : <ChevronDown />)}
          </CardAction>
          {!isCollapsed && <Separator />}
        </CardHeader>
      }
      { !isCollapsed && 
        <CardContent>
          {children}
        </CardContent>
      }
    </Card>
  )
}
