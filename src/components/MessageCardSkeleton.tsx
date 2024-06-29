import { Skeleton } from "@/components/ui/skeleton"

export function MessageCardSkeleton() {
  return (
    <div className="flex items-center space-x-4 max-w-[620px] rounded-md border border-gray-300 p-4">
      <Skeleton className="h-12 w-12 rounded-full bg-gray-300" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-gray-300" />
        <Skeleton className="h-4 w-[200px] bg-gray-300" />
      </div>
    </div>
  )
}
