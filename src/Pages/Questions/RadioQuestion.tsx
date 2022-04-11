import { ChangeEvent, useMemo } from 'react';
import { RadioGroup, FormItem } from '@getsynapse/design-system';
import { intakeQuestionWrapper, radioOption } from 'utils/customTypes';

const RadioQuestion = ({
  question,
  className,
  handler,
  disabled,
}: intakeQuestionWrapper) => {
  const optionsData = useMemo(
    () =>
      question.data.value.options.map((data: radioOption) => {
        if (data.text) {
          return { label: data.text, value: data.id };
        }
        return null;
      }),
    [question.data.value.options]
  );

  return (
    <>
      {question.data.label?.trim() && optionsData.length && (
        <FormItem
          label={question.data.label}
          component='div'
          className={className}
          labelProps={{ required: question.data.isRequired }}
        >
          <RadioGroup
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
      )}
    </>
  );
};

export default RadioQuestion;
