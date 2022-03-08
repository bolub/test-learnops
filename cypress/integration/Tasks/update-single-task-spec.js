describe('Update Task', () => {
  let tasks, constants, newTaskData;

  before(() => {
    cy.fixture('tasks').then((content) => (tasks = content));
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('newTask').then((content) => (newTaskData = content));
    cy.initAmplifyConfiguration();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce(
      'refreshToken',
      'clockDrift',
      'username',
      'connect.sid',
      'csrf-token',
      'jwtToken'
    );
    cy.signInLD();
    cy.interceptApiRequests();
  });

  const visitTaskPage = () => {
    const { api, routes } = constants;
    const {
      selectors: { taskTab },
    } = tasks;

    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    const taskId = '603dcc88-0af3-451f-99f3-b8122e595048';
    const singleTaskRoute = `/project/${projectId}/tasks/${taskId}`;
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');
    cy.intercept(api.fetchTask.replace('*', taskId)).as('fetchTaskDetail');

    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchProjectTasks');
    cy.visit(singleTaskRoute);
    cy.wait('@fetchTaskDetail');
  };

  it('checks for input fields', () => {
    const {
      selectors: { singleTaskPage },
    } = tasks;

    visitTaskPage();

    for (const input in singleTaskPage) {
      cy.get(singleTaskPage[input]).should('be.visible');
    }
  });

  it('checks if task update can be canceled', () => {
    const {
      selectors: {
        singleTaskPage: { taskCancelButton },
      },
      stubbedResponses: { projectForSingleTaskId },
    } = tasks;

    visitTaskPage();

    cy.get(taskCancelButton).click();
    cy.wait('@fetchProjectTasks');
    cy.url().should('include', `/project/${projectForSingleTaskId}`);
  });

  it('checks if task can be updated', () => {
    const { api, routes } = constants;

    const {
      selectors: {
        singleTaskPage: {
          taskTitleInput,
          taskDescriptionInput,
          datePicker,
          taskTypeDropdown,
          estimatedTimeInput,
          taskStatusDropdown,
          taskSaveButton,
          taskAssigneeDropdown,
        },
        taskTab,
      },
    } = tasks;

    const projectId = '78f84733-7552-4e29-9618-21937e1d839e';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');
    cy.visit(routes.projectsList);

    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchProjectTasks');

    cy.customRequest('POST', `${routes.backendURL}${api.createTask}`, {
      ...newTaskData,
      projectId,
    }).then((response) => {
      expect(response.status).to.eq(200);
      const newTask = response.body.data.task;
      cy.intercept(api.fetchTask.replace('*', newTask.id)).as('fetchTask');
      cy.visit(`/project/${projectId}/tasks/${newTask.id}`);
      cy.wait('@fetchTask');

      const updatedData = {
        title: 'Edited and Updated Title',
        description: 'Edited and Updated Description',
        startDate: new Date().getDate() + 5,
        endDate: new Date().getDate() + 10,
        taskType: 'Development',
        estimatedTime: 6,
      };

      cy.get(taskSaveButton).should('be.disabled');

      cy.get(taskTitleInput).clear().type(updatedData.title);

      cy.get(taskDescriptionInput).clear().type(updatedData.description);
      cy.pickStartAndEndDates(datePicker);

      cy.get(taskAssigneeDropdown).should('be.visible').click();

      cy.get(taskTypeDropdown).click();
      cy.selectDropdownItem(updatedData.taskType, updatedData.taskType);

      cy.get(estimatedTimeInput).clear().type(updatedData.estimatedTime);

      cy.get(taskStatusDropdown).click();
      cy.selectDropdownItem('In Progress', 'in_progress');

      cy.get(taskSaveButton).should('not.be.disabled').click();

      cy.url().should('include', `${routes.projectPage}${projectId}`);

      cy.checkSuccessMessage('Edited and Updated Title successfully updated');

      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.createTask}/${newTask.id}`,
        {}
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });
});
