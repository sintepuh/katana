import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type MemberAvatarProps = {
  name: string;
  avatarUrl?: string;
  className?: string;
  fallbackClassName?: string;
  
};

const MemberAvatar = ({
  name,
  avatarUrl,
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  return (
    <Avatar
      className={cn(
        "size-5 transition border border-neutral-300 rounded-full",
        className
      )}
    >
      <AvatarImage src={avatarUrl} alt="avatar" />
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default MemberAvatar;
