import { Fragment } from 'react';
import {
  Typography,
  FormItem,
  TextArea,
  Dropdown,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';

const FormInternalOnly = () => {
  return (
    <Fragment>
      <Typography variant='h5' className='mt-8 text-neutral-black'>
        {intl.get('SETTINGS_PAGE.FORMS.DESIGN.DEFAULT_FIELDS')}
      </Typography>
      <form className='grid grid-cols-2 gap-x-20 gap-y-6 pt-6'>
        <FormItem
          className='col-span-full col-start-1 col-end-1'
          label={intl.get('REQUEST_PAGE.L_D_SECTION.FIELDS.PRIORITY')}
          labelProps={{ required: true }}
        >
          <Dropdown
            disabled
            onChange={() => {}}
            options={[]}
            values={[]}
            triggerProps={{
              className: 'h-10',
              placeholder: intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.SELECT_PRIORITY'
              ),
            }}
          />
        </FormItem>

        <FormItem
          className='row-start-2 row-end-2'
          label={intl.get('REQUEST_PAGE.L_D_SECTION.FIELDS.EFFORT')}
        >
          <TextArea
            disabled
            value={''}
            onChange={() => {}}
            textAreaProps={{
              'data-testid': 'team-description_input',
              className: 'h-30',
              placeholder: intl.get('SETTINGS_PAGE.FORMS.DESIGN.ENTER_EFFORTS'),
            }}
          />
        </FormItem>

        <FormItem
          className='row-start-2 row-end-2'
          label={intl.get('REQUEST_PAGE.L_D_SECTION.FIELDS.COST')}
        >
          <TextArea
            disabled
            value={''}
            onChange={() => {}}
            textAreaProps={{
              'data-testid': 'team-description_input',
              className: 'h-30',
              placeholder: intl.get('SETTINGS_PAGE.FORMS.DESIGN.ENTER_COSTS'),
            }}
          />
        </FormItem>

        <FormItem
          className='row-start-3 row-end-3'
          label={intl.get('REQUEST_PAGE.L_D_SECTION.FIELDS.COMMENTS')}
        >
          <TextArea
            disabled
            value={''}
            onChange={() => {}}
            textAreaProps={{
              'data-testid': 'team-description_input',
              className: 'h-30',
              placeholder: intl.get(
                'SETTINGS_PAGE.FORMS.DESIGN.ENTER_COMMENTS'
              ),
            }}
          />
        </FormItem>
      </form>
    </Fragment>
  );
};

export default FormInternalOnly;
