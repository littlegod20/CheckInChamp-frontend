import { FormTypes, StandUpConfigTypes } from "@/types/CardWithFormTypes";
import Select, { MultiValue } from "react-select";

interface MultitSelectProps {
  options: { value: string; label: string }[];
  handleSelect: (
    newValue: MultiValue<{ value: string; label: string }>,
    field: keyof FormTypes | keyof StandUpConfigTypes // Match parent's type
  ) => void;
  selectedValues: string[];
  field: keyof FormTypes | keyof StandUpConfigTypes; // Match parent's type
}

const MultitSelect = ({
  options,
  handleSelect,
  selectedValues,
  field,
}: MultitSelectProps) => {
  return (
    <Select
      isMulti
      options={options}
      onChange={(newValue) => handleSelect(newValue, field)}
      value={options.filter((option) => selectedValues.includes(option.value))}
      placeholder={`Select ${field}...`}
      className="react-select-container"
      classNamePrefix="react-select"
      closeMenuOnSelect={false}
    />
  );
};

export default MultitSelect;
