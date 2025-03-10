import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateProjectModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-project",
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
