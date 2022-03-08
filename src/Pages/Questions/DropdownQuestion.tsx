import { FormItem, Dropdown } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';

const DropdownQuestion = ({
  question,
  className,
  handler,
  disabled,
}: intakeQuestionWrapper) => {
  type OptionData = { label: string; value: any };
  const optionsData = question.data.value.items.map((data: any) => {
    return { label: data.display, value: data.display };
  });
  return (
    <FormItem
      label={question.data.label}
      component='div'
      className={className}
      labelProps={{ required: question.data.isRequired }}
    >
      <Dropdown
        options={optionsData}
        disabled={disabled}
        onChange={(option: OptionData) =>
          handler(question, option.value, 'data.value.value')
        }
        values={
          question.data.value.value
            ? [
                {
                  label: question.data.value.value,
                  value: question.data.value.value,
                },
              ]
            : []
        }
      />
    </FormItem>
  );
};

export default DropdownQuestion;
