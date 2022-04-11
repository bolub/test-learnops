import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import {
  getOriginalProjectData,
  getCurrentUserParticipantType,
} from 'state/Project/projectSlice';
import { selectUserById } from 'state/UsersManagement/usersManagementSlice';
import {
  USER_TYPES,
  PROJECT_PARTICIPANT_TYPE,
  PROJECT_PRIVACY,
} from 'utils/constants';
import { LDTeam } from 'utils/customTypes';

const useHasUserAccess = () => {
  const [hasUserAccess, setHasUserAccess] = useState<boolean>(true);
  const projectData = useSelector(getOriginalProjectData);
  const projectParticipantType = useSelector(getCurrentUserParticipantType);
  const userData = useSelector(selectUserById);
  const userType = get(userData, 'type');

  const validateUserAccess = useCallback(() => {
    let hasAccess = true;
    if (
      (userType === USER_TYPES.BUSINESS || userType === USER_TYPES.EXTERNAL) &&
      projectParticipantType === PROJECT_PARTICIPANT_TYPE.NOT_PARTICIPANT
    ) {
      hasAccess = false;
    }

    if (userType === USER_TYPES.L_D) {
      const projectPrivacyMode = get(projectData, 'privacy');
      const isUserProjectParticipant =
        projectParticipantType !== PROJECT_PARTICIPANT_TYPE.NOT_PARTICIPANT;
      if (
        projectPrivacyMode &&
        projectPrivacyMode === PROJECT_PRIVACY.PRIVATE
      ) {
        hasAccess = isUserProjectParticipant;
      }

      if (projectPrivacyMode && projectPrivacyMode === PROJECT_PRIVACY.TEAM) {
        const allowedProjectTeams = get(projectData, 'ldteams', []).map(
          (team: LDTeam) => team.id
        );
        const userLearningTeams = get(userData, 'registeredLearningTeams', []);
        const userBelongsToAllowedTeam = userLearningTeams.some(
          (team: LDTeam) => allowedProjectTeams.includes(team.id)
        );
        hasAccess = userBelongsToAllowedTeam || isUserProjectParticipant;
      }

      if (projectPrivacyMode && projectPrivacyMode === PROJECT_PRIVACY.PUBLIC) {
        hasAccess = true;
      }
    }

    setHasUserAccess(hasAccess);
  }, [userType, projectParticipantType, projectData, userData]);

  useEffect(() => {
    if (projectData && userData && projectParticipantType) {
      validateUserAccess();
    }
  }, [projectData, userData, validateUserAccess, projectParticipantType]);

  return hasUserAccess;
};

export default useHasUserAccess;
