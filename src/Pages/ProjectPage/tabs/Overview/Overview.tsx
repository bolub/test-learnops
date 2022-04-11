import React, { useState, useEffect, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import intl from 'react-intl-universal';
import { get, isEqual, isEmpty } from 'lodash';
import { useElevation, Button } from '@getsynapse/design-system';
import {
  getCurrentProjectData,
  updateProject,
  getCurrentUserParticipantType,
} from 'state/Project/projectSlice';
import { deleteProject } from 'state/Projects/projectsSlice';
import { getAllRequests } from 'state/Requests/requestSlice';
import {
  PROJECT_STATUS,
  PATHS,
  PROJECT_PARTICIPANT_TYPE,
} from 'utils/constants';
import { NewProject, objKeyAsString } from 'utils/customTypes';
import {
  defaultNewProjectData,
  requiredFieldsErrorsMap,
} from '../../../NewProjectPage/helpers/types';
import {
  getUpdatedProjectData,
  removeUnnecessaryStatusData,
} from '../../helpers/updatedProjectData';
import { validateRequiredFields } from '../../helpers/formValidation';
import useInlineNotification from 'Hooks/useInlineNotification';
import BasicDetails from '../../../NewProjectPage/components/BasicDetails';
import PutProjectOnHoldModal from '../../components/PutProjectOnHoldModal/PutProjectOnHoldModal';
import CloseProject from 'Pages/ProjectPage/components/CloseProject/CloseProject';
import OverviewActions from 'Pages/ProjectPage/components/OverviewActions/OverviewActions';
import CommentsDropdown from 'Pages/ProjectPage/components/CommentsDropdown/CommentsDropdown';
import {
  OnHoldStatusBanner,
  ClosedStatusBanner,
} from '../../components/Banners/Banners';

const Overview: React.FC<{ projectId: string }> = ({ projectId }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const projectData = useSelector(getCurrentProjectData);
  const participantType = useSelector(getCurrentUserParticipantType);
  const { showInlineNotification } = useInlineNotification();
  const [disableSave, setDisableSave] = useState(true);
  const [shouldDisplayPutOnHoldModal, setShouldDisplayPutOnHoldModal] =
    useState(false);
  const [shouldDisplayCloseModal, setShouldDisplayCloseModal] = useState(false);
  const [currentSavedProject, setCurrentSavedProject] =
    useState<NewProject>(projectData);
  const [requiredFieldsErrors, setRequiredFieldsErrors] =
    useState<objKeyAsString>(requiredFieldsErrorsMap);
  const footerElevation = useElevation(1);
  const headerElevation = useElevation(2);

  const toggleCloseModal = () =>
    setShouldDisplayCloseModal((prevState: boolean) => !prevState);

  useEffect(() => {
    dispatch(getAllRequests());
  }, [dispatch]);

  const isUserAProjectOwner =
    participantType === PROJECT_PARTICIPANT_TYPE.OWNER;

  const isReadOnly =
    [PROJECT_STATUS.CLOSED, PROJECT_STATUS.CANCELED].includes(
      projectData.status
    ) || !isUserAProjectOwner;

  useEffect(() => {
    setCurrentSavedProject(projectData);
  }, [projectData, projectId]);

  useEffect(() => {
    if (!isEqual(currentSavedProject, defaultNewProjectData)) {
      const changesDetected = !isEqual(currentSavedProject, projectData);
      if (changesDetected && disableSave) {
        setDisableSave(false);
      }
      if (!changesDetected && !disableSave) {
        setDisableSave(true);
      }
    }
  }, [currentSavedProject, projectData, disableSave]);

  const handleSave = async () => {
    const { canSave, errorsMap } = validateRequiredFields(currentSavedProject);
    setRequiredFieldsErrors(errorsMap);
    if (!canSave) {
      setDisableSave(true);
      showInlineNotification(
        'error',
        intl.get('UPDATE_PROJECT_PAGE.NOT_UPDATED')
      );
    } else {
      await handleUpdateProject();
      setDisableSave(true);
      showInlineNotification(
        'success',
        intl.get('UPDATE_PROJECT_PAGE.UPDATED')
      );
    }
  };

  const handleDeleteProject = async () => {
    await dispatch(deleteProject(projectId));
    showInlineNotification(
      'success',
      intl.get('PROJECT_DETAIL.DELETE_PROJECT.SUCCESS_MESSAGE', {
        projectName: get(projectData, 'title'),
      })
    );
    history.push(PATHS.PROJECTS_LIST_PAGE);
  };

  const handleCancelProject = async (reason: string) => {
    const updatedProject = {
      cancel_reason: reason,
      status: PROJECT_STATUS.CANCELED,
    };
    const fieldsToUpdate = removeUnnecessaryStatusData(
      updatedProject,
      projectData
    );
    setCurrentSavedProject((previousProject) => ({
      ...previousProject,
      ...fieldsToUpdate,
    }));
    await dispatch(
      updateProject({
        projectId,
        data: fieldsToUpdate,
      })
    );
    showInlineNotification(
      'success',
      intl.get('PROJECT_DETAIL.CANCEL_PROJECT.SUCCESS_MESSAGE')
    );
  };

  const handleUpdateProject = async () => {
    const { updatedProjectData } = getUpdatedProjectData(
      currentSavedProject,
      projectData
    );
    await dispatch(
      updateProject({
        projectId,
        data: updatedProjectData,
      })
    );
  };

  const handlePutProjectOnHold = useCallback(
    async (holdReason: string) => {
      const updatedProject = {
        hold_reason: holdReason,
        status: PROJECT_STATUS.ON_HOLD,
      };
      const fieldsToUpdate = removeUnnecessaryStatusData(
        updatedProject,
        projectData
      );
      await dispatch(
        updateProject({
          projectId,
          data: fieldsToUpdate,
        })
      );
    },
    [dispatch, projectData, projectId]
  );

  const handleCancelPutProjectOnHold = useCallback(() => {
    if (projectData.status !== currentSavedProject.status) {
      setCurrentSavedProject((prevData) => ({
        ...prevData,
        status: projectData.status,
      }));
    }
  }, [currentSavedProject, setCurrentSavedProject, projectData]);

  const handleCloseProject = async (comments: string, closingDate: string) => {
    const updatedProject = {
      status: PROJECT_STATUS.CLOSED,
      finalComments: comments,
      closedDate: closingDate,
    };
    const fieldsToUpdate = removeUnnecessaryStatusData(
      updatedProject,
      projectData
    );
    await dispatch(
      updateProject({
        projectId,
        data: fieldsToUpdate,
      })
    );
  };

  useEffect(() => {
    if (
      !isEmpty(projectData) &&
      !isEmpty(currentSavedProject) &&
      projectData.status !== PROJECT_STATUS.ON_HOLD &&
      currentSavedProject.status === PROJECT_STATUS.ON_HOLD &&
      isUserAProjectOwner
    ) {
      setShouldDisplayPutOnHoldModal(true);
    }
  }, [
    projectData,
    isUserAProjectOwner,
    setShouldDisplayPutOnHoldModal,
    currentSavedProject,
  ]);

  const canCancelProject: boolean = useMemo<boolean>(
    () => get(currentSavedProject, 'status', '') !== PROJECT_STATUS.CANCELED,
    [currentSavedProject]
  );
  const canCloseProject: boolean = useMemo<boolean>(
    () => projectData.status === PROJECT_STATUS.COMPLETED,
    [projectData.status]
  );

  return (
    <React.Fragment>
      <PutProjectOnHoldModal
        onConfirm={handlePutProjectOnHold}
        onCancelCallback={handleCancelPutProjectOnHold}
        shouldDisplayModal={shouldDisplayPutOnHoldModal}
        canUpdateHoldReason={isUserAProjectOwner}
        holdReason={projectData?.hold_reason}
        onClose={() => {
          if (shouldDisplayPutOnHoldModal) {
            setShouldDisplayPutOnHoldModal(false);
          }
        }}
      />
      <CloseProject
        shouldDisplayModal={shouldDisplayCloseModal}
        closeModalCallback={toggleCloseModal}
        confirmCloseProject={handleCloseProject}
        project={projectData}
      />
      <div className='bg-neutral-white mx-6 mt-2 z-5'>
        <div
          className={classnames(
            'w-full min-h-12 p-2 flex',
            'justify-end items-center',
            headerElevation
          )}
        >
          {participantType !== PROJECT_PARTICIPANT_TYPE.COLLABORATOR && (
            <CommentsDropdown
              projectId={projectId}
              canAddComments={
                participantType !== PROJECT_PARTICIPANT_TYPE.NOT_PARTICIPANT
              }
            />
          )}
          {isUserAProjectOwner && (
            <OverviewActions
              canCancelProject={canCancelProject}
              cancelProjectCallback={handleCancelProject}
              canCloseProject={canCloseProject}
              deleteProjectCallback={handleDeleteProject}
              toggleCloseModal={toggleCloseModal}
            />
          )}
        </div>
      </div>

      <div
        className='bg-neutral-white flex-grow overflow-y-auto mx-6'
        data-cy='project-form-body'
      >
        <div className='w-full px-4 pb-6'>
          {projectData?.status === PROJECT_STATUS.ON_HOLD && (
            <OnHoldStatusBanner
              message={intl.get(
                'PROJECT_DETAIL.PUT_PROJECT_ON_HOLD_MODAL.PROJECT_ON_HOLD_BANNER'
              )}
              handleOnClick={() => setShouldDisplayPutOnHoldModal(true)}
            />
          )}
          {projectData.status === PROJECT_STATUS.CLOSED && (
            <ClosedStatusBanner
              handleOnClick={toggleCloseModal}
              closedDate={projectData.closedDate}
            />
          )}
          <BasicDetails
            data={currentSavedProject}
            setData={setCurrentSavedProject}
            requiredFieldsErrors={requiredFieldsErrors}
            isOnUpdatingPage={true}
            isReadOnly={isReadOnly}
            originalData={projectData}
          />
        </div>
      </div>
      <div
        className={classnames(
          'w-full bg-neutral-white flex py-2 z-5',
          footerElevation
        )}
      >
        <div className='flex ml-auto mr-12'>
          <Button
            variant='secondary'
            className='mr-4'
            onClick={() => history.push(PATHS.PROJECTS_LIST_PAGE)}
            data-testid='cancel-button'
          >
            {intl.get('NEW_PROJECT_PAGE.CANCEL_BUTTON')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={disableSave}
            data-testid='update-button'
          >
            {intl.get('UPDATE_PROJECT_PAGE.UPDATE')}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Overview;
