import { useState, Fragment } from 'react';
import { Button } from '@getsynapse/design-system';
import TaskModal from './components/TaskModal/TaskModal';
import { taskModalDefaultValues } from './helpers/constants';

const AddTaskModal: React.FC<{
  renderText: string;
  componentType?: string;
}> = ({ renderText, componentType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Fragment>
      <Button
        onClick={() => setIsModalOpen(true)}
        className='mt-4 px-4 py-2'
        data-cy={`${componentType}-add-task-button`}
        size='small'
      >
        {renderText}
      </Button>

      <TaskModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        taskData={taskModalDefaultValues}
        duplicateTaskCheck={false}
      />
    </Fragment>
  );
};

export default AddTaskModal;
