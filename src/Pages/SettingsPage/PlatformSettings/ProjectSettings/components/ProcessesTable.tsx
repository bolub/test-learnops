import { useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import intl from 'react-intl-universal';
import moment from 'moment';
import { Table, Typography, Button } from '@getsynapse/design-system';
import { DATE } from 'utils/constants';
import { ProjectProcess } from 'utils/customTypes';
import { formattedProjectProcesses } from 'state/Processes/processesSlice';
import { selectAssociatedProcessesAndStages } from 'state/Projects/projectsSlice';
import TableAvatar from 'Molecules/TableAvatar';
import synapseAvatar from 'assets/images/synapseAvatar.png';
import ProcessModal from './ProcessModal';
import RemoveProcessConfirmationModal from './RemoveProcessConfirmationModal';

const ProcessesTable = () => {
  const processes = useSelector(formattedProjectProcesses);
  const associatedProjectProcesses = useSelector(
    selectAssociatedProcessesAndStages
  );
  const [selectedProcess, setSelectedProcess] = useState<ProjectProcess | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveConfirmationModalOpen, setIsRemoveConfirmationModalOpen] =
    useState(false);

  const handleEditProcess = (process: ProjectProcess) => {
    setSelectedProcess(process);
    setIsModalOpen(true);
  };

  const handleRemoveProcess = (process: ProjectProcess) => {
    setSelectedProcess(process);
    setIsRemoveConfirmationModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (selectedProcess !== null) {
      setSelectedProcess(null);
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsRemoveConfirmationModalOpen(false);
    setSelectedProcess(null);
  };

  return (
    <div className='pt-4'>
      <ProcessModal
        isModalOpen={isModalOpen}
        process={selectedProcess}
        onCloseModalHandle={handleCloseModal}
      />
      <RemoveProcessConfirmationModal
        isModalOpen={isRemoveConfirmationModalOpen}
        process={selectedProcess}
        onCloseModalHandle={handleCloseConfirmationModal}
      />
      <div className='flex justify-between items-baseline'>
        <Typography variant='h5' className='py-4'>
          {intl.get('SETTINGS_PAGE.PROJECTS_PAGE.PROCESSES')}
        </Typography>
        <Button
          onClick={() => setIsModalOpen(true)}
          data-cy='projects-settings__add-process-button'
        >
          {intl.get('SETTINGS_PAGE.PROJECTS_PAGE.ADD_PROCESS')}
        </Button>
      </div>

      <Table
        className='w-full mb-5'
        canSelectRows={false}
        data-cy='projects-settings__processes-table'
        data={{
          headData: {
            headCells: [
              {
                content: intl.get('SETTINGS_PAGE.PROJECTS_PAGE.PROCESS_NAME'),
                className: 'font-semibold w-1/4',
              },
              {
                content: intl.get('SETTINGS_PAGE.PROJECTS_PAGE.ESTIMATE_TIME'),
                className: 'font-semibold w-1/5',
              },
              {
                content: intl.get('SETTINGS_PAGE.PROJECTS_PAGE.CREATED_BY'),
                className: 'font-semibold w-1/5',
              },
              {
                content: intl.get('SETTINGS_PAGE.PROJECTS_PAGE.CREATION_DATE'),
                className: 'font-semibold w-1/5',
              },
              {
                content: '',
                className: 'font-semibold w-1/12',
              },
            ],
          },
          rows: processes.map((process: ProjectProcess) => {
            const isDefaultProcess = get(
              process,
              'data.createdBySystem',
              false
            );
            const isProcessAssociated = has(
              associatedProjectProcesses,
              process.id
            );
            const avatarURL = isDefaultProcess ? synapseAvatar : '';
            const avatarName = isDefaultProcess
              ? intl.get('SETTINGS_PAGE.PROJECTS_PAGE.SYSTEM')
              : get(process, 'data.createdBy.name');
            const canRemoveProcess = !isDefaultProcess && !isProcessAssociated;
            return {
              id: process.id,
              'data-cy': `projects-settings__processes-table__process-${process.id}`,
              cells: [
                {
                  content: process.processName,
                },
                {
                  content: process.estimatedCompletionTime
                    ? intl.get(
                        'SETTINGS_PAGE.PROJECTS_PAGE.ESTIMATED_COMPLETION_TIME',
                        { time: process.estimatedCompletionTime }
                      )
                    : intl.get(
                        'SETTINGS_PAGE.PROJECTS_PAGE.NO_ESTIMATED_COMPLETION_TIME'
                      ),
                },
                {
                  content: (
                    <TableAvatar
                      user={{
                        avatar_url: avatarURL,
                        data: {
                          firstName: avatarName.split(' ')[0],
                          lastName: avatarName.split(' ')[1] || '',
                          email: '',
                        },
                      }}
                    />
                  ),
                },
                {
                  content: process.createdAt
                    ? moment(process.createdAt).format(
                        DATE.MONTH_DATE_YEAR_FORMAT
                      )
                    : '-',
                },
                {
                  content: (
                    <div className='flex justify-between'>
                      <Button
                        className='text-sm text-primary'
                        variant='tertiary'
                        onClick={() => handleEditProcess(process)}
                        data-cy={`projects-settings__processes-table__edit-button`}
                      >
                        {intl.get('SETTINGS_PAGE.PROJECTS_PAGE.EDIT')}
                      </Button>
                      <Button
                        className='text-sm text-primary'
                        variant='tertiary'
                        onClick={() => handleRemoveProcess(process)}
                        disabled={!canRemoveProcess}
                        data-cy={`projects-settings__processes-table__remove-button`}
                      >
                        {intl.get('SETTINGS_PAGE.PROJECTS_PAGE.REMOVE')}
                      </Button>
                    </div>
                  ),
                },
              ],
            };
          }),
        }}
      />
    </div>
  );
};

export default ProcessesTable;
