import { useState, Fragment } from 'react';
import { IconButton } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import classnames from 'classnames';
import upArrow from 'assets/icons/up-arrow.svg';
import downArrow from 'assets/icons/down-arrow.svg';

type UsersTableHeadProps = {
  handleSort: (orderByParam: string[], order: 'desc' | 'asc') => void;
};

const UsersTableHead = ({ handleSort }: UsersTableHeadProps) => {
  const [order, setOrder] = useState<'' | 'desc' | 'asc'>('');
  const headCellsClassNames = 'py-3 font-semibold';

  return [
    {
      content: <Fragment></Fragment>,
      className: 'w-4',
    },
    {
      content: (
        <div className='flex items-center relative'>
          <div className='flex flex-col absolute right-0'>
            <IconButton
              description={intl.get('REQUESTS_LIST_PAGE.TABLE.SORT.ASC')}
              onClick={() => {
                handleSort(['data.firstName', 'data.lastName'], 'asc');
                setOrder('asc');
              }}
              hasASize={false}
              src={upArrow}
              className='mb-0.75'
              iconClassname={classnames('w-1.5 h-1', {
                'text-primary-dark': order === 'asc',
              })}
            />
            <IconButton
              description={intl.get('REQUESTS_LIST_PAGE.TABLE.SORT.DESC')}
              onClick={() => {
                handleSort(['data.firstName', 'data.lastName'], 'desc');
                setOrder('desc');
              }}
              hasASize={false}
              src={downArrow}
              iconClassname={classnames('w-1.5 h-1', {
                'text-primary-dark': order === 'desc',
              })}
            />
          </div>
          {intl.get('USERS_PAGE.TABLE.HEAD.USER_NAME')}
        </div>
      ),
      className: classnames(headCellsClassNames, {
        'bg-primary-lighter': order !== '',
      }),
    },
    {
      content: <div>{intl.get('USERS_PAGE.TABLE.HEAD.USER_TYPE')}</div>,
      className: headCellsClassNames,
    },
    {
      content: <div>{intl.get('USERS_PAGE.TABLE.HEAD.TEAM')}</div>,
      className: headCellsClassNames,
    },
    {
      content: <div>{intl.get('USERS_PAGE.TABLE.HEAD.JOB_TITLE')}</div>,
      className: headCellsClassNames,
    },
    {
      content: <div>{intl.get('USERS_PAGE.TABLE.HEAD.EMPLOYMENT_TYPE')}</div>,
      className: headCellsClassNames,
    },
    {
      content: <div>{intl.get('USERS_PAGE.TABLE.HEAD.LOCATION')}</div>,
      className: headCellsClassNames,
    },
    {
      content: <div>{intl.get('USERS_PAGE.TABLE.HEAD.HOURLY_RATE')}</div>,
      className: headCellsClassNames,
    },
    {
      content: <div>{intl.get('USERS_PAGE.TABLE.HEAD.ACCOUNT_STATUS')}</div>,
      className: headCellsClassNames,
    },
  ];
};

export default UsersTableHead;
