import { useEffect, useMemo } from 'react';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import Loader from 'Molecules/Loader/Loader';
import FormDetailsTabs from './FormDetailsTabs';
import { SLICE_STATUS, REQUEST_TYPE } from 'utils/constants';
import { getForm, selectForm, selectFormStatus } from 'state/Forms/formSlice';
import {
  getLDUsers,
  selectLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import {
  selectBusinessTeamsForDropdown,
  getBusinessTeams,
} from 'state/BusinessTeams/businessTeamsSlice';

const FormPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();
  const form = useSelector(selectForm);
  const formStatus = useSelector(selectFormStatus);
  const ldUsersSelector = useSelector(selectLDUsers);
  const businessTeamOptions = useSelector(selectBusinessTeamsForDropdown);

  useEffect(() => {
    if (formId) {
      dispatch(getForm(formId));
    }
  }, [formId, dispatch]);

  useEffect(() => {
    dispatch(getLDUsers());
    dispatch(getBusinessTeams());
  }, [dispatch]);

  const requestTypeOptions = useMemo(() => {
    return REQUEST_TYPE.map((type) => ({
      value: type,
      label: intl.get(`REQUEST_PAGE.LEFT_PANEL.REQUEST_TYPE.${type}`),
    }));
  }, []);

  const ldUsers = useMemo(
    () =>
      ldUsersSelector.map((user) => {
        return {
          label: `${user.data.firstName} ${user.data.lastName}`,
          avatar: {
            imageSrc: user.avatar_url,
            initial: `${user.data.firstName.charAt(
              0
            )}${user.data.lastName.charAt(0)}`,
          },
          value: user.id,
        };
      }),
    [ldUsersSelector]
  );

  return (
    <div className='overflow-y-hidden h-full'>
      <PageTitle
        titleComponent={`${intl.get('ENTITIES.REQUEST_FORM', {
          num: 2,
        })} / ${get(form, 'title', '')}`}
        className='sticky top-0 left-0 right-0 bg-neutral-lightest'
      />
      {formStatus === SLICE_STATUS.IDLE && get(form, 'id', '') ? (
        <FormDetailsTabs
          formObj={form}
          handleChangeField={() => {}}
          ldUsers={ldUsers}
          requestTypeOptions={requestTypeOptions}
          businessTeamOptions={businessTeamOptions}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default FormPage;
