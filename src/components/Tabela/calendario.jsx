"use client"


import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function DatePickerDemo({data, setData}) {

  const handleDataChange = (novaData) => {
    console.log('Nova data: ', format(novaData, "dd/MM/yyyy"))
    setData(format(novaData, "dd/MM/yyyy"));
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-full border-0 text-left flex justify-center",
            !data && "text-muted-foreground"
          )}
        >
          <span className="text-white text-center">{format(data, "dd/MM/yyyy")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-[#337B5B]">
        <Calendar
          mode="single"
          selected={data}
          onSelect={setData}
          initialFocusedDate={data}
        />
      </PopoverContent>
    </Popover>
  )
}