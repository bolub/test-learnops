import get from 'lodash/get';

describe('Task List Page', () => {
  let tasks, constants;

  before(() => {
    cy.fixture('tasks').then((content) => (tasks = content));
    cy.fixture('constants').then((content) => (constants = content));
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

  it('Display the list of tasks in the team table', () => {
    const { api, routes } = constants;
    const {
      selectors: {
        taskTab,
        tasksListTable: {
          taskEnabled,
          taskTitle,
          taskAssignee,
          taskType,
          taskStartDate,
          taskDueDate,
          taskStatus,
          tableRow,
        },
      },
    } = tasks;

    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');

    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchProjectTasks').then((payload) => {
      const responseData = get(payload, 'response.body.data.orderedTasks');

      expect(responseData).not.to.be.empty;

      cy.get(taskEnabled).should('be.visible');
      cy.get(taskTitle).should('be.visible');
      cy.get(taskAssignee).should('be.visible');
      cy.get(taskType).should('be.visible');
      cy.get(taskStartDate).should('be.visible');
      cy.get(taskDueDate).should('be.visible');
      cy.get(taskStatus).should('be.visible');

      responseData.map((data) => {
        cy.get(tableRow.replace('*', data.id)).should('be.visible');
        return null;
      });
    });
  });

  it('Display the list of tasks in the my tasks table', () => {
    const { api, routes } = constants;
    const {
      selectors: {
        taskTab,
        tasksListTable: {
          myTasksTab,
          taskEnabled,
          taskTitle,
          taskAssignee,
          taskType,
          taskStartDate,
          taskDueDate,
          taskStatus,
          tableRow,
        },
      },
    } = tasks;

    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchMyTasks.replace('*', projectId)).as('fetchMyTasks');

    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchMyTasks').then((payload) => {
      const responseData = get(
        payload,
        'response.body.data.assignedTasksForUser'
      );

      expect(responseData).not.to.be.empty;
      cy.get(myTasksTab).click();

      cy.get(taskEnabled).should('be.visible');
      cy.get(taskTitle).should('be.visible');
      cy.get(taskAssignee).should('be.visible');
      cy.get(taskType).should('be.visible');
      cy.get(taskStartDate).should('be.visible');
      cy.get(taskDueDate).should('be.visible');
      cy.get(taskStatus).should('be.visible');

      responseData.map((data) => {
        cy.get(tableRow.replace('*', data.id)).should('be.visible');
        return null;
      });
    });
  });

  it('Checks empty teams task table', () => {
    const { api, routes } = constants;
    const {
      selectors: {
        addTaskButton,
        taskTab,
        tasksListTable: { taskEmpty },
      },
    } = tasks;

    const projectId = '78f84733-7552-4e29-9618-21937e1d839e';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');

    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchProjectTasks');

    cy.get(taskEmpty).should('be.visible');
    cy.get(addTaskButton).should('be.visible');
  });

  it('Checks empty my task table', () => {
    const { api, routes } = constants;
    const {
      selectors: {
        addTaskButton,
        taskTab,
        tasksListTable: { taskEmpty, myTasksTab },
      },
    } = tasks;

    const projectId = '78f84733-7552-4e29-9618-21937e1d839e';
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchMyTasks.replace('*', projectId)).as('fetchMyTasks');

    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchMyTasks');
    cy.get(myTasksTab).should('be.visible').click();

    cy.get(taskEmpty).should('be.visible');
    cy.get(addTaskButton).should('be.visible');
  });
});
