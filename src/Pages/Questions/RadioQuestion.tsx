import { ChangeEvent } from 'react';
import { RadioGroup, FormItem } from '@getsynapse/design-system';
import { intakeQuestionWrapper } from 'utils/customTypes';

const RadioQuestion = ({
  question,
  className,
  handler,
  disabled,
}: intakeQuestionWrapper) => {
  const optionsData = question.data.value.options.map((data: any) => {
    return { label: data.text, value: data.id };
  });
  return (
    <FormItem
      label={question.data.label}
      component='div'
      className={className}
      labelProps={{ required: question.data.isRequired }}
    >
      <RadioGroup
        horizontal={true}
        checkOption='defaultChecked'
        name={question.data.label}
        options={optionsData}
        inputProps={{
          onChange: (event: ChangeEvent<HTMLInputElement>) =>
            handler(question, event.target.value, 'data.value.value'),
        }}
        checked={question.data.value.value}
        disabled={disabled}
      />
    </FormItem>
  );
};

export default RadioQuestion;
