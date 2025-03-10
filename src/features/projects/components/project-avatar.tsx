import { ClassValue } from "clsx";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ProjectAvatarProps = {
  image?: string;
  name: string;
  className?: ClassValue;
  fallbackClassName?: string;
};

const ProjectAvatar = ({
  name,
  className,
  image,
  fallbackClassName,
}: ProjectAvatarProps) => {
  if (image)
    return (
      <div
        className={cn("size-6 relative rounded-md overflow-hidden", className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );

  return (
    <Avatar className={cn("size-6 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "text-white bg-blue-600 font-semibold text-sm uppercase rounded-md",
          fallbackClassName
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProjectAvatar;
