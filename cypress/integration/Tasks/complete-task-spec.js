describe('Complete Task', () => {
  let tasks, projects, constants, newTaskData, newProjectData;

  before(() => {
    cy.fixture('tasks').then((content) => (tasks = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('newTask').then((content) => (newTaskData = content));
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('newProject').then((content) => (newProjectData = content));

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

  it('checks if task fields are disabled when status is completed', () => {
    const {
      selectors: {
        taskActualHours,
        singleTaskPage: {
          taskTitleInput,
          taskDescriptionInput,
          taskTypeDropdown,
          datePicker,
          estimatedTimeInput,
          taskAssigneeDropdown,
          taskStatusDropdown,
          taskSaveButton,
          linkFileButton,
        },
      },
      stubbedResponses: { completedTasks },
    } = tasks;
    const {
      stubbedResponses: { newProject },
    } = projects;
    const { api, routes } = constants;

    cy.visit(routes.projectsList);

    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:8001/api/project/*',
      },
      newProject
    ).as('fetchProject');

    cy.intercept(
      {
        method: 'GET',
        url: api.fetchTask,
      },
      completedTasks
    ).as('fetchTask');
    cy.visit(`/project/${newProject.data.id}`);
    cy.wait('@fetchProject');

    cy.visit(`/project/${newProject.id}/tasks/${completedTasks.id}`);

    cy.get(taskTitleInput).should('be.disabled');
    cy.get(taskDescriptionInput).should('be.disabled');
    cy.get(taskTypeDropdown).should('have.attr', 'aria-disabled', 'true');
    cy.get(datePicker).should('have.class', 'cursor-not-allowed');
    cy.get(estimatedTimeInput).should('be.disabled');
    cy.get(taskStatusDropdown).should('have.attr', 'aria-disabled', 'true');
    cy.get(taskAssigneeDropdown).should('be.disabled');
    cy.get(taskSaveButton).should('be.disabled');
    cy.get(taskActualHours).should('be.disabled');
    cy.get(linkFileButton).should('be.disabled');
  });

  it('checks if task status can be completed', () => {
    const {
      selectors: {
        taskActualHours,
        singleTaskPage: { taskStatusDropdown, taskSaveButton },
        taskTab,
      },
    } = tasks;
    const { api, routes } = constants;

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
      const taskRoute = `/project/${projectId}/tasks/${newTask.id}`;
      cy.intercept(api.fetchTask.replace('*', newTask.id)).as('fetchTask');
      cy.visit(taskRoute);
      cy.wait('@fetchTask');
      cy.get(taskStatusDropdown).click();
      cy.selectDropdownItem('Completed', 'completed');
      cy.get(taskActualHours).click().type(43);

      cy.get(taskSaveButton).should('not.be.disabled').click();

      cy.url().should('include', `${routes.projectPage}${projectId}`);

      cy.checkSuccessMessage(`${newTaskData.name} successfully updated`);

      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.createTask}/${newTask.id}`,
        {}
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });
});
