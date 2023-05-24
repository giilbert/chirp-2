import { useDescription } from "@ts-react/form";
import { Input, InputProps } from "../input";

export const TextField = (props: InputProps) => {
  const { label, placeholder } = useDescription();

  return (
    <div>
      <label htmlFor={label}>{label}</label>
      <Input type="text" id={label} className="mt-2" {...props} />
    </div>
  );
};
