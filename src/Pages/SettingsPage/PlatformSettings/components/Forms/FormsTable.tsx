import { Fragment, useState, MouseEvent } from 'react';
import {
  Table,
  Tag,
  TableOperationHeader,
  OverflowMenu,
  OverflowMenuItem,
} from '@getsynapse/design-system';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import moment from 'moment';
import { useHistory, Link } from 'react-router-dom';
import { Form, SortingOrderType, SortingType } from 'utils/customTypes';
import {
  DATE,
  FORMS_FILTER_OPTIONS,
  PATHS,
  FORMS_TABLE_OPTIONS,
} from 'utils/constants';
import SortingArrows from 'Molecules/SortingArrows';
import EmptyForms from './EmptyForms';
import UserAvatar from 'Atoms/UserAvatar';
import DuplicateFormModal from './DuplicateFormModal';
import DeleteFormModal from './DeleteFormModal';

type FormsTableProps = {
  forms: Form[];
  onSearch: (title: string) => void;
  onSort: (sorting: SortingOrderType) => void;
  sorting: SortingOrderType;
  onDuplicate: (title: string, formId: string, redirect: boolean) => void;
  onDelete: (formId: string) => void;
};
const FormsTable = ({
  forms,
  onSearch,
  onSort,
  sorting,
  onDuplicate,
  onDelete,
}: FormsTableProps) => {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [modalData, setModalData] = useState<{
    formName?: string;
    formId: string;
    openOption: string;
    isPublished?: boolean;
  }>({
    formId: '',
    openOption: '',
  });
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

  const handleMenuSelect = (
    option: typeof FORMS_TABLE_OPTIONS[number],
    form: Form
  ) => {
    switch (option) {
      case FORMS_TABLE_OPTIONS[0]:
        setModalData({
          formName: get(form, 'title'),
          formId: get(form, 'id') || '',
          openOption: FORMS_TABLE_OPTIONS[0],
        });
        break;
      case FORMS_TABLE_OPTIONS[1]:
        setModalData({
          formId: get(form, 'id') || '',
          openOption: FORMS_TABLE_OPTIONS[1],
          isPublished: get(form, 'data.published'),
        });
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <DuplicateFormModal
        {...modalData}
        isOpen={modalData.openOption === FORMS_TABLE_OPTIONS[0]}
        onClose={() =>
          setModalData((prevData) => ({ ...prevData, openOption: '' }))
        }
        onDuplicate={onDuplicate}
      />
      <DeleteFormModal
        {...modalData}
        isOpen={modalData.openOption === FORMS_TABLE_OPTIONS[1]}
        onClose={() =>
          setModalData((prevData) => ({ ...prevData, openOption: '' }))
        }
        onDelete={onDelete}
      />
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
              {},
            ],
          },
          rows:
            forms.length > 0
              ? forms.map((form) => ({
                  id: form.id,
                  'data-cy': `form-table__row-${form.id}`,
                  className: 'cursor-pointer',
                  onClick: (event: any) => {
                    event.preventDefault();
                    event.stopPropagation();
                    history.push(
                      `${PATHS.SETTINGS}${PATHS.FORM_PAGE}/${form.id}`
                    );
                  },
                  cells: [
                    {
                      content: (
                        <Link
                          to={`${PATHS.SETTINGS}${PATHS.FORM_PAGE}/${form.id}`}
                        >
                          <span>{get(form, 'title') || '-'}</span>
                        </Link>
                      ),
                    },
                    { content: get(form, 'form_description') || '-' },
                    {
                      content:
                        intl.get(
                          `REQUEST_PAGE.LEFT_PANEL.REQUEST_TYPE.${get(
                            form,
                            'request_type'
                          )}`
                        ) || '-',
                    },
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
                    {
                      onClick: (e: MouseEvent<HTMLDivElement>) =>
                        e.stopPropagation(),
                      content: (
                        <OverflowMenu
                          menuButtonProps={{ 'data-cy': 'form-actions_menu' }}
                        >
                          {FORMS_TABLE_OPTIONS.map((option) => (
                            <OverflowMenuItem
                              key={option}
                              onSelect={() => handleMenuSelect(option, form)}
                              data-cy={option}
                            >
                              {intl.get(
                                `SETTINGS_PAGE.FORMS.TABLE_MENU.${option}`
                              )}
                            </OverflowMenuItem>
                          ))}
                        </OverflowMenu>
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
