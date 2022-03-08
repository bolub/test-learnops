describe('Disable/Enable task flow', () => {
  let tasks, newTaskData, constants;

  before(() => {
    cy.fixture('tasks').then((content) => (tasks = content));
    cy.fixture('newTask').then((content) => (newTaskData = content));
    cy.fixture('constants').then((content) => (constants = content));

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

  it('Disable/Enable Task', () => {
    const { routes, api } = constants;
    const { selectors } = tasks;
    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(selectors.taskTab).should('be.visible').click();
    cy.wait('@fetchProjectTasks');
    cy.customRequest(
      'POST',
      `${routes.backendURL}${api.createTask}`,
      newTaskData
    ).then((response) => {
      expect(response.status).to.eq(200);
      const newTask = response.body.data.task;
      const singleTaskRoute = `/project/${projectId}/tasks/${newTask.id}`;
      cy.intercept(singleTaskRoute).as('fetchTask');
      cy.intercept('PUT', api.updateTaskEnablement.replace('$', newTask.id)).as(
        'updateTaskEnablement'
      );
      cy.visit(singleTaskRoute);
      cy.wait('@fetchTask');
      cy.get(selectors.taskEnablementToggle).click();
      cy.wait('@updateTaskEnablement');
      cy.get(selectors.singleTaskPage.onHoldInlineNotification).should(
        'be.visible'
      );
      cy.get(selectors.singleTaskPage.taskTitleInput).should('be.disabled');
      cy.get(selectors.taskEnablementToggle).click();
      cy.wait('@updateTaskEnablement');
      cy.get(selectors.singleTaskPage.onHoldInlineNotification).should(
        'not.exist'
      );
      cy.get(selectors.singleTaskPage.taskTitleInput).should('not.be.disabled');
      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.createTask}/${newTask.id}`,
        {}
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });
});
