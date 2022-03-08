import React, { useState, useMemo, useCallback, useEffect } from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { Typography, FormItem, TextArea } from '@getsynapse/design-system';
import { DATE, PROJECT_STATUS } from 'utils/constants';
import { NewProject } from 'utils/customTypes';
import useModal from 'Hooks/useModal';

const Content: React.FC<{
  onChangeComments: (value: string) => void;
  finalComments: string | undefined;
  totalHours?: number;
  totalCost?: number;
  closedDate?: string | null;
  disabled?: boolean;
}> = ({
  onChangeComments,
  finalComments,
  totalCost,
  totalHours,
  closedDate,
  disabled = false,
}) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    onChangeComments(value);
  };
  return (
    <React.Fragment>
      <Typography variant='body' className='text-neutral-black'>
        {intl.getHTML('PROJECT_DETAIL.CLOSE_PROJECT.BODY')}
      </Typography>
      <Typography variant='body' className='mt-4 text-neutral-black'>
        {intl.get('PROJECT_DETAIL.CLOSE_PROJECT.CONFIRMATION')}
      </Typography>
      <div className='flex mt-6'>
        <div className='flex flex-col flex-1'>
          <Typography
            variant='label'
            className='font-semibold text-neutral-black'
          >
            {intl.get('PROJECT_DETAIL.CLOSE_PROJECT.TOTAL_HOURS')}
          </Typography>
          <Typography variant='label' className='text-neutral-black mt-2'>
            {`${totalHours || 0} ${intl.get(
              'PROJECT_DETAIL.CLOSE_PROJECT.HOURS'
            )}`}
          </Typography>
        </div>
        <div className='flex flex-col flex-1'>
          <Typography
            variant='label'
            className='font-semibold text-neutral-black'
          >
            {intl.get('PROJECT_DETAIL.CLOSE_PROJECT.TOTAL_COST')}
          </Typography>
          <Typography variant='label' className='text-neutral-black mt-2'>
            {`$ ${totalCost || 0} ${intl.get(
              'PROJECT_DETAIL.CLOSE_PROJECT.CURRENCY'
            )}`}
          </Typography>
        </div>
      </div>
      <FormItem
        label={intl.get('PROJECT_DETAIL.CLOSE_PROJECT.FINAL_COMMENTS_LABEL')}
        labelProps={{ required: true }}
        className='mt-6'
      >
        <TextArea
          onChange={handleOnChange}
          textAreaProps={{
            className: 'max-h-24',
            'data-cy': 'close-project-comments',
          }}
          value={finalComments}
          disabled={disabled}
        />
      </FormItem>
      <div className='flex flex-col mt-6'>
        <Typography
          variant='label'
          className='font-semibold text-neutral-black'
        >
          {intl.get('PROJECT_DETAIL.CLOSE_PROJECT.CLOSING_DATE')}
        </Typography>
        <Typography variant='label' className='text-neutral-black mt-2'>
          {closedDate &&
            moment(new Date(closedDate)).format(DATE.FULL_MONTH_YEAR_FORMAT)}
        </Typography>
      </div>
    </React.Fragment>
  );
};

const CloseProject: React.FC<{
  shouldDisplayModal: boolean;
  confirmCloseProject: (comments: string, closingDate: string) => void;
  closeModalCallback: () => void;
  project: NewProject;
}> = ({
  closeModalCallback,
  confirmCloseProject,
  shouldDisplayModal,
  project,
}) => {
  const { Modal, modalProps, openModal, closeModal, updateModal } = useModal();
  const [comments, setComments] = useState<string | undefined>(
    project.finalComments
  );
  const [closingDate, setClosingDate] = useState<string | null>(
    project.closedDate || null
  );

  useEffect(() => {
    if (project.finalComments) {
      setComments(project.finalComments);
    }
    const closingDate = project.closedDate || new Date().toString();
    setClosingDate(closingDate);
  }, [setComments, setClosingDate, project]);

  const onCloseModal = useCallback(() => {
    setComments('');
    closeModal();
    closeModalCallback();
  }, [closeModal, closeModalCallback]);

  const onSubmit = useCallback(() => {
    confirmCloseProject(comments!, closingDate!);
    onCloseModal();
  }, [onCloseModal, confirmCloseProject, comments, closingDate]);

  const actionButtons = useMemo(
    () => [
      {
        children: intl.get('PROJECT_DETAIL.CLOSE_PROJECT.SUBMIT'),
        variant: 'primary',
        disabled: !comments || comments.length === 0,
        'data-cy': 'confirm-button',
        onClick: onSubmit,
      },
      {
        children: intl.get('PROJECT_DETAIL.CLOSE_PROJECT.CANCEL'),
        variant: 'secondary',
        'data-cy': 'cancel-button',
        onClick: () => onCloseModal(),
      },
    ],
    [comments, onCloseModal, onSubmit]
  );

  const displayModal = useCallback(() => {
    openModal({
      title: intl.get('PROJECT_DETAIL.CLOSE_PROJECT.TITLE'),
      size: 'medium',
      children: (
        <Content
          onChangeComments={(value) => setComments(value)}
          finalComments={comments || project.finalComments}
          totalHours={project.actual_time_spent}
          totalCost={project.actual_cost}
          closedDate={closingDate}
          disabled={project.status === PROJECT_STATUS.CLOSED}
        />
      ),
      actionButtons:
        project.status !== PROJECT_STATUS.CLOSED ? actionButtons : undefined,
      childrenClassName: 'h-92',
    });
  }, [setComments, actionButtons, openModal, project, comments, closingDate]);

  useEffect(() => {
    updateModal({
      children: (
        <Content
          onChangeComments={(value) => setComments(value)}
          finalComments={comments || project.finalComments}
          totalHours={project.actual_time_spent}
          totalCost={project.actual_cost}
          closedDate={closingDate}
          disabled={project.status === PROJECT_STATUS.CLOSED}
        />
      ),
      actionButtons,
    });
  }, [actionButtons, updateModal, comments, project, closingDate]);

  useEffect(() => {
    if (shouldDisplayModal && !modalProps.isOpen) {
      displayModal();
    }
  }, [shouldDisplayModal, modalProps.isOpen, displayModal]);

  return (
    <Modal
      {...modalProps}
      aria-label='cancel project confirmation'
      data-cy='close-project-modal'
      closeModal={onCloseModal}
    />
  );
};

export default CloseProject;
