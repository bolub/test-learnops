import { Typography, FlyoutMenu, Button } from '@getsynapse/design-system';
import { useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import {
  RequestQuestion,
  dropdownOption,
  checkboxOption,
  radioOption,
  QuestionTypes,
} from 'utils/customTypes';
import { Question } from './Question';
import { cloneDeep, set } from 'lodash';
import textIcon from 'assets/icons/text-icon.svg';
import dropdownIcon from 'assets/icons/dropdown-icon.svg';
import radioIcon from 'assets/icons/radio-icon.svg';
import checkboxIcon from 'assets/icons/checkbox-icon.svg';
import toggleIcon from 'assets/icons/toggle-icon.svg';
import urlIcon from 'assets/icons/url-icon.svg';
import numericIcon from 'assets/icons/numeric-icon.svg';
import dateIcon from 'assets/icons/date-icon.svg';
import uploadIcon from 'assets/icons/upload-icon.svg';
import rangeIcon from 'assets/icons/range-icon.svg';
import { REQUEST_SECTIONS } from 'utils/constants';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import classnames from 'classnames';

type CustomQuestionsProps = {
  formQuestions: RequestQuestion[];
  setFormQuestions: React.Dispatch<React.SetStateAction<RequestQuestion[]>>;
  section: typeof REQUEST_SECTIONS[keyof typeof REQUEST_SECTIONS];
};

export const CustomQuestions = ({
  formQuestions,
  setFormQuestions,
  section,
}: CustomQuestionsProps) => {
  const [isSortEnabled, setIsSortEnabled] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const questions = useMemo(
    () =>
      formQuestions.filter(
        (question: RequestQuestion) => question && question.section === section
      ),
    [formQuestions, section]
  );

  const changeQuestionData = (
    path: string,
    value:
      | dropdownOption[]
      | radioOption[]
      | checkboxOption[]
      | string
      | boolean
      | number,
    questionId: string
  ) => {
    if (path === 'remove') {
      const updatedFormQuestions = formQuestions?.filter(
        (question) => question.id !== questionId
      );
      setFormQuestions(updatedFormQuestions!);
    } else {
      const updatedFormQuestions = formQuestions?.map((question) => {
        if (question.id === questionId) {
          const questionClone = cloneDeep(question);
          set(questionClone, path, value);
          return questionClone;
        }
        return question;
      });
      setFormQuestions(updatedFormQuestions!);
    }
  };

  const flyoutOptionClasses = 'hover:text-primary hover:bg-neutral-lightest';

  const addNewQuestion = (questionType: QuestionTypes) => {
    const newQuestion = {
      type: questionType,
      data: {
        value: '',
        label: '',
        isRequired: true,
      },
      id: uuidv4(),
      section: section,
    };
    setFormQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFormQuestions((questions) => {
        const questionsIds = questions.map((question) => question.id);
        const oldIndex = questionsIds.indexOf(active.id);
        const newIndex = questionsIds.indexOf(over.id);
        return arrayMove(questions, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className='flex flex-col mt-4'>
      <Button
        variant='tertiary'
        disabled={questions.length < 2}
        iconName='reorder-four-outline'
        onClick={() => setIsSortEnabled((prevState) => !prevState)}
        className={classnames('self-end', {
          'bg-neutral-lightest text-primary-dark': isSortEnabled,
        })}
      >
        {intl.get('SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.REORDER')}
      </Button>
      <Typography className='mt-2'>
        {intl.get('SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.TITLE')}
      </Typography>
      <div className='mb-3'>
        <Typography variant='caption' className='text-neutral'>
          {intl.get('SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.CAPTION1')}
        </Typography>
        <Typography variant='caption' weight='medium' className='text-neutral'>
          {intl.get('SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.CAPTION2')}
        </Typography>
      </div>
      {questions && (
        <div className='grid grid-cols-2 gap-x-20 gap-y-6'>
          {isSortEnabled ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={questions} strategy={rectSortingStrategy}>
                {questions?.map((question) => (
                  <Question
                    questionData={question}
                    key={question.id}
                    changeQuestionData={changeQuestionData}
                    isSortEnabled={isSortEnabled}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            questions?.map((question) => (
              <Question
                questionData={question}
                key={question.id}
                changeQuestionData={changeQuestionData}
              />
            ))
          )}
        </div>
      )}
      <FlyoutMenu
        className='mt-6 mb-10'
        options={[
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.TEXT'),
              src: textIcon,
              onClick: () => addNewQuestion('customTextArea'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.TEXT'),
          },
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.DROPDOWN'),
              src: dropdownIcon,
              onClick: () => addNewQuestion('dropdown'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.DROPDOWN'),
          },
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.RADIO_BUTTON'),
              src: radioIcon,
              onClick: () => addNewQuestion('radio'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.RADIO_BUTTON'),
          },
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.CHECKBOX'),
              src: checkboxIcon,
              onClick: () => addNewQuestion('checkbox'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.CHECKBOX'),
          },
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.TOGGLE'),
              src: toggleIcon,
              onClick: () => addNewQuestion('toggle'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.TOGGLE'),
          },
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.URL'),
              src: urlIcon,
              onClick: () => addNewQuestion('url'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.URL'),
          },
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.NUMBER'),
              src: numericIcon,
              onClick: () => addNewQuestion('number'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.NUMBER'),
          },
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.DATE'),
              src: dateIcon,
              onClick: () => addNewQuestion('date'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.DATE'),
          },
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.FILE'),
              src: uploadIcon,
              onClick: () => addNewQuestion('file'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.FILE'),
          },
          {
            icon: {
              description: intl.get('QUSTOM_QUESTIONS.RANGE'),
              src: rangeIcon,
              onClick: () => addNewQuestion('range'),
              className: flyoutOptionClasses,
            },
            label: intl.get('QUSTOM_QUESTIONS.RANGE'),
          },
        ]}
        label={intl.get(
          'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.ADD_QUESTION'
        )}
      />
    </div>
  );
};

export default CustomQuestions;
