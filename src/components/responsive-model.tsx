import React from "react";
import { useMedia } from "react-use";
import { Dialog, DialogContent } from "./ui/dialog";
import { Drawer, DrawerContent } from "./ui/drawer";

type ResponsiveModelProps = {
  open: boolean;
  onOpen: (open: boolean) => void;
  children: React.ReactNode;
};

const ResponsiveModel = ({ children, onOpen, open }: ResponsiveModelProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={onOpen}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={onOpen}>
      <DrawerContent className="overflow-y-auto hide-scrollbar max-h-[85vh]">
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveModel;
