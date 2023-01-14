import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { RiEdit2Line } from "react-icons/ri";
import { ProfileFormData, profileFormSchema } from "../../share/schema";
import { AppForm } from "./AppForm";
import { AppTextarea } from "./AppTextarea";
import { AppTextInput } from "./AppTextInput";

type Props = {
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
  submitText: string;
  defaultValues?: ProfileFormData;
  isSubmitting?: boolean;
};
export const UserProfileForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  submitText,
  defaultValues = { name: "", profile: "" },
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues,
    resolver: zodResolver(profileFormSchema),
  });

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitText={submitText}
      submitIcon={RiEdit2Line}
      isSubmitting={isSubmitting}
    >
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <AppTextInput
            required
            label="ユーザー名"
            error={errors.name?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="profile"
        render={({ field }) => (
          <AppTextarea
            label="自己紹介"
            error={errors.profile?.message}
            autosize
            minRows={4}
            {...field}
          />
        )}
      />
    </AppForm>
  );
};
