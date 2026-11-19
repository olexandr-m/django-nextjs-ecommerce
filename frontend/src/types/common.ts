export type ValidationErrors = Record<string, string[]>;

export interface ApiResponse<T = undefined> {
  status: number;
  message: string;
  data?: T;
  errors?: ValidationErrors;
}

export interface LayoutLinks {
  id: number | string;
  path?: string;
  labelKey?: string;
  label?: string;
  children?: LayoutLinks[];
  className?: string;
  icon?: React.ComponentType<React.ComponentProps<"svg">>;
}
