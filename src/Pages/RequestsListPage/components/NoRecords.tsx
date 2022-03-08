import { ReactNode } from 'react';
import classnames from 'classnames';
import emptyProjectsTable from 'assets/icons/empty-projects.svg';

const RenderNoRecords = ({
  imageSrc,
  caption,
  children,
  dataCy,
  className,
}: {
  imageSrc?: any;
  caption: string;
  children?: ReactNode;
  dataCy?: string;
  className?: string;
}) => {
  let defaultIsmageToShow = emptyProjectsTable;
  let captionToUse: string | undefined = caption;

  return (
    <div
      data-cy={dataCy}
      className={classnames(
        'bg-neutral-white flex justify-center items-center border-t-0',
        { 'h-99': !className },
        className
      )}
    >
      <div className='flex flex-col'>
        <img
          className='m-auto self-center'
          src={imageSrc || defaultIsmageToShow}
          alt='React Logo'
        />

        <span className='m-auto mt-2 self-center text-base text-neutral-dark'>
          {captionToUse}
        </span>

        {children && children}
      </div>
    </div>
  );
};

export default RenderNoRecords;
