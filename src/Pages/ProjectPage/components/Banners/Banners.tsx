import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import {
  Button,
  InlineNotification,
  Typography,
} from '@getsynapse/design-system';
import { DATE } from 'utils/constants';

export const OnHoldStatusBanner: React.FC<{
  message: string;
  handleOnClick?: () => void;
}> = ({ message, handleOnClick }) => (
  <InlineNotification
    variant='warning'
    hasCloseIcon={false}
    className='h-16 items-center mt-4'
    data-cy='on-hold-inline-notification'
  >
    {() => (
      <div className='flex justify-between items-center'>
        <span>{message}</span>
        {handleOnClick && (
          <Button
            color='warning'
            onClick={handleOnClick}
            data-cy='view-hold-reason-button'
          >
            {intl.get('PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.VIEW_DETAILS')}
          </Button>
        )}
      </div>
    )}
  </InlineNotification>
);

export const ClosedStatusBanner: React.FC<{
  handleOnClick: () => void;
  closedDate?: string | null;
}> = ({ handleOnClick, closedDate }) => (
  <InlineNotification
    variant='information'
    hasCloseIcon={false}
    className='bg-primary-lightest mt-4 items-center'
    data-cy='closed-inline-notification'
  >
    {() => (
      <div className='flex justify-between items-center'>
        <Typography variant='body' className='text-neutral-black'>
          {intl.get('PROJECT_DETAIL.CLOSE_PROJECT.CLOSED_PROJECT_BANNER')}
        </Typography>
        <div className='flex items-center'>
          <Typography
            variant='body'
            className='text-neutral mr-4'
            data-cy='closed-notification-date'
          >
            {closedDate &&
              moment(closedDate).format(DATE.FULL_MONTH_YEAR_FORMAT)}
          </Typography>
          <Button onClick={handleOnClick} data-cy='view-closed-details'>
            {intl.get('PROJECT_DETAIL.CLOSE_PROJECT.VIEW_DETAILS_BUTTON')}
          </Button>
        </div>
      </div>
    )}
  </InlineNotification>
);
