import { useState } from 'react';
import intl from 'react-intl-universal';
import MoreActions from 'Organisms/MoreActions/MoreActions';
import DeleteTask from '../DeleteTask/DeleteTask';
import { MoreActionsOption } from 'utils/customTypes';
import { TASKS_MORE_ACTIONS } from 'utils/constants';

const TaskActions: React.FC<{
  deleteTaskCallback: () => void;
}> = ({ deleteTaskCallback }) => {
  const [displayDeleteTaskModal, setDisplayDeleteTaskModal] = useState(false);

  const handleSelectOption = (option: MoreActionsOption) => {
    if (option.selectOption) {
      option.selectOption();
    }

    if (option.value === TASKS_MORE_ACTIONS.DELETE) {
      setDisplayDeleteTaskModal(true);
    }
  };

  return (
    <>
      <DeleteTask
        confirmDeleteTask={deleteTaskCallback}
        shouldDisplayModal={displayDeleteTaskModal}
        onCloseModal={() => setDisplayDeleteTaskModal(false)}
      />
      <MoreActions
        options={[
          {
            value: TASKS_MORE_ACTIONS.DELETE,
            label: intl.get(
              'TASKS.TASK_DETAIL_PAGE.MORE_ACTIONS_DROPDOWN.DELETE'
            ),
            iconName: 'trash',
            dataCy: 'delete-task-button',
          },
        ]}
        onSelectOption={handleSelectOption}
      />
    </>
  );
};

export default TaskActions;
