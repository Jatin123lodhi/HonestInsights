import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  
  export function AvatarComp({fallback}:{fallback?:string}) {
    return (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>{fallback ?? `CN`}</AvatarFallback>
      </Avatar>
    )
  }
  