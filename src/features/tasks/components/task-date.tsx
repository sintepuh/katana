import { differenceInDays, format } from 'date-fns'
import { ru } from "date-fns/locale";

import { cn } from '@/lib/utils'

type TaskDateProps = {
  value: string
  className?: string
} 

const TaskDate = ({ value, className }:TaskDateProps) => {
  const today = new Date()
  const endDate = new Date(value)
  const diffTime = differenceInDays(endDate, today)

  let textColor = "text-muted-foreground"

  if(diffTime < 3){
    textColor = "text-red-500"
  }else if(diffTime < 7){
    textColor = "text-orange-500"
  } else if(diffTime < 14){
    textColor = "text-yellow-500"
  }
  
  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>{format(value, "PPP", { locale: ru })}</span>
    </div>
  )
}

export default TaskDate