import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateWorkspaceModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-workspace",
    parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    })
  );

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    setIsOpen,
  };
};
