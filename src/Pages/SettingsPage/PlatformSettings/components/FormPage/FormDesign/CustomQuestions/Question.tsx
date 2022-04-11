import {
  FormLabel,
  IconButton,
  OverflowMenu,
  OverflowMenuItem,
  Toggle,
  useElevation,
} from '@getsynapse/design-system';
import classnames from 'classnames';
import intl from 'react-intl-universal';
import {
  RequestQuestion,
  dropdownOption,
  checkboxOption,
  radioOption,
} from 'utils/customTypes';
import { useState } from 'react';
import Dropdown from './QuestionCard/Dropdown';
import TextField from './QuestionCard/TextField';
import NumberField from './QuestionCard/NumberField';
import ToggleField from './QuestionCard/ToggleField';
import RangeField from './QuestionCard/RangeField';
import RadioButtons from './QuestionCard/RadioButtons';
import Checkboxes from './QuestionCard/Checkboxes';
import DateField from './QuestionCard/DateField';
import UploadField from './QuestionCard/UploadField';
import debounce from 'lodash/debounce';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type QuestionsProps = {
  questionData: RequestQuestion;
  changeQuestionData: (
    path: string,
    value:
      | dropdownOption[]
      | radioOption[]
      | checkboxOption[]
      | string
      | boolean
      | number,
    questionId: string
  ) => void;
  isSortEnabled?: boolean;
};

type qnsComponentMap = {
  [key: string]: (props: QuestionsProps) => JSX.Element;
};

export const Question = ({
  questionData,
  changeQuestionData,
  isSortEnabled,
}: QuestionsProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: questionData.id });
  const originalTransform = CSS.Transform.toString(transform);
  const modifiedTransform = originalTransform
    ? originalTransform.substring(0, originalTransform.indexOf('scaleY')) +
      ' scaleY(1)'
    : undefined;
  const style = {
    transform: modifiedTransform,
    transition,
  };

  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [questionLabel, setQuestionLabel] = useState(questionData.data.label);

  const changeQuestionLabel = debounce((value: string) => {
    setQuestionLabel(value);
    changeQuestionData('data.label', value, questionData.id);
  }, 500);

  const changeIsRequired = (checked: boolean) => {
    changeQuestionData('data.isRequired', checked, questionData.id);
  };

  const removeQuestion = () => {
    changeQuestionData('remove', '', questionData.id);
  };

  const questionComponent: qnsComponentMap = {
    dropdown: Dropdown,
    customTextArea: TextField,
    number: NumberField,
    url: TextField,
    toggle: ToggleField,
    range: RangeField,
    radio: RadioButtons,
    checkbox: Checkboxes,
    date: DateField,
    file: UploadField,
  };
  const QuestionCard = questionComponent[questionData.type];

  return (
    <div
      ref={isSortEnabled ? setNodeRef : null}
      style={isSortEnabled ? style : undefined}
      className={classnames('self-start', {
        'flex items-center relative': isSortEnabled,
        'z-200000': isDragging,
      })}
    >
      {isSortEnabled && (
        <IconButton
          {...listeners}
          {...attributes}
          name='reorder-four-outline'
          description={intl.get(
            'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.DRAG_HANDLE'
          )}
          className='mr-2'
        />
      )}
      <div
        className={classnames('w-full', {
          [`${useElevation(1)} p-4 rounded`]: isSortEnabled,
          [`${useElevation(4)} bg-primary-lightest border-l-2 border-primary`]:
            isDragging,
        })}
      >
        <div className='flex w-full justify-between items-center mb-2'>
          {!isEditingLabel && (
            <FormLabel
              required={questionData.data.isRequired}
              className={classnames('w-full', 'mb-0', {
                'text-neutral': !questionData.data.label,
              })}
              htmlFor={`input-${questionData.id}`}
            >
              {questionLabel
                ? questionLabel
                : intl.get(
                    'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.QUESTION_LABEL'
                  )}
            </FormLabel>
          )}
          <input
            className={classnames(
              'bg-primary-lighter focus:outline-none text-sm font-semibold leading-4 w-full',
              { 'opacity-0': !isEditingLabel }
            )}
            onChange={(event) => changeQuestionLabel(event.target.value)}
            defaultValue={questionLabel}
            id={`input-${questionData.id}`}
            onFocus={() => setIsEditingLabel(true)}
            onBlur={() => setIsEditingLabel(false)}
          />
          <div className='flex items-center'>
            <Toggle
              label={intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.REQUIRED'
              )}
              labelProps={{ className: 'mb-0 mr-2 font-normal' }}
              className='flex items-center mr-2'
              isSmall
              id={`required-toggle${questionData.id}`}
              checked={questionData.data.isRequired}
              onChange={(event) => changeIsRequired(event.target.checked)}
            />
            <OverflowMenu>
              <OverflowMenuItem onSelect={removeQuestion}>
                {intl.get('DELETE')}
              </OverflowMenuItem>
            </OverflowMenu>
          </div>
        </div>
        <QuestionCard
          questionData={questionData}
          changeQuestionData={changeQuestionData}
        />
      </div>
    </div>
  );
};

export default Question;
