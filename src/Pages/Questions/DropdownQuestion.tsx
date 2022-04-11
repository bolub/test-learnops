import { FormItem, Dropdown } from '@getsynapse/design-system';
import {
  intakeQuestionWrapper,
  dropdownOption,
  Option,
} from 'utils/customTypes';
import get from 'lodash/get';
import { useMemo } from 'react';

const DropdownQuestion = ({
  question,
  className,
  handler,
  disabled,
}: intakeQuestionWrapper) => {
  const isMultiple = get(question, 'data.multiselect');
  const optionsData = useMemo(
    () =>
      question.data.value.items.map((data: dropdownOption) => {
        if (data.display) {
          return {
            label: data.display,
            value: data.value,
          };
        }
        return null;
      }),
    [question.data.value.items]
  );
  const dropdownValues = useMemo(() => {
    if (!isMultiple && question.data.value.value) {
      return [
        {
          label: question.data.value.value.display,
          value: question.data.value.value.value,
        },
      ];
    } else if (isMultiple && question.data.value.value?.length) {
      return question.data.value.value.map((value: dropdownOption) => ({
        label: value.display,
        value: value.value,
      }));
    } else {
      return [];
    }
  }, [isMultiple, question.data.value.value]);

  return (
    <>
      {question.data.label?.trim() && optionsData.length && (
        <FormItem
          label={question.data.label}
          component='div'
          className={className}
          labelProps={{ required: question.data.isRequired }}
        >
          <Dropdown
            options={optionsData}
            disabled={disabled}
            multiple={isMultiple}
            className=''
            onChange={(options: Option[]) =>
              handler(
                question,
                !isMultiple
                  ? {
                      value: get(options, 'value'),
                      display: get(options, 'label'),
                    }
                  : options.map((option) => ({
                      value: option.value,
                      display: option.label,
                    })),
                'data.value.value'
              )
            }
            values={dropdownValues}
            triggerProps={{
              placeholder: get(question, 'data.placeholder'),
              className: 'h-10',
            }}
          />
        </FormItem>
      )}
    </>
  );
};

export default DropdownQuestion;
