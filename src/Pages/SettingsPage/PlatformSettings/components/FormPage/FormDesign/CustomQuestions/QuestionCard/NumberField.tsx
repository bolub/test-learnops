import intl from 'react-intl-universal';
import { NumericInput } from '@getsynapse/design-system';
import { debounce } from 'lodash';
import { QuestionsProps } from '../Question';
import { get } from 'lodash';

export const NumberField = ({
  questionData,
  changeQuestionData,
}: QuestionsProps) => {
  const updatePlaceholder = debounce((value) => {
    changeQuestionData('data.placeholder', value, questionData.id);
  }, 500);

  return (
    <div className='relative'>
      <input
        placeholder={intl.get(
          'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.PLACEHOLDER'
        )}
        className='text-base absolute inset-0 bg-transparent px-4 focus:outline-none z-10 placeholder-neutral-light text-neutral-light focus:text-neutral-black'
        defaultValue={get(questionData, 'data.placeholder')}
        onChange={(event) => updatePlaceholder(event.target.value)}
      />
      <NumericInput readOnly />
    </div>
  );
};

export default NumberField;
