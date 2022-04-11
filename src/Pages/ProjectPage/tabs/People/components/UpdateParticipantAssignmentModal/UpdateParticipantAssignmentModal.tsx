import React, { useEffect, useMemo, useCallback, useState } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import {
  Typography,
  Button,
  Table,
  Tooltip,
  Icon,
  Dropdown,
  Datepicker,
  TextField,
} from '@getsynapse/design-system';
import useModal from 'Hooks/useModal';
import useInlineNotification from 'Hooks/useInlineNotification';
import { recalculateTotalAllocatedHours } from 'Organisms/CapacityAllocationTable/helpers';
import {
  getParticipantAssignmentToUpdate,
  setParticipantAssignmentToUpdate,
  getParticipantAssignmentDetails,
  bulkHandleAssignmentsChanges,
} from 'state/ResourceAllocation/resourceAllocation';
import informationIcon from 'assets/icons/information.svg';
import { getOriginalProjectData } from 'state/Project/projectSlice';
import {
  ParticipantAssignment,
  rangeDate,
  FormOption,
  NewAssignmentFormValues,
} from 'utils/customTypes';
import {
  RESOURCE_ALLOCATION_TABLE_SECTIONS,
  PROJECT_PARTICIPANT_ROLE,
  NEW_PROJECT_PARTICIPANT_FIELDS,
  DATE,
} from 'utils/constants';
import InlineParticipantForm from '../InlineParticipantForm/InlineParticipantForm';

const isValueTypeDateRange = (value: string | rangeDate): value is rangeDate =>
  typeof value === 'object' &&
  value !== null &&
  'startDate' in value &&
  'endDate' in value;

const UpdateParticipantAssignmentModal = () => {
  const { Modal, modalProps, openModal, closeModal } = useModal();
  const { showInlineNotification } = useInlineNotification();
  const [displayParticipantForm, setDisplayParticipantForm] = useState(false);
  const [participantAssignments, setParticipantAssignments] = useState<
    ParticipantAssignment[]
  >([]);
  const [addedParticipantAssignments, setAddedParticipantAssignments] =
    useState<ParticipantAssignment[]>([]);

  const [deletedAssignments, setDeletedAssignments] = useState<
    ParticipantAssignment[]
  >([]);
  const defaultState = useMemo(
    () => ({
      userId: '',
      startDate: '',
      endDate: '',
      job_role: '',
      allocations: [],
      totalAllocation: 0,
    }),
    []
  );
  const [currentAssignmentBeingUpdated, setCurrentAssignmentBeingUpdated] =
    useState<ParticipantAssignment>(defaultState);
  const dispatch = useDispatch();
  const participantToUpdate = useSelector(getParticipantAssignmentToUpdate);
  const originalParticipantAssignments = useSelector(
    getParticipantAssignmentDetails
  );

  const projectData = useSelector(getOriginalProjectData);
  const participantsTypesWhoCannotAddAssignments = [
    RESOURCE_ALLOCATION_TABLE_SECTIONS.COLLABORATORS,
    RESOURCE_ALLOCATION_TABLE_SECTIONS.OWNERS,
  ];
  const canAddAssignment = !participantsTypesWhoCannotAddAssignments.includes(
    participantToUpdate?.participantType!
  );
  const isParticipantCollaboratorType =
    participantToUpdate?.participantType ===
    RESOURCE_ALLOCATION_TABLE_SECTIONS.COLLABORATORS;

  const resetLocalState = useCallback(() => {
    setCurrentAssignmentBeingUpdated(defaultState);
  }, [defaultState]);

  const updatedAssignments = useMemo(() => {
    return participantAssignments.filter(
      (assignment: ParticipantAssignment, index: number) => {
        const originalAssignment = originalParticipantAssignments[index];
        if (!originalAssignment) {
          return false;
        }
        return (
          assignment.job_role !== originalAssignment.job_role ||
          assignment.startDate !== originalAssignment.startDate ||
          assignment.endDate !== originalAssignment.endDate ||
          assignment.estimatedHours !== originalAssignment.estimatedHours
        );
      }
    );
  }, [participantAssignments, originalParticipantAssignments]);

  const availableRolesOptions = useMemo(() => {
    let clonedRoles = [...PROJECT_PARTICIPANT_ROLE];
    for (let assignment of originalParticipantAssignments.concat(
      addedParticipantAssignments
    )) {
      const foundIndex = clonedRoles.findIndex(
        (key) => key === assignment.job_role
      );
      if (foundIndex > -1) {
        clonedRoles.splice(foundIndex, 1);
      }
    }
    return clonedRoles.map((key: string) => ({
      label: key,
      value: key,
    }));
  }, [originalParticipantAssignments, addedParticipantAssignments]);

  const handleCloseModal = useCallback(() => {
    resetLocalState();
    dispatch(setParticipantAssignmentToUpdate(null));
    closeModal();
  }, [closeModal, dispatch, resetLocalState]);

  const toggleParticipantForm = () =>
    setDisplayParticipantForm((prev) => !prev);

  const onAddNewParticipant = (assignmentData: NewAssignmentFormValues) => {
    setAddedParticipantAssignments((prev: ParticipantAssignment[]) => {
      return [
        ...prev,
        {
          ...assignmentData,
          participationId: uuidv4(),
          userId: participantToUpdate?.userId || '',
          newlyAdded: true,
        },
      ];
    });
  };

  const handleUpdateAssignmentValues = (
    key: string,
    value: string | rangeDate
  ) => {
    setCurrentAssignmentBeingUpdated((prevState: ParticipantAssignment) => {
      let resp = { ...prevState };
      let totalAllocation = resp.totalAllocation;
      if (isValueTypeDateRange(value)) {
        if (
          !resp.newlyAdded &&
          participantToUpdate?.participantType &&
          participantToUpdate.participantType ===
            RESOURCE_ALLOCATION_TABLE_SECTIONS.MEMBERS &&
          (moment(resp.startDate).diff(value.startDate) !== 0 ||
            moment(resp.endDate).diff(value.endDate) !== 0)
        ) {
          totalAllocation = recalculateTotalAllocatedHours(
            value.startDate,
            value.endDate,
            resp.allocations!
          );
        }
        resp = {
          ...resp,
          totalAllocation,
          [NEW_PROJECT_PARTICIPANT_FIELDS.START_DATE]: value.startDate,
          [NEW_PROJECT_PARTICIPANT_FIELDS.END_DATE]: value.endDate,
        };
      } else {
        resp = {
          ...resp,
          [key]: value,
        };
      }
      return resp;
    });
  };

  const handleUpdateParticipantAssignments = (
    id: string,
    index: number,
    isNewlyAdded: boolean
  ) => {
    if (isNewlyAdded) {
      setAddedParticipantAssignments((prev: ParticipantAssignment[]) =>
        prev.map((participant) => {
          if (participant.participationId === id) {
            return currentAssignmentBeingUpdated;
          }
          return participant;
        })
      );
    } else {
      if (isParticipantCollaboratorType) {
        setParticipantAssignments((prev: ParticipantAssignment[]) => [
          ...prev.slice(0, index),
          currentAssignmentBeingUpdated,
          ...prev.slice(index + 1),
        ]);
      } else {
        setParticipantAssignments((prev: ParticipantAssignment[]) =>
          prev.map((participant) => {
            if (participant.participationId === id) {
              return currentAssignmentBeingUpdated;
            }
            return participant;
          })
        );
      }
    }
    resetLocalState();
  };

  const handleSave = useCallback(() => {
    dispatch(
      bulkHandleAssignmentsChanges({
        isCollaborator: isParticipantCollaboratorType,
        updatedAssignments,
        deletedAssignments,
        addedParticipantAssignments,
        projectId: projectData.id,
        userId: participantToUpdate?.userId || '',
      })
    );
    const participantTypeLabel = intl.get(
      `PEOPLE.RESOURCE_ALLOCATION.TABLE.${participantToUpdate?.participantType}`,
      {
        num: 0,
      }
    );
    showInlineNotification(
      'success',
      intl.get(
        'PEOPLE.RESOURCE_ALLOCATION.TABLE.ASSIGNMENT_UPDATED_SUCCESSFULLY',
        { type: participantTypeLabel.toLowerCase() }
      )
    );
    handleCloseModal();
  }, [
    dispatch,
    isParticipantCollaboratorType,
    updatedAssignments,
    deletedAssignments,
    addedParticipantAssignments,
    projectData.id,
    participantToUpdate,
    handleCloseModal,
    showInlineNotification,
  ]);

  useEffect(() => {
    setParticipantAssignments(originalParticipantAssignments);
  }, [originalParticipantAssignments]);

  useEffect(() => {
    if (participantToUpdate !== null && !modalProps.isOpen) {
      openModal(modalProps);
    }
    setDeletedAssignments([]);
    setDisplayParticipantForm(false);
    setAddedParticipantAssignments([]);
  }, [participantToUpdate, modalProps, openModal]);

  const actionButtons = useMemo(
    () => [
      {
        children: intl.get('SAVE'),
        variant: 'primary',
        disabled:
          updatedAssignments &&
          updatedAssignments.length === 0 &&
          deletedAssignments.length === 0 &&
          addedParticipantAssignments.length === 0,
        onClick: handleSave,
      },
      {
        children: intl.get('CANCEL'),
        variant: 'tertiary',
        onClick: handleCloseModal,
      },
    ],
    [
      handleCloseModal,
      updatedAssignments,
      deletedAssignments,
      addedParticipantAssignments,
      handleSave,
    ]
  );
  const onRemoveAssignment = (
    assignment: ParticipantAssignment,
    isNewlyAdded: boolean
  ) => {
    if (isNewlyAdded) {
      setAddedParticipantAssignments((prev: ParticipantAssignment[]) =>
        prev.filter(
          (addedAssignment: ParticipantAssignment) =>
            addedAssignment.participationId !== assignment.participationId
        )
      );
    } else {
      setDeletedAssignments((prev) => [...prev, assignment]);
      setParticipantAssignments((prev: ParticipantAssignment[]) =>
        prev.filter((paritipantAssignment: ParticipantAssignment) => {
          if (paritipantAssignment.participationId) {
            return (
              paritipantAssignment.participationId !==
              assignment.participationId
            );
          } else {
            return paritipantAssignment.job_role !== assignment.job_role;
          }
        })
      );
    }
  };

  const combinedAssignments = participantAssignments.concat(
    addedParticipantAssignments
  );

  const warningMessage = useMemo(() => {
    if (combinedAssignments.length === 0) {
      return intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.REMOVE_USER_WARNING');
    } else if (deletedAssignments.length > 0) {
      const deltedStartedAssignment = deletedAssignments.some(
        (deletedAssignment) =>
          moment(deletedAssignment.startDate).isBefore(moment())
      );
      if (deltedStartedAssignment)
        return intl.get(
          'PEOPLE.RESOURCE_ALLOCATION.TABLE.REMOVE_STARTED_ROLE_WARNING'
        );
    }
    return '';
  }, [deletedAssignments, combinedAssignments]);

  return (
    <Modal
      {...modalProps}
      title={participantToUpdate?.name}
      actionButtons={actionButtons}
      closeModal={handleCloseModal}
      size='large'
      childrenClassName='overflow-visible'
      aria-label={intl.get(
        'PEOPLE.RESOURCE_ALLOCATION.TABLE.UPDATE_ASSIGNMENT',
        { type: participantToUpdate?.participantType }
      )}
    >
      <div className='flex flex-col min-h-60'>
        <Typography variant='body' className='text-neutral-black mb-4'>
          {intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.ASSIGNMENT_DETAILS')}
        </Typography>
        <Table
          canSelectRows={false}
          className='w-full max-h-10 overflow-y-auto px-1'
          data={{
            headData: {
              className: 'sticky top-0',
              headCells: [
                {
                  content: intl.get(
                    'PEOPLE.RESOURCE_ALLOCATION.TABLE.HEADERS.PROJECT_ROLE'
                  ),
                  className: 'w-1/5',
                },
                {
                  content: intl.get(
                    'PEOPLE.RESOURCE_ALLOCATION.TABLE.HEADERS.TIME_LINE'
                  ),
                  className: 'w-2/6',
                },
                {
                  content: intl.get(
                    'PEOPLE.RESOURCE_ALLOCATION.TABLE.HEADERS.PARTICIPANT_TYPE'
                  ),
                },
                {
                  content: intl.get(
                    'PEOPLE.RESOURCE_ALLOCATION.TABLE.HEADERS.ALLOCATION',
                    {
                      isMember: isParticipantCollaboratorType ? 0 : 1,
                    }
                  ),
                },
                {
                  content: <div></div>,
                  className: 'w-30',
                },
              ],
            },
            rows: combinedAssignments.map(
              (assignment: ParticipantAssignment, index: number) => {
                const isNewlyAdded = assignment.newlyAdded || false;
                const hasStarted = moment(assignment.startDate).isBefore(
                  moment()
                );
                const isLastItem =
                  index === 0 && combinedAssignments.length === 1;
                let hasTimelineBeingUpdate;
                const isEditing =
                  participantToUpdate === null
                    ? false
                    : isParticipantCollaboratorType
                    ? assignment.userId === currentAssignmentBeingUpdated.userId
                    : assignment.participationId ===
                      currentAssignmentBeingUpdated.participationId;
                if (isNewlyAdded) {
                  hasTimelineBeingUpdate = false;
                } else {
                  const originalAssignment =
                    originalParticipantAssignments[index];
                  hasTimelineBeingUpdate = isParticipantCollaboratorType
                    ? false
                    : isEditing
                    ? originalAssignment.totalAllocation !==
                      currentAssignmentBeingUpdated.totalAllocation
                    : false;
                }
                const totalAllocation = isParticipantCollaboratorType
                  ? assignment.estimatedHours
                  : isEditing
                  ? currentAssignmentBeingUpdated.totalAllocation
                  : assignment.totalAllocation;
                return {
                  className: 'text-neutral-black',
                  cells: [
                    {
                      content: isEditing ? (
                        <Dropdown
                          values={[
                            {
                              label: currentAssignmentBeingUpdated.job_role,
                              value: currentAssignmentBeingUpdated.job_role,
                            },
                          ]}
                          triggerProps={{ size: 'sm', className: 'w-36' }}
                          options={availableRolesOptions}
                          onChange={(option: FormOption) =>
                            handleUpdateAssignmentValues(
                              NEW_PROJECT_PARTICIPANT_FIELDS.JOB_ROLE,
                              option.value
                            )
                          }
                        />
                      ) : (
                        assignment.job_role
                      ),
                      className: 'w-1/5',
                    },
                    {
                      content: isEditing ? (
                        <Datepicker
                          canSelectRange
                          triggerClassname='h-8 text-label px-2'
                          className='w-62'
                          minDate={
                            projectData.startDate &&
                            new Date(projectData.startDate)
                          }
                          maxDate={
                            projectData.targetCompletionDate &&
                            new Date(projectData.targetCompletionDate)
                          }
                          startDate={
                            currentAssignmentBeingUpdated.startDate &&
                            new Date(currentAssignmentBeingUpdated.startDate)
                          }
                          endDate={
                            currentAssignmentBeingUpdated.endDate &&
                            new Date(currentAssignmentBeingUpdated.endDate)
                          }
                          onPickDate={(date: rangeDate) => {
                            handleUpdateAssignmentValues(
                              NEW_PROJECT_PARTICIPANT_FIELDS.START_DATE,
                              date
                            );
                          }}
                        />
                      ) : (
                        `${moment(assignment.startDate).format(
                          DATE.SHORT_FORMAT
                        )} - ${moment(assignment.endDate).format(
                          DATE.SHORT_FORMAT
                        )}`
                      ),
                      className: 'w-2/6',
                    },
                    {
                      content: intl.get(
                        `PEOPLE.RESOURCE_ALLOCATION.TABLE.${participantToUpdate?.participantType}`,
                        {
                          num: 0,
                        }
                      ),
                    },
                    {
                      content: (
                        <div className='flex justify-between'>
                          {isEditing && isParticipantCollaboratorType ? (
                            <TextField
                              divProps={{ className: 'w-20' }}
                              type='number'
                              height='small'
                              inputClassName='no-spinner'
                              defaultValue={totalAllocation}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                handleUpdateAssignmentValues(
                                  NEW_PROJECT_PARTICIPANT_FIELDS.ESTIMATED_HOURS,
                                  e.target.value
                                )
                              }
                              className='w-20'
                            />
                          ) : (
                            <div>
                              <Typography variant='body2'>
                                {totalAllocation}
                              </Typography>
                              {hasTimelineBeingUpdate && (
                                <Tooltip
                                  className='flex'
                                  trigger={
                                    <Icon
                                      name='information-circle'
                                      className='text-2xl text-warning-dark'
                                    />
                                  }
                                  ariaId='review-allocation-warning'
                                  openMode='hover2'
                                  timeout={0}
                                  position='topCenter'
                                  contentProps={{
                                    className: classnames(
                                      'bg-warning-lighter',
                                      'text-warning-dark',
                                      'rounded px-4 py-3.5',
                                      'w-max absolute',
                                      'font-normal',
                                      'shadow-tooltip'
                                    ),
                                  }}
                                >
                                  <span>
                                    {intl.get(
                                      'PEOPLE.RESOURCE_ALLOCATION.TABLE.REVIEW_ALLOCATION_WARNING'
                                    )}
                                  </span>
                                </Tooltip>
                              )}
                            </div>
                          )}
                        </div>
                      ),
                    },
                    {
                      content: (
                        <div className='flex justify-between'>
                          {isEditing ? (
                            <React.Fragment>
                              <Button
                                variant='tertiary'
                                className='px-2'
                                onClick={() =>
                                  handleUpdateParticipantAssignments(
                                    assignment.participationId || '',
                                    index,
                                    isNewlyAdded
                                  )
                                }
                              >
                                {intl.get('DONE')}
                              </Button>
                              <Button
                                variant='tertiary'
                                className='px-2'
                                onClick={resetLocalState}
                              >
                                {intl.get('CANCEL')}
                              </Button>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <Button
                                variant='tertiary'
                                className='px-2'
                                onClick={() =>
                                  setCurrentAssignmentBeingUpdated(assignment)
                                }
                              >
                                {intl.get('EDIT')}
                              </Button>
                              {isLastItem || (hasStarted && !isNewlyAdded) ? (
                                <Tooltip
                                  trigger={
                                    <Button
                                      variant='tertiary'
                                      onClick={() =>
                                        onRemoveAssignment(
                                          assignment,
                                          isNewlyAdded
                                        )
                                      }
                                    >
                                      {intl.get('REMOVE')}
                                    </Button>
                                  }
                                  openMode='hover2'
                                  timeout='10'
                                  ariaId='required-allocation-changes'
                                  position='bottomLeft'
                                  contentProps={{
                                    className: classnames(
                                      'bg-warning-lighter',
                                      'text-warning-dark',
                                      'max-w-max z-50 absolute'
                                    ),
                                  }}
                                >
                                  {hasStarted &&
                                  !isNewlyAdded &&
                                  !isLastItem ? (
                                    <div className='max-w-64 rounded-sm flex'>
                                      <Icon
                                        src={informationIcon}
                                        className='font-normal text-xl w-16'
                                      />
                                      <span className='ml-2'>
                                        {intl.get(
                                          'PEOPLE.RESOURCE_ALLOCATION.TABLE.REMOVE_STARTED_ROLE_WARNING_TOOLTIP'
                                        )}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className='w-full rounded-sm flex items-center'>
                                      <Icon
                                        src={informationIcon}
                                        className='font-normal text-xl'
                                      />
                                      <span className='ml-2'>
                                        {intl.get(
                                          'PEOPLE.RESOURCE_ALLOCATION.TABLE.REMOVE_USER_WARNING_TOOLTIP'
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </Tooltip>
                              ) : (
                                <Button
                                  variant='tertiary'
                                  onClick={() =>
                                    onRemoveAssignment(assignment, isNewlyAdded)
                                  }
                                >
                                  {intl.get('REMOVE')}
                                </Button>
                              )}
                            </React.Fragment>
                          )}
                        </div>
                      ),
                      className: 'w-30',
                    },
                  ],
                };
              }
            ),
          }}
          emptyComponent={
            <div className='flex items-center justify-center bg-neutral-white h-12'>
              <Typography variant='label' className='text-neutral'>
                {intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.NO_ASSIGNMENT')}
              </Typography>
            </div>
          }
        />
        {warningMessage && (
          <div className='w-full mt-2 rounded-sm flex bg-warning-lighter text-warning-dark px-2 py-2'>
            <Icon
              src={informationIcon}
              className='font-normal text-xl w-12 mt-1'
            />
            <span className='ml-2'>{warningMessage}</span>
          </div>
        )}
        {canAddAssignment &&
          (displayParticipantForm ? (
            <InlineParticipantForm
              userId={participantToUpdate?.userId}
              onCloseForm={toggleParticipantForm}
              onAddNewParticipant={onAddNewParticipant}
              availableRolesOptions={availableRolesOptions}
            />
          ) : (
            <Button
              variant='tertiary'
              className='self-start mb-1 ml-1 mt-5'
              iconName='add-circle'
              onClick={toggleParticipantForm}
            >
              {intl.get('PEOPLE.RESOURCE_ALLOCATION.TABLE.ADD_ASSIGNMENT')}
            </Button>
          ))}
      </div>
    </Modal>
  );
};

export default UpdateParticipantAssignmentModal;
