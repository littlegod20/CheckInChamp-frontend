import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CustomSelect = ({
  val,
  handleChange,
  options,
  i,
}: {
  val: string;
  handleChange: (i: number, type: string, value: string) => void;
  options?: string[];
  i: number;
}) => {
  return (
    <>
      <ShadcnSelect
        value={val}
        onValueChange={(value) => handleChange(i, "type", value)}
      >
        <SelectTrigger className="w-1/3">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {options &&
            options.length > 0 &&
            options.map((item, index) => (
              <SelectItem
                key={index}
                value={item.split(" ").join("-").toLowerCase()}
              >
                {item}
              </SelectItem>
            ))}
        </SelectContent>
      </ShadcnSelect>
    </>
  );
};

export default CustomSelect;
