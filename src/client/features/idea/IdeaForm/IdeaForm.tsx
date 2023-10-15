import { IdeaDescriptionEditor } from "@/client/features/idea/IdeaDescriptionEditor/IdeaDescriptionEditor";
import { useIdeaDescriptionEditor } from "@/client/features/idea/useIdeaDescriptionEditor";
import { AppForm } from "@/client/ui/AppForm/AppForm";
import { IdeaFormData, ideaFormSchema } from "@/models/idea";
import { IdeaTag } from "@/models/ideaTag";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, MultiSelect, Space, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { TbFilePlus } from "react-icons/tb";

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
      submitIcon={TbFilePlus}
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
              nothingFoundMessage="タグが見つかりませんでした"
              error={errors.tags?.message}
              {...field}
            />
          );
        }}
      />
      <Input.Wrapper
        label="お題の説明"
        // tiptap(ProseMirror)はinput要素を使わないみたいなので・・・
        labelProps={{ htmlFor: undefined }}
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
