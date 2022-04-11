import { Typography } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import styles from './Loader.module.css';

const dotDefaultClassName =
  'animate-loader w-8 h-8 rounded-full border-2 border-neutral-white absolute';

const Loader = () => {
  return (
    <div className='w-64 mx-auto h-full flex flex-col relative justify-center'>
      <div className='w-full h-14'>
        <div
          className={classnames(dotDefaultClassName, 'bg-primary')}
          style={{ animationDelay: '0.5s' }}
        />

        <div
          className={classnames(dotDefaultClassName, 'bg-primary-light')}
          style={{ animationDelay: '0.4s' }}
        />

        <div
          className={classnames(dotDefaultClassName, 'bg-primary-lighter')}
          style={{ animationDelay: '0.3s' }}
        />

        <div
          className={classnames(dotDefaultClassName, 'bg-secondary-lighter')}
          style={{ animationDelay: '0.2s' }}
        />

        <div
          className={classnames(dotDefaultClassName, 'bg-secondary-light')}
          style={{ animationDelay: '0.1s' }}
        />

        <div
          className={classnames(dotDefaultClassName, 'bg-secondary')}
          style={{ animationDelay: '0s' }}
        />
      </div>

      <div className='w-full flex justify-center'>
        <Typography
          variant='h5'
          weight='medium'
          className={classnames('text-neutral-dark', styles.loadingText)}
        >
          {intl.get('LOADING')}
        </Typography>
      </div>
    </div>
  );
};

export default Loader;
