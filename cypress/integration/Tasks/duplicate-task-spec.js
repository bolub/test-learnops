import get from 'lodash/get';

describe('Duplicate Task', () => {
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
  const composeOwnerData = (user) => {
    const firstName = user.data.firstName;
    const lastName = user.data.lastName;

    return {
      label: `${firstName} ${lastName}`,
      avatar: { initial: `${firstName.charAt(0)}${lastName.charAt(0)}` },
      value: user.id,
    };
  };
  it('checks if duplicate task modal is visible', () => {
    const { api, routes } = constants;
    const {
      selectors: {
        taskTab,
        taskModal,
        tasksListTable: { tableRow, menuButton, duplicateMenuOption },
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

      cy.get(tableRow.replace('*', responseData[0].id)).should('be.visible');
      cy.get(menuButton).eq(0).should('be.visible').click();
      cy.get(duplicateMenuOption.replace('$', responseData[0].id))
        .should('be.visible')
        .first()
        .click({ force: true });
      cy.get(taskModal).should('be.visible');
    });
  });

  it('checks if task is duplicated successfully', () => {
    const { api, routes } = constants;
    const {
      selectors: {
        taskTab,
        taskModal,
        taskDate,
        taskAssignee,
        estimatedTime,
        confirmTaskButton,
        tasksListTable: { tableRow, menuButton, duplicateMenuOption },
      },
    } = tasks;
    const {
      stubbedResponses: { projectLdUsers },
    } = projects;
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

      cy.get(tableRow.replace('*', responseData[0].id)).should('be.visible');
      cy.get(menuButton).eq(0).should('be.visible').click();
      cy.get(duplicateMenuOption.replace('$', responseData[0].id))
        .should('be.visible')
        .first()
        .click({ force: true });
      cy.get(taskModal).should('be.visible');
      cy.pickStartAndEndDates(taskDate);
      cy.get(taskAssignee).should('be.visible').click();
      cy.get(
        `[data-value='${JSON.stringify(
          composeOwnerData(projectLdUsers.data[0])
        )}']`
      )
        .should('be.visible')
        .click();
      cy.get(estimatedTime).should('be.visible').click().clear().type(100);

      cy.intercept({
        method: 'POST',
        url: api.createTask,
      }).as('createTask');

      cy.get(confirmTaskButton).should('be.visible').click();

      cy.wait('@createTask').then((response) => {
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
