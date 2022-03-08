import React, { useState, useEffect, useMemo, useCallback } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty, isEqual, has, get } from 'lodash';
import { selectUserName, selectOrganizationId } from 'state/User/userSlice';
import {
  addNewProjectProcess,
  updateProjectProcess,
} from 'state/Processes/processesSlice';
import { selectAssociatedProcessesAndStages } from 'state/Projects/projectsSlice';
import useModal from 'Hooks/useModal';
import useInlineNotification from 'Hooks/useInlineNotification';
import {
  NewProjectProcess,
  NewProjectProcessStage,
  ProjectProcess,
} from 'utils/customTypes';
import { PROJECT_STAGE_FIELDS, PROJECT_PROCESS_FIELDS } from 'utils/constants';
import ProcessForm from './ProcessForm';

const ProcessModal: React.FC<{
  isModalOpen: boolean;
  process: ProjectProcess | null;
  onCloseModalHandle: () => void;
}> = ({ isModalOpen, process, onCloseModalHandle }) => {
  const { Modal, openModal, modalProps, closeModal } = useModal();
  const { showInlineNotification } = useInlineNotification();
  const dispatch = useDispatch();
  const currentUserName = useSelector(selectUserName);
  const organizationId = useSelector(selectOrganizationId);
  const associatedProjectProcesses = useSelector(
    selectAssociatedProcessesAndStages
  );
  const isUpdating: boolean = process !== null;
  const defaultStageState: NewProjectProcessStage = useMemo(
    () => ({
      stageName: '',
      description: '',
      data: {
        [PROJECT_STAGE_FIELDS.MIN_COMPLETION_TIME]: '',
        [PROJECT_STAGE_FIELDS.MAX_COMPLETON_TIME]: '',
      },
    }),
    []
  );

  const defaultProcessState: NewProjectProcess = useMemo(
    () => ({
      processName: '',
      description: '',
      projectStages: [defaultStageState],
      organization_id: organizationId!,
      data: {
        [PROJECT_PROCESS_FIELDS.CREATED_BY]: { name: currentUserName },
      },
    }),
    [defaultStageState, organizationId, currentUserName]
  );

  const [newProcess, setNewProcess] = useState<
    NewProjectProcess | ProjectProcess
  >(defaultProcessState);
  const [canSubmit, setCanSubmit] = useState(false);
  const [stagesErrorsIndexes, setStagesErrorsIndexes] = useState<number[]>();

  const handlleUpdateProcess = (key: string, value: string) => {
    setNewProcess((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleUpdateStage = (index: number, key: string, value: string) => {
    setNewProcess((prevState) => {
      const updateData =
        key === PROJECT_STAGE_FIELDS.MIN_COMPLETION_TIME ||
        key === PROJECT_STAGE_FIELDS.MAX_COMPLETON_TIME;
      const updatedProcess = {
        ...prevState,
        [PROJECT_PROCESS_FIELDS.STAGES]: [
          ...prevState.projectStages.slice(0, index),
          {
            ...prevState.projectStages[index],
            ...(updateData && {
              [PROJECT_STAGE_FIELDS.DATA]: {
                ...prevState.projectStages[index].data,
                [key]: value,
              },
            }),
            ...(!updateData && { [key]: value }),
          },
          ...prevState.projectStages.slice(index + 1),
        ],
      };
      return updatedProcess;
    });
  };

  const handleAddStage = () => {
    setNewProcess((prevState: NewProjectProcess) => {
      const updatedStages = prevState.projectStages.concat(defaultStageState);
      return {
        ...prevState,
        [PROJECT_PROCESS_FIELDS.STAGES]: updatedStages,
      };
    });
  };

  const handleRemoveStage = (index: number) => {
    setNewProcess((prevState: NewProjectProcess) => {
      const updatedStages = [
        ...prevState.projectStages.slice(0, index),
        ...prevState.projectStages.slice(index + 1),
      ];
      return {
        ...prevState,
        [PROJECT_PROCESS_FIELDS.STAGES]: updatedStages,
      };
    });
  };

  const handleCloseModal = useCallback(() => {
    setNewProcess(defaultProcessState);
    onCloseModalHandle();
    closeModal();
  }, [closeModal, defaultProcessState, onCloseModalHandle]);

  const handleAddNewProjectProcess = useCallback(() => {
    dispatch(addNewProjectProcess(newProcess));
    showInlineNotification(
      'success',
      intl.get(
        'SETTINGS_PAGE.ADD_PROCESS_MODAL.PROCESS_ADDED_SUCCESSFULLY_MESSAGE'
      )
    );
  }, [dispatch, newProcess, showInlineNotification]);

  const handleUpdateProjectProcess = useCallback(() => {
    dispatch(updateProjectProcess(newProcess as ProjectProcess));
    showInlineNotification(
      'success',
      intl.get(
        'SETTINGS_PAGE.ADD_PROCESS_MODAL.PROCESS_UPDATED_SUCCESSFULLY_MESSAGE'
      )
    );
  }, [dispatch, newProcess, showInlineNotification]);

  const handleSave = useCallback(async () => {
    if (!isUpdating) {
      handleAddNewProjectProcess();
    } else {
      handleUpdateProjectProcess();
    }
    handleCloseModal();
  }, [
    handleCloseModal,
    handleAddNewProjectProcess,
    handleUpdateProjectProcess,
    isUpdating,
  ]);

  const actionButtons = useMemo(
    () => [
      {
        children: intl.get('NEW_PROJECT_PAGE.SAVE_BUTTON'),
        variant: 'primary',
        'data-cy': 'process-form__confirm-button',
        disabled: !canSubmit,
        onClick: handleSave,
      },
      {
        children: intl.get('NEW_PROJECT_PAGE.CANCEL_BUTTON'),
        variant: 'tertiary',
        onClick: handleCloseModal,
        'data-cy': 'process-form__cancel-button',
      },
    ],
    [canSubmit, handleCloseModal, handleSave]
  );

  useEffect(() => {
    let canSave = true;
    const stagesNames: string[] = [];
    const stagesIndexes: number[] = [];
    if (isEmpty(newProcess.processName) || isEmpty(newProcess.description)) {
      canSave = false;
    }
    if (canSave) {
      let index = 0;
      for (const stage of newProcess.projectStages) {
        if (isEmpty(stage.stageName)) {
          canSave = false;
          break;
        }

        if (stagesNames.includes(stage.stageName)) {
          stagesIndexes.push(index);
          canSave = false;
          break;
        }
        stagesNames.push(stage.stageName);
        index++;
      }
    }
    if (canSave && isUpdating) {
      canSave = !isEqual(newProcess, process);
    }
    setCanSubmit(canSave);
    setStagesErrorsIndexes(stagesIndexes);
  }, [newProcess, isUpdating, process]);

  useEffect(() => {
    setNewProcess(process !== null ? process : defaultProcessState);
  }, [process, defaultProcessState]);

  useEffect(() => {
    if (isModalOpen && !modalProps.isOpen) {
      openModal(modalProps);
    }
  }, [isModalOpen, modalProps, openModal]);

  return (
    <Modal
      {...modalProps}
      aria-label={intl.get('SETTINGS_PAGE.ADD_PROCESS_MODAL.TITLE')}
      closeModal={handleCloseModal}
      title={intl.get('SETTINGS_PAGE.ADD_PROCESS_MODAL.TITLE')}
      size='large'
      actionButtons={actionButtons}
      childrenClassName='max-h-136'
      data-cy='process-form__container'
    >
      <ProcessForm
        process={newProcess}
        updateProcess={handlleUpdateProcess}
        updateStage={handleUpdateStage}
        addStage={handleAddStage}
        removeStage={handleRemoveStage}
        stagesErrors={stagesErrorsIndexes || []}
        unremovableStages={
          process !== null &&
          has(associatedProjectProcesses, get(process, 'id'))
            ? associatedProjectProcesses[get(process, 'id')]
            : []
        }
      />
    </Modal>
  );
};

export default ProcessModal;
