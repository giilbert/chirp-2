import { useDescription, useTsController } from "@ts-react/form";
import { Input, type InputProps } from "../input";

export const TextField = (props: InputProps) => {
  const {
    field: { onChange, value },
    error,
  } = useTsController<string>();

  const { label, placeholder } = useDescription();

  return (
    <div className="mt-4">
      <label htmlFor={label}>{label}</label>
      <Input
        type="text"
        id={label}
        className={"mt-2"}
        value={value ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
      {error && <p className="mt-1 text-red-500">{error.errorMessage}</p>}
    </div>
  );
};
