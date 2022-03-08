describe('Create Task', () => {
  let tasks, projects, newProjectData, constants;

  before(() => {
    cy.fixture('tasks').then((content) => (tasks = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('newProject').then((content) => (newProjectData = content));
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

  it('checks if add task button is visible and clickable', () => {
    const { selectors } = tasks;
    const {
      stubbedResponses: { newProject },
    } = projects;

    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:8001/api/project/*',
      },
      newProject
    ).as('fetchProject');
    cy.visit(`/project/${newProject.data.id}`);
    cy.wait('@fetchProject');
    cy.get(selectors.taskTab).should('be.visible').click();
    cy.get(selectors.addTaskButton).should('be.visible').click();
  });

  it('checks if task creation modal is visible', () => {
    const { selectors } = tasks;
    const {
      stubbedResponses: { newProject },
    } = projects;

    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:8001/api/project/*',
      },
      newProject
    ).as('fetchProject');
    cy.visit(`/project/${newProject.data.id}`);
    cy.wait('@fetchProject');
    cy.get(selectors.taskTab).should('be.visible').click();
    cy.get(selectors.addTaskButton).should('be.visible').click();
    cy.get(selectors.taskModal).should('be.visible');
  });

  it('checks if task is added successfully', () => {
    const { selectors } = tasks;
    const { api, routes } = constants;

    const taskInformation = Date.now();

    cy.visit(routes.projectsList);

    cy.customRequest(
      'POST',
      `${routes.backendURL}${api.createProject}`,
      newProjectData
    ).then((response) => {
      expect(response.status).to.eq(200);
      const newProject = response.body.data;

      cy.intercept({
        method: 'GET',
        url: 'http://localhost:8001/api/project/*',
      }).as('fetchProject');

      cy.visit(`/project/${newProject.id}`);
      cy.wait('@fetchProject');
      cy.get(selectors.taskTab).should('be.visible').click();
      cy.get(selectors.addTaskButton).should('be.visible').click();
      cy.get(selectors.taskModal).should('be.visible');

      cy.get(selectors.taskTitle)
        .should('be.visible')
        .click()
        .type(taskInformation);
      cy.get(selectors.taskDescription)
        .should('be.visible')
        .click()
        .type(taskInformation);
      cy.get(selectors.taskType).click();
      cy.selectDropdownItem('Research', 'Research');
      cy.pickStartAndEndDates(selectors.taskDate);
      cy.get(selectors.taskAssignee).should('be.visible').click();
      cy.get(selectors.estimatedTime).should('be.visible').click().type(100);
      cy.get('input[type="checkbox"]').eq(2).check({ force: true });

      cy.intercept({
        method: 'POST',
        url: api.createTask,
      }).as('createTask');

      cy.get(selectors.confirmTaskButton).should('be.visible').click();

      cy.wait('@createTask').then((response) => {
        cy.get(selectors.taskSuccessModal).should('be.visible');

        cy.customRequest(
          'DELETE',
          `${routes.backendURL}${api.createProject}/${newProject.id}`,
          {}
        ).then((resp) => expect(resp.status).to.eq(200));

        const newTask = response?.response.body.data.task;

        cy.customRequest(
          'DELETE',
          `${routes.backendURL}${api.createTask}/${newTask.id}`,
          {}
        ).then((resp) => expect(resp.status).to.eq(200));
      });
    });
  });
});
