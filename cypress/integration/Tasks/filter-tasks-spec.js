describe('Filter tasks', () => {
  let tasks, constants;

  before(() => {
    cy.fixture('tasks').then((content) => (tasks = content));
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

  const validateAppliedFilter = (filters = []) => {
    const {
      selectors: { tasksListTable },
    } = tasks;
    cy.get(tasksListTable.tasksTable)
      .eq(0)
      .find('tbody')
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
              for (const filter of filters) {
                if (filter.contains) {
                  cy.expect($values).to.include.members([filter.value]);
                } else {
                  cy.expect($values).to.not.include.members([filter.value]);
                }
              }
            });
        });
      });
  };

  const validateNumberOfExpectedMatches = (number) => {
    const {
      selectors: { tasksListTable },
    } = tasks;
    cy.get(tasksListTable.tasksTable)
      .eq(0)
      .find('tbody')
      .within(() => {
        cy.get('tr').should('have.length', number);
      });
  };

  const filterTableBy = (column, operator, value, shouldRemove = true) => {
    const {
      selectors: { tableFilters },
    } = constants;

    cy.get(tableFilters.columnTitleDropdown).first().click();
    cy.contains(column).should('be.visible').click();

    cy.get(tableFilters.operatorDropdown).first().click();
    cy.contains(operator).should('be.visible').click();

    cy.get(tableFilters.filterValuePicker).first().click();
    cy.get(tableFilters.filterValueOptions)
      .should('be.visible')
      .contains(value)
      .click();

    cy.get(tableFilters.applyButton).first().click();

    if (shouldRemove) {
      validateAppliedFilter([{ value, contains: operator === 'Equal to' }]);
      cy.get(tableFilters.tagCloseButton).click();
    }
  };

  it('Filters tasks by different columns', () => {
    const {
      routes,
      api,
      selectors: { tableFilters },
    } = constants;
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
    cy.get(tableFilters.filterButton).eq(0).should('be.visible').click();
    cy.get(tableFilters.filterComponent).eq(0).should('be.visible');
    filterTableBy('Task Type', 'Equal to', 'Development');
    filterTableBy('Status', 'Not equal to', 'In Progress', false);
    validateAppliedFilter('In Progress', false);
    cy.get(tableFilters.tagCloseButton).click();
    filterTableBy('Task Assignee', 'Equal to', 'Abir Halwa', false);
    validateNumberOfExpectedMatches(2);
    cy.get(tableFilters.tagCloseButton).click();
  });

  it('Applies different filters using the AND logic operator', () => {
    const {
      routes,
      api,
      selectors: { tableFilters },
    } = constants;
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
    cy.get(tableFilters.filterButton).eq(0).should('be.visible').click();
    cy.get(tableFilters.filterComponent).eq(0).should('be.visible');
    filterTableBy('Task Type', 'Equal to', 'Development', false);
    cy.get(tableFilters.ANDButton).click();
    filterTableBy('Status', 'Not equal to', 'In Progress', false);
    validateAppliedFilter([
      { value: 'Development', contains: true },
      { vale: 'In Progress', contains: false },
    ]);
    cy.get(tableFilters.clearAllButton).click();
  });

  it('Applies different filters using the OR logic operator', () => {
    const {
      routes,
      api,
      selectors: { tableFilters },
    } = constants;
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
    cy.get(tableFilters.filterButton).eq(0).should('be.visible').click();
    cy.get(tableFilters.filterComponent).eq(0).should('be.visible');
    filterTableBy('Task Assignee', 'Not equal to', 'Abir Halwa', false);
    cy.get(tableFilters.ORButton).click();
    filterTableBy('Status', 'Equal to', 'New', false);
    validateNumberOfExpectedMatches(3);
    cy.get(tableFilters.clearAllButton).click();
  });
});
