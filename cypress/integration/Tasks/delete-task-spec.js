describe('Delete Task', () => {
  let tasks, projects, constants, newTaskData;

  before(() => {
    cy.fixture('tasks').then((content) => (tasks = content));
    cy.fixture('projects').then((content) => (projects = content));
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

  it('checks if delete task modal is visible and task can be deleted', () => {
    const {
      selectors: {
        moreActionsButton,
        deleteTask: { deleteTaskButton, deleteTaskModal, confirmButton },
        taskTab,
      },
    } = tasks;
    const {
      stubbedResponses: { newProject },
    } = projects;
    const { api, routes } = constants;

    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchProjectTasks');

    cy.customRequest(
      'POST',
      `${routes.backendURL}${api.createTask}`,
      newTaskData
    ).then((response) => {
      expect(response.status).to.eq(200);
      const newTask = response.body.data.task;
      cy.intercept('DELETE', api.updateTask.replace('*', newTask.id)).as(
        'deleteTask'
      );
      cy.visit(`/project/${newProject.data.id}/tasks/${newTask.id}`);
      cy.get(moreActionsButton).should('be.visible').click();
      cy.get(deleteTaskButton).should('be.visible').click();
      cy.get(deleteTaskModal).should('be.visible');
      cy.get(confirmButton).should('be.visible').click();
      cy.wait('@deleteTask');
      cy.checkSuccessMessage(`${newTaskData.name} was deleted.`);
      cy.url().should('include', `${routes.projectPage}${newProject.data.id}`);
    });
  });

  it('checks if delete task modal can be cancelled', () => {
    const {
      selectors: {
        moreActionsButton,
        deleteTask: { deleteTaskButton, deleteTaskModal, cancelButton },
      },
      stubbedResponses: { teamsTasks },
    } = tasks;
    const {
      stubbedResponses: { newProject },
    } = projects;
    const { api, routes } = constants;

    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:8001/api/project/*',
      },
      newProject
    ).as('fetchProject');
    cy.intercept(
      api.fetchTeamTasks.replace('*', newProject.data.id),
      teamsTasks
    ).as('teamTasks');

    cy.customRequest(
      'POST',
      `${routes.backendURL}${api.createTask}`,
      newTaskData
    ).then((response) => {
      expect(response.status).to.eq(200);
      const newTask = response.body.data.task;
      cy.visit(`/project/${newProject.data.id}/tasks/${newTask.id}`);
      cy.get(moreActionsButton).should('be.visible').click();
      cy.get(deleteTaskButton).should('be.visible').click();
      cy.get(deleteTaskModal).should('be.visible');
      cy.get(cancelButton).should('be.visible').click();
      cy.url().should('include', `${routes.projectPage}${newProject.data.id}`);
      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.createTask}/${newTask.id}`,
        {}
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });
});
