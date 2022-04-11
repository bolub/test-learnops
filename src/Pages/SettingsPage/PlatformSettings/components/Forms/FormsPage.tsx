import { Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import intl from 'react-intl-universal';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '@getsynapse/design-system';
import get from 'lodash/get';
import {
  getForms,
  selectFormsForTable,
  setPagination,
  setSearchParam,
  setSorting,
  formsSorting,
  duplicateForm,
  selectFormStatus,
  deleteForm,
} from 'state/Forms/formSlice';
import { selectOrganizationId, selectUserId } from 'state/User/userSlice';
import {
  displayNotification,
  setNotificationText,
  setNotificationTimeout,
  setNotificationVariant,
} from 'state/InlineNotification/inlineNotificationSlice';
import { SortingOrderType } from 'utils/customTypes';
import { PATHS, SLICE_STATUS } from 'utils/constants';
import Pagination from 'Organisms/Pagination';
import FormsTable from './FormsTable';

const FormsPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const organizationId = useSelector(selectOrganizationId);
  const formStatus = useSelector(selectFormStatus);
  const userId = useSelector(selectUserId);
  const forms = useSelector(selectFormsForTable);
  const sorting = useSelector(formsSorting);

  useEffect(() => {
    if (organizationId) {
      dispatch(getForms({ organizationId }));
      dispatch(setSearchParam(''));
    }
  }, [organizationId, dispatch]);

  const updatePagination = useCallback(
    (params) => {
      dispatch(setPagination(params));
    },
    [dispatch]
  );

  const onSearch = useCallback(
    (title: string) => {
      dispatch(setSearchParam(title));
    },
    [dispatch]
  );

  const onSort = useCallback(
    (sorting: SortingOrderType) => {
      dispatch(setSorting(sorting));
    },
    [dispatch]
  );

  const onDuplicate = useCallback(
    async (title: string, formId: string, redirect: boolean) => {
      if (userId) {
        const response = await dispatch(
          duplicateForm({ formId, title, creatorId: userId })
        );

        if (formStatus === SLICE_STATUS.IDLE) {
          dispatch(
            setNotificationText(
              intl.get('SETTINGS_PAGE.FORMS.FORM_CREATED_SUCCESS')
            )
          );
          dispatch(setNotificationVariant('success'));
          dispatch(setNotificationTimeout(4000));
          dispatch(displayNotification());
          if (redirect) {
            history.push(
              `${PATHS.SETTINGS}${PATHS.FORM_PAGE}/${get(
                response,
                'payload.id'
              )}`
            );
          }
        }
      }
    },
    [dispatch, formStatus, history, userId]
  );

  const onDelete = useCallback(
    async (formId: string) => {
      if (formId) {
        await dispatch(deleteForm(formId));

        if (formStatus === SLICE_STATUS.IDLE) {
          dispatch(
            setNotificationText(intl.get('SETTINGS_PAGE.FORMS.DELETE.SUCCESS'))
          );
          dispatch(setNotificationVariant('success'));
          dispatch(setNotificationTimeout(4000));
          dispatch(displayNotification());
        }
      }
    },
    [dispatch, formStatus]
  );

  return (
    <Fragment>
      <div className='relative'>
        <Link
          to={`${PATHS.SETTINGS}${PATHS.FORM_PAGE}`}
          className='absolute -top-11 right-0'
        >
          <Button data-cy='add-form_button'>
            {intl.get('SETTINGS_PAGE.FORMS.ADD_FORM')}
          </Button>
        </Link>
      </div>
      <FormsTable
        forms={forms.data}
        onSearch={onSearch}
        onSort={onSort}
        sorting={sorting}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
      <Pagination total={forms.total} onChange={updatePagination} />
    </Fragment>
  );
};

export default FormsPage;
