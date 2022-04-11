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
  selectAvailableLicenses,
  inviteUser,
  getAllUsers,
  allUsers,
} from 'state/UsersManagement/usersManagementSlice';
import UserDetailsSection from './components/UserDetailsSection';
import {
  PATHS,
  SLICE_STATUS,
  USER_STATUS,
  USER_TYPES,
  LICENSE_TIER,
} from 'utils/constants';
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
import { selectOrganizationLicense } from 'state/Organization/organizationSlice';
import { License } from 'utils/customTypes';
import NotifyUserModal from './components/NotifyUserModal';

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
  const orgUsers = useSelector(allUsers);
  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [userUpdatedFields, setUserUpdatedFields] = useState<
    Partial<AllUsersType>
  >({});
  const [erros, setErrors] = useState<objKeyAsString>({});
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const userRole: 'user' | 'admin' | undefined = 'user';
  const newUser = userType ? true : false;
  const LicenseData: License = useSelector(selectOrganizationLicense);
  const availableLicenses = useSelector(selectAvailableLicenses);
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
            status:
              userType === USER_TYPES.L_D &&
              LicenseData.license_tier !== LICENSE_TIER.TRIAL &&
              availableLicenses < 1
                ? USER_STATUS.INVITED_DISABLED
                : USER_STATUS.INVITED,
            role: userRole,
            organization_id: organizationId,
            public_holidays_in_capacity_enabled: false,
          },
    [
      userId,
      newUser,
      userSelector,
      organizationId,
      userType,
      LicenseData,
      availableLicenses,
    ]
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

  const isEmailRepeated = useMemo<boolean>(
    () =>
      orgUsers.some(
        (orgUser) => orgUser.data.email === userCuurentData.data.email
      ),
    [orgUsers, userCuurentData.data.email]
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
    dispatch(getAllUsers());
  }, [dispatch]);

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

  const showSuccessBanner = useCallback(() => {
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
  }, [dispatch, history, newUser]);

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
    let updatedUser;
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
      updatedUser = await dispatch(
        newUser
          ? addUser(userUpdatedFields)
          : updateUser({ userId, updateFields: userUpdatedFields })
      );
      setNewUserId(get(updatedUser, 'payload.id'));
    }
    if (teamId) {
      dispatch(
        assignUserToLearningTeam({
          userId: newUser ? get(updatedUser, 'payload.id') : userId,
          teamId,
        })
      );
    }
    if (newUser && userUpdatedFields.status === USER_STATUS.INVITED) {
      setIsNotifyModalOpen(true);
    } else {
      showSuccessBanner();
    }
  }, [
    dispatch,
    erros,
    user.data.email,
    userCuurentData,
    userId,
    userUpdatedFields,
    newUser,
    showSuccessBanner,
  ]);

  const sendUserInvitation = () => {
    dispatch(
      inviteUser({
        userId: newUserId,
        email: userUpdatedFields.data?.email!,
        firstName: userUpdatedFields.data?.firstName!,
      })
    );
    showSuccessBanner();
  };

  const closeNotifyModal = () => {
    setIsNotifyModalOpen(false);
    showSuccessBanner();
  };

  return (
    <div className='h-full flex flex-col'>
      <NotifyUserModal
        isOpen={isNotifyModalOpen}
        closeModal={closeNotifyModal}
        inviteUser={sendUserInvitation}
      />
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
            disableSave={disableSave || isEmailRepeated}
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
