import { useToast } from "@/components/shared/toast";
import { useRegisterMutation } from "../slices/auth-api-slice";
import { useRouter } from "@/lib/i18n/routing";
import { TRegisterSchema } from "../schemas";
import { extractErrorMessage, setServerFieldErrors } from "@/utils";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";

export function useRegister() {
  const t = useTranslations("auth.register");
  const { showToast } = useToast();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const handleRegister = async (
    values: TRegisterSchema,
    setError: UseFormSetError<TRegisterSchema>,
    reset: () => void,
  ) => {
    try {
      await registerUser(values).unwrap();
      showToast(t("activation_sent"), "success");
      router.push("/login");
      reset();
    } catch (e) {
      setServerFieldErrors(e, setError);
      showToast(extractErrorMessage(e), "error");
    }
  };

  return { handleRegister, isLoading };
}
