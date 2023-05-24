import { createTsForm } from "@ts-react/form";
import { z } from "zod";
import { TextField } from "./text-field";

const mappings = [[z.string(), TextField]] as const;

export const TsForm = createTsForm(mappings);
