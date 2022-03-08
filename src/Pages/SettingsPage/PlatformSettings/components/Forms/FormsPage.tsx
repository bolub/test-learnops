import { Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getForms,
  selectFormsForTable,
  setPagination,
  setSearchParam,
  setSorting,
  formsSorting,
} from 'state/Forms/formSlice';
import { selectOrganizationId } from 'state/User/userSlice';
import { SortingOrderType } from 'utils/customTypes';
import Pagination from 'Organisms/Pagination';
import FormsTable from './FormsTable';

const FormsPage = () => {
  const dispatch = useDispatch();
  const organizationId = useSelector(selectOrganizationId);
  const forms = useSelector(selectFormsForTable);
  const sorting = useSelector(formsSorting);

  useEffect(() => {
    if (organizationId) {
      dispatch(getForms({ organizationId }));
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

  return (
    <Fragment>
      <FormsTable
        forms={forms.data}
        onSearch={onSearch}
        onSort={onSort}
        sorting={sorting}
      />
      <Pagination total={forms.total} onChange={updatePagination} />
    </Fragment>
  );
};

export default FormsPage;
