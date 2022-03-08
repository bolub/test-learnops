import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { Typography } from '@getsynapse/design-system';
import ProcessesTable from './components/ProcessesTable';
import { getOrganizationProcesses } from 'state/Processes/processesSlice';
import { fetchProjects } from 'state/Projects/projectsSlice';

const ProjectSettings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrganizationProcesses());
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className='px-4'>
      <Typography variant='h4'>
        {intl.get('SETTINGS_PAGE.PROJECTS_PAGE.PAGE_TITLE')}
      </Typography>

      <Typography variant='caption' className='text-neutral'>
        {intl.get('SETTINGS_PAGE.PROJECTS_PAGE.PAGE_SUB_TITLE')}
      </Typography>
      <ProcessesTable />
    </div>
  );
};

export default ProjectSettings;
