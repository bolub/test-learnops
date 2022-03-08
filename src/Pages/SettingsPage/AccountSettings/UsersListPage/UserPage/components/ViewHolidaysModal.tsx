import { Modal, Typography, Button } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import publicHolidaysImg from 'assets/images/public-holidays-modal.svg';
import { DATE } from 'utils/constants';
import moment from 'moment';
import { HolidaysType } from 'utils/customTypes';
import { Fragment, useState } from 'react';

type ViewHolidaysModalProps = {
  country: string;
  holidays?: HolidaysType[];
};

const ViewHolidaysModal = ({ country, holidays }: ViewHolidaysModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <Button
        variant='tertiary'
        className='relative -top-7 left-20'
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {intl.get(
          'SETTINGS_PAGE.USER_PAGE.CAPACITY_MANAGEMENT.PUBLIC_HOLIDAYS.VIEW_HOLIDAYS'
        )}
      </Button>
      <Modal
        title={`${intl.get(`COUNTRIES.${country}`)} ${intl.get(
          'SETTINGS_PAGE.USER_PAGE.VIEW_HOLIDAYS_MODAL.TITLE'
        )}`}
        closeModal={() => setIsOpen(false)}
        className='max-h-72'
        isOpen={isOpen}
        aria-label={intl.get(
          'SETTINGS_PAGE.USER_PAGE.VIEW_HOLIDAYS_MODAL.TITLE'
        )}
        size='medium'
        childrenClassName='max-h-136 w-extra pr-12'
      >
        <div>
          <img src={publicHolidaysImg} alt='' className='mb-1.5' />
          {holidays?.map((holiday, index) => (
            <div className='flex justify-between mt-1' key={index}>
              <Typography variant='body2' weight='medium' className=''>
                {holiday.name}
              </Typography>
              <Typography variant='body2'>
                {moment(new Date(holiday.date)).format(DATE.LONG_FORMAT)}
              </Typography>
            </div>
          ))}
        </div>
      </Modal>
    </Fragment>
  );
};

export default ViewHolidaysModal;
