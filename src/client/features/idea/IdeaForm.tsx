import { IdeaDescriptionEditor } from "@/client/features/idea/IdeaDescriptionEditor/IdeaDescriptionEditor";
import { useIdeaDescriptionEditor } from "@/client/features/idea/IdeaDescriptionEditor/useIdeaDescriptionEditor";
import { AppForm } from "@/client/ui/AppForm";
import { IdeaFormData, ideaFormSchema } from "@/models/idea";
import { IdeaTag } from "@/models/ideaTag";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, MultiSelect, Space, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { MdPostAdd } from "react-icons/md";

type Props = {
  allTags: IdeaTag[];
  onSubmit: (data: IdeaFormData) => void;
  onCancel: () => void;
  submitText: string;
  defaultValues?: IdeaFormData;
  isLoading?: boolean;
};

// お題の作成と更新のためのForm
export const IdeaForm: React.FC<Props> = ({
  allTags,
  onSubmit,
  onCancel,
  submitText,
  defaultValues = {
    title: "",
    descriptionHtml: "",
    tags: [],
  },
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IdeaFormData>({
    defaultValues,
    resolver: zodResolver(ideaFormSchema),
  });

  const editor = useIdeaDescriptionEditor({
    content: defaultValues.descriptionHtml,
    onUpdate: ({ editor }) => {
      setValue("descriptionHtml", editor.getHTML(), { shouldValidate: true });
    },
  });

  return (
    <AppForm
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      submitText={submitText}
      submitIcon={MdPostAdd}
      isSubmitting={isLoading}
    >
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <TextInput
            required
            label="タイトル"
            error={errors.title?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="tags"
        render={({ field }) => {
          return (
            <MultiSelect
              data={allTags.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              label="タグ"
              searchable
              nothingFound="タグが見つかりませんでした"
              error={errors.tags?.message}
              {...field}
            />
          );
        }}
      />
      <Input.Wrapper
        label="お題の説明"
        error={errors.descriptionHtml?.message}
        required
      >
        <IdeaDescriptionEditor
          editor={editor}
          error={!!errors.descriptionHtml}
        />
        <Space mt="5px" />
      </Input.Wrapper>
    </AppForm>
  );
};
