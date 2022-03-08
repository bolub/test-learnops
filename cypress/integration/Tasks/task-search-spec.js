describe('Task Search', () => {
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
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchTeamTasks).as('fetchProjectTasks');

    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`${routes.projectPage}${projectId}`);
    cy.wait('@fetchProject');
    cy.get(taskTab).should('be.visible').click();
    cy.wait('@fetchProjectTasks');
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

  it('Should not display any tasks that do not match the search paramters', () => {
    const {
      selectors: {
        tasksListTable: { taskSearchInput, taskEmpty, myTasksTab },
      },
    } = tasks;

    visitTaskListPage();
    cy.get(taskSearchInput).eq(0).type('dummy request');
    cy.get(taskEmpty).eq(0).should('be.visible');

    cy.get(myTasksTab).should('be.visible').click();
    cy.get(taskSearchInput).eq(1).type('dummy request');
    cy.get(taskEmpty).eq(1).should('be.visible');
  });

  it('Should display tasks that match the search paramters', () => {
    const {
      selectors: {
        tasksListTable: { taskSearchInput, myTasksTab },
      },
    } = tasks;

    visitTaskListPage();

    cy.get(taskSearchInput).eq(0).type('Test project 1 - task 4');

    checkRow(0, 'Test project 1 - task 4');
    cy.get(myTasksTab).should('be.visible').click();
    cy.get(taskSearchInput).eq(1).type('Test project 1 - task 1');
    checkRow(1, 'Test project 1 - task 1');
  });
});
