import { useEffect, useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllUsers,
  getAllUsers,
  updateUsersPagination,
  setUsersOrder,
} from 'state/UsersManagement/usersManagementSlice';
import UsersTable from './UsersTable';
import Pagination from 'Organisms/Pagination';

const UsersListPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const fetchUsersWithPagination = useCallback(
    (params) => {
      dispatch(updateUsersPagination(params));
    },
    [dispatch]
  );

  const handleSort = (orderByParam: string[], order: 'desc' | 'asc') => {
    dispatch(setUsersOrder({ order, orderBy: orderByParam }));
  };

  return (
    <Fragment>
      <UsersTable data={users.data} handleSort={handleSort} />
      <Pagination total={users.total} onChange={fetchUsersWithPagination} />
    </Fragment>
  );
};

export default UsersListPage;
