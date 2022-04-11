import intl from 'react-intl-universal';
import { Range } from '@getsynapse/design-system';
import { debounce, get } from 'lodash';
import { QuestionsProps } from '../Question';

export const RangeField = ({
  questionData,
  changeQuestionData,
}: QuestionsProps) => {
  const chnageRange = debounce((value, path) => {
    const numberValue = Number(value);
    if (Number.isInteger(numberValue)) {
      changeQuestionData(path, numberValue, questionData.id);
    }
  }, 500);

  return (
    <div>
      <Range className='mt-10' />
      <div className='flex align-center justify-between relative z-10 h-6'>
        <input
          className='placeholder-neutral-light focus:outline-none text-sm leading-4 text-neutral focus:bg-primary-lighter'
          onChange={(event) =>
            chnageRange(event.target.value, 'data.value.from')
          }
          defaultValue={get(questionData, 'data.value.from')}
          placeholder={intl.get(
            'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.RANGE.MIN_VALUE_PLACEHOLDER'
          )}
        />
        <input
          dir='rtl'
          className='placeholder-neutral-light focus:outline-none text-sm leading-4 text-neutral focus:bg-primary-lighter'
          onChange={(event) => chnageRange(event.target.value, 'data.value.to')}
          defaultValue={get(questionData, 'data.value.to')}
          placeholder={intl.get(
            'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.RANGE.MAX_VALUE_PLACEHOLDER'
          )}
        />
      </div>
    </div>
  );
};

export default RangeField;
