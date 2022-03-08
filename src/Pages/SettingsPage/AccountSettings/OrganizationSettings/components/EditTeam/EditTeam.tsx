import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { PATHS, USER_TYPES, SLICE_STATUS } from 'utils/constants';
import {
  getCurrentBusinessTeam,
  selectCurrentBusinessTeam,
  selectBussinessTeamStatus,
  resetCurrentBusinessTeam,
  updateBusinessTeam,
} from 'state/BusinessTeams/businessTeamsSlice';
import {
  getCurrentLearningTeam,
  selectCurrentLearningTeam,
  selectLearningTeamStatus,
  resetCurrentLearningTeam,
  updateLearningTeam,
  getLearningTeams,
} from 'state/LearningTeams/learningTeamsSlice';
import PageTitle from 'Molecules/PageTitle/PageTitle';
import intl from 'react-intl-universal';
import { get, isEqual, set } from 'lodash';
import { Fragment, useState, useMemo } from 'react';
import EditTeamHeader from './EditTeamHaeder';
import EditTeamFooter from './EditTeamFooter';
import Loader from 'Molecules/Loader/Loader';
import BasicInformation from './BasicInformation';
import TeamMembers from './TeamMembers';
import { BusinessTeam, LearningTeam } from 'utils/customTypes';
import {
  displayNotification,
  setNotificationText,
  setNotificationVariant,
  setNotificationTimeout,
} from 'state/InlineNotification/inlineNotificationSlice';
import { getLDUsers } from 'state/UsersManagement/usersManagementSlice';

const EditTeam = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { teamType, teamId } =
    useParams<{ teamType: string; teamId: string }>();

  const [disableSave, setDisableSave] = useState<boolean>(true);
  const [teamUpdatedFields, setTeamUpdatedFields] = useState<
    Partial<BusinessTeam> | Partial<LearningTeam>
  >({});
  const [hasError, setHasError] = useState<boolean>(false);

  const isBusinessTeam = teamType === USER_TYPES.BUSINESS;
  const team = useSelector(
    isBusinessTeam ? selectCurrentBusinessTeam : selectCurrentLearningTeam
  );
  const teamStatus = useSelector(
    isBusinessTeam ? selectBussinessTeamStatus : selectLearningTeamStatus
  );
  const teamName = isBusinessTeam
    ? get(team, 'title', '')
    : get(team, 'name', '');
  const teamMembers = isBusinessTeam
    ? get(team, 'users')
    : get(team, 'ldTeamMembers');

  const teamCurrentData = useMemo(
    () => ({
      ...team,
      ...teamUpdatedFields,
    }),
    [team, teamUpdatedFields]
  );

  useEffect(() => {
    dispatch(getLDUsers());
    dispatch(getLearningTeams());
  }, [dispatch]);

  useEffect(() => {
    if (isBusinessTeam) {
      dispatch(getCurrentBusinessTeam(teamId));
    } else {
      dispatch(getCurrentLearningTeam(teamId));
    }
    return () => {
      if (isBusinessTeam) {
        dispatch(resetCurrentBusinessTeam());
      } else {
        dispatch(resetCurrentLearningTeam());
      }
    };
  }, [isBusinessTeam, dispatch, teamId]);

  useEffect(() => {
    if (!isEqual(team, teamCurrentData) && disableSave) {
      setDisableSave(false);
    } else if (isEqual(team, teamCurrentData) && !disableSave) {
      setDisableSave(true);
    }
  }, [team, teamCurrentData, disableSave]);

  const checkTeamName = (
    newData: Partial<BusinessTeam> | Partial<LearningTeam>
  ) => {
    if (
      (isBusinessTeam && get(newData, 'title')) ||
      (!isBusinessTeam && get(newData, 'name'))
    ) {
      setHasError(false);
      return false;
    } else {
      setHasError(true);
      return true;
    }
  };

  const handleChangeField = (
    inputValue: string | string[] | boolean,
    targetPath: string
  ) => {
    let newData: Partial<BusinessTeam> | Partial<LearningTeam> = {};
    newData = set(newData, targetPath, inputValue);
    if (hasError) {
      checkTeamName(newData);
    }
    setTeamUpdatedFields((prevState) => {
      return { ...prevState, ...newData };
    });
  };

  const onUpdate = async () => {
    let hasNewError;
    if (!hasError) {
      hasNewError = checkTeamName(teamCurrentData);
    }
    dispatch(setNotificationTimeout(4000));
    if (hasError || hasNewError) {
      dispatch(setNotificationVariant('error'));
      dispatch(setNotificationText(intl.get('EDIT_TEAM.FAIL_NOTIFICATION')));
      dispatch(displayNotification());
      return;
    }
    if (Object.keys(teamUpdatedFields).length) {
      await dispatch(
        isBusinessTeam
          ? updateBusinessTeam({ teamId, updateFields: teamUpdatedFields })
          : updateLearningTeam({ teamId, updateFields: teamUpdatedFields })
      );
    }
    history.push(PATHS.SETTINGS);
    dispatch(setNotificationVariant('success'));
    dispatch(setNotificationText(intl.get('EDIT_TEAM.SUCCESS_NOTIFICATION')));
    dispatch(displayNotification());
  };

  return (
    <div className='h-full flex flex-col'>
      <PageTitle
        titleComponent={`${intl.get('ENTITIES.TEAM', {
          num: 2,
        })} / ${teamName}`}
        className='sticky top-0 left-0 right-0'
      />
      {teamStatus !== SLICE_STATUS.LOADING && team.id ? (
        <Fragment>
          <EditTeamHeader isBusinessTeam={isBusinessTeam} team={team} />
          <div className='h-full bg-neutral-white overflow-y-auto mx-6 px-4 pb-12'>
            <BasicInformation
              team={team}
              isBusinessTeam={isBusinessTeam}
              handleChangeField={handleChangeField}
              hasError={hasError}
            />
            <hr className='mt-10 text-neutral-lighter' />
            <TeamMembers data={teamMembers} isBusinessTeam={isBusinessTeam} />
          </div>
          <EditTeamFooter disableSave={disableSave} onUpdate={onUpdate} />
        </Fragment>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default EditTeam;
