import {
  InlineNotification,
  Button,
  Typography,
} from '@getsynapse/design-system';
import { Fragment, useState } from 'react';
import intl from 'react-intl-universal';
import ConfirmCancellationModal from './ConfirmCancellationModal';
import { Request } from 'utils/customTypes';

type Props = {
  requestData: Request;
};

const PendingCancellationBanner = ({ requestData }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Fragment>
      <ConfirmCancellationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        requestData={requestData}
      />
      <InlineNotification
        variant='warning'
        hasCloseIcon={false}
        data-cy='pending-cancellation-banner'
        className='mt-4'
      >
        {() => {
          return (
            <div className='flex justify-between items-start'>
              <div>
                <Typography className='text-warning-dark'>
                  {intl.get('REQUEST_PAGE.PENDING_CANCELLATION_BANNER.TITLE')}
                </Typography>
                <Typography className='text-warning-dark'>
                  {intl.get('REQUEST_PAGE.PENDING_CANCELLATION_BANNER.BODY')}
                </Typography>
              </div>
              <Button
                onClick={() => {
                  setIsModalOpen(true);
                }}
                color='warning'
                size='small'
                data-cy='pending-cancellation-button'
              >
                {intl.get('REQUEST_PAGE.PENDING_CANCELLATION_BANNER.BUTTON')}
              </Button>
            </div>
          );
        }}
      </InlineNotification>
    </Fragment>
  );
};

export default PendingCancellationBanner;
