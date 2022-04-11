import React from 'react';
import intl from 'react-intl-universal';
import { InlineNotification, Typography } from '@getsynapse/design-system';

const LicenseBanner: React.FC<{}> = () => {
  return (
    <InlineNotification variant='warning' className='mt-4' hasCloseIcon={false}>
      {() => (
        <div className='flex justify-between -ml-2.5'>
          <Typography variant='body2' className='text-warning-dark'>
            {intl.getHTML('LICENSE.LICENSE_INACTIVE')}
          </Typography>
        </div>
      )}
    </InlineNotification>
  );
};

export default LicenseBanner;
