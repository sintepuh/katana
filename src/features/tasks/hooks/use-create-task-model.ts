import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateTaskModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
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
