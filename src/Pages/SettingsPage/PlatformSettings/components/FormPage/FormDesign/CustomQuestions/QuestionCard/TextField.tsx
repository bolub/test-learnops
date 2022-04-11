import intl from 'react-intl-universal';
import { Input } from '@getsynapse/design-system';
import { debounce, get } from 'lodash';
import { QuestionsProps } from '../Question';

export const TextField = ({
  questionData,
  changeQuestionData,
}: QuestionsProps) => {
  const updatePlaceholder = debounce((value) => {
    changeQuestionData('data.placeholder', value, questionData.id);
  }, 500);

  return (
    <Input
      defaultValue={get(questionData, 'data.placeholder')}
      placeholder={intl.get(
        'SETTINGS_PAGE.FORMS.DESIGN.CUSTOM_QUESTIONS.PLACEHOLDER'
      )}
      className='text-neutral-light focus:text-neutral-black'
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updatePlaceholder(event.target.value)
      }
    />
  );
};

export default TextField;
