import React from 'react';
import intl from 'react-intl-universal';
import AuthImage from 'assets/images/auth-image.png';
import { ReactComponent as Logo } from 'assets/icons/logo.svg';
import {
  tailwindOverride,
  Typography,
  useLink,
} from '@getsynapse/design-system';
import { FOOTER } from 'utils/constants';

const AuthPage: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const externalLink = useLink(true);

  return (
    <div className='flex h-screen'>
      <div className='absolute ml-8'>
        <Logo width='130' height='130' />
      </div>

      <div className='hidden md:block bg-primary-lighter w-7/12 bg-no-repeat bg-center bg-70% px-8'>
        <div className='flex flex-col justify-center align-center md:px-20 lg:px-24 w-full'>
          <Typography
            variant='h3'
            className='font-bold text-primary-dark font-landing'
          >
            {intl.get('LOGIN_PAGE.LEFT_PANEL.TITLE')}
          </Typography>
          <Typography className='mt-4 font-landing'>
            {intl.get('LOGIN_PAGE.LEFT_PANEL.PROMPT')}
          </Typography>

          <img alt='Authentication' src={AuthImage} />
        </div>
      </div>
      <div className='w-full md:w-5/12 flex flex-col justify-between items-center pt-44'>
        <main className={tailwindOverride('flex flex-col w-96', className)}>
          {children}
        </main>

        <Typography variant='caption' className='pb-4 text-neutral-black'>
          {FOOTER.COPYRIGHT}
          <a
            className={externalLink}
            href={FOOTER.LINK}
            target='_blank'
            rel='noreferrer'
          >
            {FOOTER.COMPANY_NAME}
          </a>
        </Typography>
      </div>
    </div>
  );
};

export default AuthPage;
