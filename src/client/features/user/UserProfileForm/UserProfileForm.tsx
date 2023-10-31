import { AppForm } from "@/client/ui/AppForm/AppForm";
import { ProfileFormData, profileFormSchema } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch, Textarea, TextInput } from "@mantine/core";
import { SvgEdit } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";

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
  defaultValues = { name: "", profile: "", welcomeMessageHidden: false },
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
      submitIcon={SvgEdit}
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
      <Controller
        control={control}
        name="welcomeMessageHidden"
        render={({ field: { value, ...others } }) => (
          <Switch
            mt="xl"
            label="ホーム画面のWelcomeメッセージを非表示にする"
            {...others}
            checked={value}
          />
        )}
      />
    </AppForm>
  );
};
