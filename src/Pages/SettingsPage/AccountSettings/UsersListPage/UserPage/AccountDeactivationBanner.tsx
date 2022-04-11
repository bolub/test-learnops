import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { InlineNotification, Typography } from '@getsynapse/design-system';
import { DATE } from 'utils/constants';

const AccountDeactivationBanner: React.FC<{
  closedDate?: string | null;
}> = ({ closedDate }) => {
  return (
    <InlineNotification
      variant='warning'
      className='mt-4 mx-4'
      hasCloseIcon={false}
    >
      {() => (
        <div className='flex justify-between'>
          <Typography className='text-warning-dark'>
            {intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.DISABLE_ACCOUNT')}
          </Typography>
          {closedDate && (
            <Typography className='text-neutral-dark'>
              {moment(closedDate).utc().format(DATE.SHORT_FORMAT)}
            </Typography>
          )}
        </div>
      )}
    </InlineNotification>
  );
};

export default AccountDeactivationBanner;
