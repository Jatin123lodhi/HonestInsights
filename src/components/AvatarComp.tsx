import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  
  export function AvatarComp({fallback,source}:{fallback?:string,source?:string | undefined}) {
    return (
      <Avatar>
        <AvatarImage src={source ?? "https://github.com/shadcn.png"} alt="@shadcn" />
        <AvatarFallback>{fallback ?? `CN`}</AvatarFallback>
      </Avatar>
    )
  }
  