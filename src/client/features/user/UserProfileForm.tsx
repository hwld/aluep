import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { RiEdit2Line } from "react-icons/ri";
import { ProfileFormData, profileFormSchema } from "../../../share/schema";
import { AppForm } from "../../ui/AppForm";

type Props = {
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
  submitText: string;
  defaultValues?: ProfileFormData;
  isLoading?: boolean;
};
export const UserProfileForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  submitText,
  defaultValues = { name: "", profile: "" },
  isLoading,
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
      isSubmitting={isLoading}
    >
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextInput
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
          <Textarea
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
