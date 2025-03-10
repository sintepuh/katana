import { SortDirection } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

const ColumnFilterIcon = ({ sort }: { sort: false | SortDirection }) => {
  if (sort === "asc") return <ArrowDown className="ml-2 h-4 w-4" />;

  if (sort === "desc") return <ArrowUp className="ml-2 h-4 w-4 " />;

  return <ArrowUpDown className="ml-2 h-4 w-4" />;
};

export default ColumnFilterIcon;
