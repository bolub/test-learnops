import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { InlineNotification, Typography } from '@getsynapse/design-system';
import classnames from 'classnames';
import { DATE } from 'utils/constants';
export const AccountDeactivationBanner: React.FC<{
  closedDate?: string | null;
}> = ({ closedDate }) => {
  return (
    <InlineNotification
      variant='warning'
      className={classnames(
        'relative',
        'left-0',
        'z-10',
        'flex-grow',
        'mt-4',
        'mx-4'
      )}
      hasCloseIcon={false}
    >
      {() => (
        <div className='flex justify-between'>
          <Typography>
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
