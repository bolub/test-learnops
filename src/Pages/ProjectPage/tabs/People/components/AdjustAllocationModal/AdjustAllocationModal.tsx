import React, { useEffect, useMemo, useCallback, useState } from 'react';
import intl from 'react-intl-universal';
import { useSelector, useDispatch } from 'react-redux';
import useModal from 'Hooks/useModal';
import { Table, Button, TextField } from '@getsynapse/design-system';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { DATE } from 'utils/constants';
import { AllocationUpdateData } from 'utils/customTypes';
import useInlineNotification from 'Hooks/useInlineNotification';
import {
  getUserAllocations,
  bulkUpdateAllocations,
  getCurrentEditingUser,
  setCurrentEditingUser,
} from 'state/ResourceAllocation/resourceAllocation';

const AdjustAllocationModal: React.FC = () => {
  const { Modal, modalProps, openModal, closeModal } = useModal();
  const currentEditingWeeklyHoursUser = useSelector(getCurrentEditingUser);
  const allocationsList = useSelector(getUserAllocations);

  const dispatch = useDispatch();
  const [editingAllocation, setEditingAllocation] = useState('');
  const [stagedAllocations, setStagedAllocations] = useState(allocationsList);
  const [shouldModalOpen, setShouldModalOpen] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState<AllocationUpdateData>({
    allocationId: '',
    allocatedHours: 0,
  });
  const { showInlineNotification } = useInlineNotification();

  useEffect(() => {
    if (currentEditingWeeklyHoursUser.userId) {
      setShouldModalOpen(true);
    } else {
      setShouldModalOpen(false);
    }
  }, [currentEditingWeeklyHoursUser]);

  const handleCloseModal = useCallback(() => {
    setEditingAllocation('');
    dispatch(setCurrentEditingUser({ userId: '', name: '' }));
    closeModal();
    setShouldModalOpen(false);
  }, [closeModal, setEditingAllocation, dispatch]);

  const [fieldsToUpdate, setFieldsToUpdate] = useState<AllocationUpdateData[]>(
    []
  );

  const [canSaveChanges, setCanSaveChanges] = useState(false);

  useEffect(() => {
    setStagedAllocations(allocationsList);
  }, [allocationsList, dispatch]);

  useEffect(() => {
    if (shouldModalOpen && !modalProps.isOpen) {
      openModal(modalProps);
    }
  }, [openModal, modalProps, shouldModalOpen]);

  useEffect(() => {
    const tempFiledsToUpdate = [];

    if (isEmpty(stagedAllocations) || isEmpty(allocationsList)) {
      return;
    }
    for (let i = 0; i < allocationsList.length; i++) {
      if (
        allocationsList[i].allocationId &&
        allocationsList[i].allocatedHours !==
          stagedAllocations[i].allocatedHours
      ) {
        tempFiledsToUpdate.push({
          allocationId: stagedAllocations[i].allocationId,
          allocatedHours: stagedAllocations[i].allocatedHours,
        });
      }
    }
    setFieldsToUpdate(tempFiledsToUpdate);
    if (!isEmpty(tempFiledsToUpdate) && !canSaveChanges) {
      setCanSaveChanges(true);
    }

    if (isEmpty(tempFiledsToUpdate) && canSaveChanges) {
      setCanSaveChanges(false);
    }
  }, [allocationsList, stagedAllocations, canSaveChanges]);

  const isEditing = (id: string) =>
    editingAllocation && editingAllocation === id;

  const onSave = useCallback(() => {
    dispatch(bulkUpdateAllocations(fieldsToUpdate));
    showInlineNotification(
      'success',
      intl.get(
        'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.SUCCESS_BANNER'
      )
    );
    handleCloseModal();
  }, [fieldsToUpdate, dispatch, handleCloseModal, showInlineNotification]);

  const actionButons = useMemo(
    () => [
      {
        children: intl.get('SAVE'),
        variant: 'primary',
        disabled: !canSaveChanges,
        onClick: onSave,
      },
      {
        children: intl.get('CANCEL'),
        variant: 'tertiary',
        onClick: handleCloseModal,
      },
    ],
    [handleCloseModal, canSaveChanges, onSave]
  );

  const getDatesString = (start: string, end: string) => {
    return `${moment(new Date(start)).format(
      DATE.TASK_TABLE_FORMAT
    )} - ${moment(new Date(end)).format(DATE.TASK_TABLE_FORMAT)}`;
  };

  const onSaveRowChange = () => {
    setEditingAllocation('');
    if (isEmpty(itemToUpdate)) {
      return;
    }
    const tempList = [...stagedAllocations];
    const result = tempList.map((item: any) => {
      const tempItem = { ...item };
      if (item.allocationId === itemToUpdate.allocationId) {
        tempItem.allocatedHours = itemToUpdate.allocatedHours;
      }
      return tempItem;
    });
    setStagedAllocations(result);
    setEditingAllocation('');
    setItemToUpdate({ allocationId: '', allocatedHours: 0 });
  };

  const getHoursLeftSpan = (value: number) => {
    if (value < 0) {
      return (
        <span className='text-error-dark bg-error-lightest'>{value} h</span>
      );
    }
    return `${value} ${intl.get(
      'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.HOUR_LABEL'
    )}`;
  };

  return (
    <Modal
      {...modalProps}
      closeModal={handleCloseModal}
      title={currentEditingWeeklyHoursUser.name}
      size='large'
      actionButtons={actionButons}
      data-cy='add-participant-modal'
      aria-label={intl.get(
        'PEOPLE.RESOURCE_ALLOCATION.TABLE.ADJUST_ALLOCATION'
      )}
    >
      <div className='h-66 overflow-y-auto'>
        <Table
          canSelectRows={false}
          className='w-full max-h-10 overflow-y-auto'
          data={{
            headData: {
              className: 'sticky top-0',
              headCells: [
                {
                  content: intl.get(
                    'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.TIME_LINE'
                  ),
                },
                {
                  content: intl.get(
                    'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.PROJECT_ROLE'
                  ),
                  className: 'w-40',
                },
                {
                  content: intl.get(
                    'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.HOURS_ALLOCATED'
                  ),
                  className: 'w-32',
                },
                {
                  content: intl.get(
                    'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.HOURS_LEFT'
                  ),
                },
                {
                  content: '',
                  className: 'w-40',
                },
              ],
            },
            rows: stagedAllocations.map((allocation: any) => {
              return {
                className: 'text-neutral-black',
                cells: [
                  {
                    content: getDatesString(
                      allocation.weekStart,
                      allocation.weekEnd
                    ),
                  },
                  {
                    content: allocation.role,
                  },
                  {
                    content: isEditing(allocation.allocationId) ? (
                      <div className='flex items-center'>
                        <TextField
                          divProps={{ className: 'w-20' }}
                          type='number'
                          height='small'
                          inputClassName='no-spinner'
                          defaultValue={allocation.allocatedHours}
                          onChange={(e: any) =>
                            setItemToUpdate({
                              allocationId: allocation.allocationId,
                              allocatedHours: parseInt(e.target.value),
                            })
                          }
                          className='w-20'
                        />
                        <span className='ml-2'>
                          {intl.get(
                            'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.HOUR_LABEL'
                          )}
                        </span>
                      </div>
                    ) : (
                      `${allocation.allocatedHours} ${intl.get(
                        'PEOPLE.RESOURCE_ALLOCATION.UPDATE_WEEKLY_ALLOCATION_MODAL.HOUR_LABEL'
                      )}`
                    ),
                  },
                  {
                    content: getHoursLeftSpan(
                      allocation.capacity - allocation.allocatedHours
                    ),
                  },
                  {
                    content: isEditing(allocation.allocationId) ? (
                      <div className='flex float-right mr-2'>
                        <Button
                          onClick={onSaveRowChange}
                          variant='tertiary'
                          size='small'
                          className='hover:bg-neutral-lightest'
                        >
                          {intl.get('SAVE')}
                        </Button>
                        <Button
                          onClick={() => setEditingAllocation('')}
                          variant='tertiary'
                          size='small'
                          className='hover:bg-neutral-lightest'
                        >
                          {intl.get('CANCEL')}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() =>
                          setEditingAllocation(allocation.allocationId)
                        }
                        variant='tertiary'
                        size='small'
                        disabled={
                          editingAllocation &&
                          !isEditing(allocation.allocationId)
                        }
                        className='hover:bg-neutral-lightest float-right mr-2'
                      >
                        {intl.get('EDIT')}
                      </Button>
                    ),
                  },
                ],
              };
            }),
          }}
        />
      </div>
    </Modal>
  );
};

export default AdjustAllocationModal;
