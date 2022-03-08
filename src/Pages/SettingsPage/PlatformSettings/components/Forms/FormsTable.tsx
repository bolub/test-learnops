import { Fragment, useState } from 'react';
import { Table, Tag, TableOperationHeader } from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import moment from 'moment';
import { Form, SortingOrderType, SortingType } from 'utils/customTypes';
import { DATE, FORMS_FILTER_OPTIONS } from 'utils/constants';
import SortingArrows from 'Molecules/SortingArrows';
import EmptyForms from './EmptyForms';
import UserAvatar from 'Atoms/UserAvatar';

type FormsTableProps = {
  forms: Form[];
  onSearch: (title: string) => void;
  onSort: (sorting: SortingOrderType) => void;
  sorting: SortingOrderType;
};
const FormsTable = ({ forms, onSearch, onSort, sorting }: FormsTableProps) => {
  const [search, setSearch] = useState('');
  const status: Record<string, string> = {
    true: intl.get('SETTINGS_PAGE.FORMS.PUBLISHED'),
    false: intl.get('SETTINGS_PAGE.FORMS.UN_PUBLISHED'),
  };

  const statusColor: Record<string, string> = {
    true: 'positive',
    false: 'warning',
  };

  const onTitleSearch = (value: string) => {
    setSearch(value);
    onSearch(value);
  };

  const handleSort = (orderByParam: string, order: SortingType) => {
    onSort({ order, orderBy: orderByParam });
  };

  return (
    <Fragment>
      <TableOperationHeader
        inputValue={search}
        setInputValue={onTitleSearch}
        className='border-0 bg-neutral-white'
        hideFilterButton
        hideExportButton
      />
      <Table
        className='w-full'
        canSelectRows={false}
        data={{
          headData: {
            headCells: [
              {
                content: (
                  <div className='flex justify-between'>
                    {intl.get('SETTINGS_PAGE.FORMS.FORM_TITLE')}
                    <SortingArrows
                      name={FORMS_FILTER_OPTIONS.TITLE}
                      handleSort={handleSort}
                      order={sorting.order}
                      orderBy={sorting.orderBy}
                    />
                  </div>
                ),
              },
              {
                content: intl.get(
                  'ORG_SETTINGS_PAGE.BUSINESS_TEAMS.TABLE.DESCRIPTION'
                ),
              },
              {
                content: (
                  <div className='flex justify-between'>
                    {intl.get('SETTINGS_PAGE.FORMS.REQUEST_TYPE')}
                    <SortingArrows
                      name={FORMS_FILTER_OPTIONS.REQUEST_TYPE}
                      handleSort={handleSort}
                      order={sorting.order}
                      orderBy={sorting.orderBy}
                    />
                  </div>
                ),
              },
              {
                content: (
                  <div className='flex justify-between'>
                    {intl.get('SETTINGS_PAGE.FORMS.FORM_CREATOR')}
                    <SortingArrows
                      name={FORMS_FILTER_OPTIONS.FORM_CREATOR}
                      handleSort={handleSort}
                      order={sorting.order}
                      orderBy={sorting.orderBy}
                    />
                  </div>
                ),
              },
              {
                content: (
                  <div className='flex justify-between'>
                    {intl.get(
                      'ORG_SETTINGS_PAGE.BUSINESS_TEAMS.TABLE.CREATION_DATE'
                    )}
                    <SortingArrows
                      name={FORMS_FILTER_OPTIONS.CREATION_DATE}
                      handleSort={handleSort}
                      order={sorting.order}
                      orderBy={sorting.orderBy}
                    />
                  </div>
                ),
              },
              {
                content: (
                  <div className='flex justify-between'>
                    {intl.get('SETTINGS_PAGE.FORMS.LAST_UPDATE')}
                    <SortingArrows
                      name={FORMS_FILTER_OPTIONS.LAST_UPDATE}
                      handleSort={handleSort}
                      order={sorting.order}
                      orderBy={sorting.orderBy}
                    />
                  </div>
                ),
              },
              {
                content: (
                  <div className='flex justify-between'>
                    {intl.get('REQUESTS_LIST_PAGE.TABLE.HEAD.STATUS')}
                    <SortingArrows
                      name={FORMS_FILTER_OPTIONS.STATUS}
                      handleSort={handleSort}
                      order={sorting.order}
                      orderBy={sorting.orderBy}
                    />
                  </div>
                ),
              },
            ],
          },
          rows:
            forms.length > 0
              ? forms.map((form) => ({
                  id: form.id,
                  cells: [
                    { content: get(form, 'title') || '-' },
                    { content: get(form, 'description') || '-' },
                    { content: get(form, 'request_type') || '-' },
                    {
                      content: get(form, 'formCreator', false) ? (
                        <div className='flex'>
                          <UserAvatar user={get(form, 'formCreator')} />
                          <span className='ml-2.5'>
                            {`${get(
                              form,
                              'formCreator.data.firstName',
                              ''
                            )} ${get(form, 'formCreator.data.lastName', '')}`}
                          </span>
                        </div>
                      ) : (
                        '-'
                      ),
                    },
                    {
                      content: moment(form.createdAt).format(DATE.LONG_FORMAT),
                    },
                    {
                      content: moment(form.updatedAt).format(DATE.LONG_FORMAT),
                    },
                    {
                      content: (
                        <Tag
                          label={status[get(form, 'data.published', false)]}
                          color={
                            statusColor[get(form, 'data.published', false)]
                          }
                        />
                      ),
                    },
                  ],
                }))
              : [
                  {
                    id: '0',
                    cells: [
                      {
                        colSpan: 7,
                        className: 'bg-neutral-white',
                        content: <EmptyForms />,
                      },
                    ],
                  },
                ],
        }}
      />
    </Fragment>
  );
};

export default FormsTable;
