import { useEffect, useMemo, useCallback, useState } from 'react';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import FormDetailsTabs from './FormDetailsTabs';
import FormFooterButtons from './FormFooterButtons';
import { REQUEST_TYPE, PATHS, SLICE_STATUS } from 'utils/constants';
import {
  getLDUsers,
  selectLDUsers,
} from 'state/UsersManagement/usersManagementSlice';
import { createForm, selectFormStatus } from 'state/Forms/formSlice';
import { selectOrganizationId, selectUserId } from 'state/User/userSlice';
import {
  displayNotification,
  setNotificationText,
  setNotificationTimeout,
  setNotificationVariant,
} from 'state/InlineNotification/inlineNotificationSlice';
import { RequestQuestion } from 'utils/customTypes';

const NewForm = () => {
  const dispatch = useDispatch();
  const ldUsersSelector = useSelector(selectLDUsers);
  const organizationId = useSelector(selectOrganizationId);
  const userId = useSelector(selectUserId);
  const formStatus = useSelector(selectFormStatus);
  const [currentTab, setCurrentTab] = useState(0);
  const [newForm, setNewForm] = useState({});
  const history = useHistory();
  const [formQuestions, setFormQuesions] = useState<RequestQuestion[]>([]);

  useEffect(() => {
    dispatch(getLDUsers());
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

  const canSubmit = useMemo(() => {
    if (
      get(newForm, 'title') &&
      get(newForm, 'request_type') &&
      get(newForm, 'form_description')
    ) {
      return true;
    } else {
      return false;
    }
  }, [newForm]);

  const handleTabChange = useCallback((tab: number) => {
    setCurrentTab(tab);
  }, []);

  const handleChangeField = useCallback(
    (value: string | string[] | boolean, path: string) => {
      setNewForm((prev) => ({ ...prev, [path]: value }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (userId && organizationId) {
      await dispatch(
        createForm({
          ...newForm,
          form_creator_id: userId,
          organizationId,
          data: { published: false },
          questions: formQuestions,
        })
      );
    }
    if (formStatus === SLICE_STATUS.IDLE) {
      dispatch(
        setNotificationText(
          intl.get('SETTINGS_PAGE.FORMS.FORM_CREATED_SUCCESS')
        )
      );
      dispatch(setNotificationVariant('success'));
      dispatch(setNotificationTimeout(4000));
      dispatch(displayNotification());
    }
    history.push(PATHS.SETTINGS);
  }, [
    userId,
    organizationId,
    formStatus,
    history,
    dispatch,
    newForm,
    formQuestions,
  ]);

  const handleCancel = useCallback(() => {
    history.push(PATHS.SETTINGS);
  }, [history]);

  return (
    <div className='h-full flex flex-col'>
      <PageTitle
        titleComponent={`${intl.get('ENTITIES.REQUEST_FORM', {
          num: 2,
        })} / ${intl.get('SETTINGS_PAGE.FORMS.ADD_FORM')}`}
        className='sticky top-0 left-0 right-0 bg-neutral-lightest z-10'
      />
      <main className='mt-4 mx-6 flex-grow flex space-x-4 bg-neutral-white'>
        <div className='flex-grow h-full overflow-y-auto px-4 py-3.5 mb-20'>
          <FormDetailsTabs
            formObj={newForm}
            handleChangeField={handleChangeField}
            ldUsers={ldUsers}
            requestTypeOptions={requestTypeOptions}
            onTabChange={handleTabChange}
            currentTab={currentTab}
            formQuestions={formQuestions}
            setFormQuestions={setFormQuesions}
          />
        </div>
      </main>
      <FormFooterButtons
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onSave={handleSave}
        onCancel={handleCancel}
        canSubmit={canSubmit}
        isNew
      />
    </div>
  );
};

export default NewForm;
