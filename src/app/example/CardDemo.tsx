"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useCallback, useState } from "react";


type CardDemoProps = {
  title: string;
  children?: React.ReactNode;
  description?: string;
  collapsible?: boolean;
  className?: string
  defaultCollapsed?: boolean;
}
export function CardDemo({ className, title, description, children, defaultCollapsed, collapsible }: CardDemoProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsible && defaultCollapsed);
  const toggleCollapse = useCallback(() => collapsible && setIsCollapsed(prev => !prev), [collapsible])
  return (
    <Card className={className}>
      <CardHeader onClick={toggleCollapse}>
        <div>
          <CardTitle className={`text-xl flex justify-between items-center ${ collapsible ? "cursor-pointer" : ""}`}>
            <span>
              {title}
            </span>
            {collapsible &&
              <span>
                { isCollapsed ? <ChevronUp /> : <ChevronDown />}
              </span>
            }
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
        
        {!isCollapsed && <Separator />}
      </CardHeader>
      { !isCollapsed && 
        <CardContent>
          {children}
        </CardContent>
      }
    </Card>
  )
}
