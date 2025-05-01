import { parseAsBoolean, useQueryState } from "nuqs";

export const useEditProfileModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "update-profile",
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
