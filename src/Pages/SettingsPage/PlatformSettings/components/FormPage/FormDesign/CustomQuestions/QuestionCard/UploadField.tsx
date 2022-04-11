import intl from 'react-intl-universal';
import { Icon } from '@getsynapse/design-system';
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
    <div className='px-4 border rounded border-dashed py-2 px4 flex items-center'>
      <Icon name='cloud-upload' className='text-xl text-neutral mr-6' />
      <input
        placeholder={intl.get(
          'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.FILE.PLACEHOLDER'
        )}
        className='bg-transparent text-base placeholder-neutral focus:outline-none w-full text-neutral focus:text-neutral-black focus:bg-primary-lighter'
        defaultValue={get(questionData, 'data.placeholder')}
        onChange={(event) => updatePlaceholder(event.target.value)}
      />
    </div>
  );
};

export default NumberField;
