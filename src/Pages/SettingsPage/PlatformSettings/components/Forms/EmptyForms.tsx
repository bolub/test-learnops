import { Typography, Button } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import emptyForms from 'assets/images/empty-forms.svg';

const EmptyForms = () => (
  <div className='flex flex-col justify-center items-center h-96'>
    <img src={emptyForms} alt={intl.get('SETTINGS_PAGE.FORMS.NO_FORMS')} />
    <Typography
      variant='body'
      className='mt-4 text-neutral-black w-full text-center'
    >
      {intl.get('SETTINGS_PAGE.FORMS.CREATE_FORMS')}
    </Typography>
    <Button className='mt-3 mx-auto' size='small' onClick={() => {}}>
      {intl.get('PROJECTS_LIST_PAGE.TABLE.GET_STARTED')}
    </Button>
  </div>
);

export default EmptyForms;
