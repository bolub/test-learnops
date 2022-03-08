import get from 'lodash/get';

describe('Reorder Task e2e', () => {
  let constants, tasks;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('tasks').then((content) => (tasks = content));
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

  const visitTaskListPage = () => {
    const { api, routes } = constants;
    const {
      selectors: { taskTab },
    } = tasks;

    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');

    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
  };

  const checkRow = (tableIndex, valueToCheck) => {
    const {
      selectors: { tasksListTable },
    } = tasks;
    cy.get(tasksListTable.tasksTable)
      .eq(tableIndex)
      .get('tbody')
      .within(() => {
        cy.get('tr').each(($row) => {
          cy.wrap($row)
            .get('td')
            .then(($columns) => {
              const values = [];
              for (const $column of $columns) {
                if ($column.innerText) {
                  values.push($column.innerText);
                }
              }
              return values;
            })
            .then(($values) => {
              cy.expect($values).to.include.members([valueToCheck]);
            });
        });
      });
  };

  it('Checks for reorder fields and components', () => {
    const {
      selectors: {
        tasksListTable: {
          taskReorderButton,
          taskReorderUpRowIcon,
          taskReorderDownRowIcon,
        },
      },
    } = tasks;

    visitTaskListPage();

    cy.wait('@fetchProjectTasks').then((payload) => {
      const tasksData = get(payload, 'response.body.data.orderedTasks');

      cy.get(taskReorderButton).should('be.visible').click();

      tasksData.forEach((task) => {
        cy.get(taskReorderUpRowIcon.replace('$', task.id)).should('be.visible');
        cy.get(taskReorderDownRowIcon.replace('$', task.id)).should(
          'be.visible'
        );
      });
    });
  });

  it('Checks for disabled fields', () => {
    const {
      selectors: {
        tasksListTable: {
          taskReorderButton,
          taskReorderUpRowIcon,
          taskReorderDownRowIcon,
          tasksFilterButton,
          tasksExportButton,
        },
      },
    } = tasks;

    visitTaskListPage();

    cy.wait('@fetchProjectTasks').then((payload) => {
      const tasksData = get(payload, 'response.body.data.orderedTasks');

      cy.get(taskReorderButton).should('be.visible').click();
      cy.get(tasksFilterButton).should('be.disabled');
      cy.get(tasksExportButton).should('be.disabled');

      cy.get(taskReorderUpRowIcon.replace('$', tasksData[0].id))
        .should('be.visible')
        .and('have.attr', 'aria-disabled', 'true');

      cy.get(taskReorderDownRowIcon.replace('$', tasksData[0].id))
        .should('be.visible')
        .and('have.attr', 'aria-disabled', 'false');

      cy.get(
        taskReorderDownRowIcon.replace('$', tasksData[tasksData.length - 1].id)
      )
        .should('be.visible')
        .and('have.attr', 'aria-disabled', 'true');

      cy.get(
        taskReorderUpRowIcon.replace('$', tasksData[tasksData.length - 1].id)
      )
        .should('be.visible')
        .and('have.attr', 'aria-disabled', 'false');
    });
  });

  it('Checks reorder functionality', () => {
    const { api } = constants;

    const {
      selectors: {
        tasksListTable: {
          taskReorderButton,
          taskReorderUpRowIcon,
          taskReorderDownRowIcon,
        },
      },
    } = tasks;

    visitTaskListPage();

    cy.wait('@fetchProjectTasks').then((payload) => {
      const tasksData = get(payload, 'response.body.data.orderedTasks');

      cy.get(taskReorderButton).should('be.visible').click();

      cy.intercept(
        'PUT',
        `${api.fetchProjects}/d5b298c3-9393-4efe-b1bf-8fabd5306484`
      ).as('updateProject');

      cy.get(taskReorderDownRowIcon.replace('$', tasksData[0].id))
        .eq(0)
        .click();

      cy.wait('@updateProject');

      checkRow(1, 'Test project 1 - task 4');

      cy.get(taskReorderUpRowIcon.replace('$', tasksData[0].id)).eq(0).click();

      cy.wait('@updateProject');

      checkRow(0, 'Test project 1 - task 4');
    });
  });
});
