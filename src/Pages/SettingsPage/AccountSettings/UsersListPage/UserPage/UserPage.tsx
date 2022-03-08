import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Auth from '@aws-amplify/auth';
import {
  getSelectedUser,
  selectSelectedUser,
  resetSelectedUser,
  selectUserStatus,
  updateUser,
  assignUserToLearningTeam,
  addUser,
} from 'state/UsersManagement/usersManagementSlice';
import UserDetailsSection from './components/UserDetailsSection';
import { PATHS, SLICE_STATUS, USER_STATUS, USER_TYPES } from 'utils/constants';
import Loader from 'Molecules/Loader/Loader';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import intl from 'react-intl-universal';
import { get, set, isEqual } from 'lodash';
import UserPageHeader from './UserPageHeader';
import UserPageFooter from './UserPageFooter';
import { AllUsersType, LDUser, objKeyAsString } from 'utils/customTypes';
import { validateRequiredFields } from './helpers/validationHelper';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';
import { selectOrganizationId } from 'state/User/userSlice';

const UserPage = () => {
  const history = useHistory();
  const { userId, userType } = useParams<{
    userId: string;
    userType: 'business' | 'ld' | 'external' | undefined;
  }>();
  const dispatch = useDispatch();
  const userSelector = useSelector(selectSelectedUser);
  const userStatus = useSelector(selectUserStatus);
  const organizationId = useSelector(selectOrganizationId);
  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [userUpdatedFields, setUserUpdatedFields] = useState<
    Partial<AllUsersType>
  >({});
  const [erros, setErrors] = useState<objKeyAsString>({});
  const userRole: 'user' | 'admin' | undefined = 'user';
  const newUser = userType ? true : false;
  const user = useMemo(
    () =>
      !newUser
        ? userSelector
        : {
            data: {
              firstName: '',
              lastName: '',
              email: userId,
            },
            type: userType,
            status: USER_STATUS.INVITED,
            role: userRole,
            organization_id: organizationId,
            public_holidays_in_capacity_enabled: false,
          },
    [userId, newUser, userSelector, organizationId, userType]
  );

  const userCuurentData = useMemo(
    () => ({
      ...user,
      ...userUpdatedFields,
      data: {
        ...user.data,
        ...userUpdatedFields.data,
      },
    }),
    [user, userUpdatedFields]
  );

  const pageTitle = newUser
    ? intl.get('ADD_USER.ADD_USER_MODAL.TITLE', {
        op: userType !== USER_TYPES.EXTERNAL ? 1 : 2,
        userType: intl
          .get(`USERS_PAGE.TABLE.USER_TYPE.${userType?.toUpperCase()}`)
          .toLowerCase(),
      })
    : `${intl.get('SETTINGS_PAGE.USER_PAGE.TITLE')}
  /${get(user, 'data.firstName')} ${get(user, 'data.lastName')}`;

  useEffect(() => {
    if (userId) {
      dispatch(getSelectedUser(userId));
    }
    return () => {
      dispatch(resetSelectedUser());
    };
  }, [userId, dispatch]);

  useEffect(() => {
    if (!newUser) {
      if (!isEqual(user, userCuurentData) && disableSave) {
        setDisableSave(false);
      } else if (isEqual(user, userCuurentData) && !disableSave) {
        setDisableSave(true);
      }
    }
  }, [user, userCuurentData, disableSave, newUser]);

  const handleChangeField = (
    inputValue: string | string[] | boolean | number,
    targetPath: string
  ) => {
    let newData: Partial<AllUsersType> = {};
    newData = set(newData, targetPath, inputValue);
    setUserUpdatedFields((prevState) => {
      if (newData.data) {
        newData = {
          data: { ...user.data, ...prevState.data, ...newData.data },
        };
      }
      if (!newUser && Object.keys(erros).length) {
        setErrors(
          validateRequiredFields({ ...user, ...prevState, ...newData })
        );
      } else if (newUser) {
        const newUserErrors = validateRequiredFields({
          ...user,
          ...prevState,
          ...newData,
        });
        if (!Object.keys(newUserErrors).length && disableSave) {
          setDisableSave(false);
        } else if (Object.keys(newUserErrors).length && !disableSave) {
          setDisableSave(true);
        }
        return { ...user, ...prevState, ...newData };
      }
      return { ...prevState, ...newData };
    });
  };

  const onUpdate = useCallback(async () => {
    let newErrors: objKeyAsString = {};
    if (!Object.keys(erros).length) {
      newErrors = validateRequiredFields(userCuurentData);
      setErrors(newErrors);
    }
    dispatch(setNotificationTimeout(4000));
    if (Object.keys(erros).length || Object.keys(newErrors).length) {
      dispatch(setNotificationVariant('error'));
      dispatch(
        setNotificationText(
          intl.get('SETTINGS_PAGE.USER_PAGE.ERRORS.INLINE_NOTFICATION')
        )
      );
      dispatch(displayNotification());
      return;
    }
    let teamId = '';
    if (get(userUpdatedFields, 'registeredLearningTeams[0]')) {
      teamId = get(userUpdatedFields, 'registeredLearningTeams[0].id');
      delete (userUpdatedFields as Partial<LDUser>).registeredLearningTeams;
    }
    if (Object.keys(userUpdatedFields).length) {
      if (!newUser) {
        const email = get(userUpdatedFields, 'data.email');
        if (email && email !== user.data.email) {
          const authUser = await Auth.currentAuthenticatedUser();
          await Auth.updateUserAttributes(authUser, { email });
        }
      }
      const updatedUser = await dispatch(
        newUser
          ? addUser(userUpdatedFields)
          : updateUser({ userId, updateFields: userUpdatedFields })
      );
      if (teamId) {
        await dispatch(
          assignUserToLearningTeam({
            userId: get(updatedUser, 'payload.id'),
            teamId,
          })
        );
      }
    }
    history.push(PATHS.SETTINGS);
    dispatch(setNotificationVariant('success'));
    dispatch(
      setNotificationText(
        !newUser
          ? intl.get('SETTINGS_PAGE.USER_PAGE.USER_UPDATED')
          : intl.get('ADD_USER.USER_ADDED')
      )
    );
    dispatch(displayNotification());
  }, [
    dispatch,
    erros,
    history,
    user.data.email,
    userCuurentData,
    userId,
    userUpdatedFields,
    newUser,
  ]);

  return (
    <div className='h-full flex flex-col'>
      <PageTitle
        titleComponent={pageTitle}
        className='sticky top-0 left-0 right-0'
      />
      {(userStatus !== SLICE_STATUS.LOADING && get(user, 'id')) || newUser ? (
        <Fragment>
          {!newUser && <UserPageHeader accountStatus={get(user, 'status')} />}
          <UserDetailsSection
            userObj={user}
            handleChangeField={handleChangeField}
            errors={erros}
          />
          <UserPageFooter
            disableSave={disableSave}
            onUpdate={onUpdate}
            newUser={newUser}
          />
        </Fragment>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default UserPage;
