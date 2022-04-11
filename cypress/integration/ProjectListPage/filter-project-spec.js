describe('Filter projects', () => {
  let constants, projects;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
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

  const checkRow = (
    tableSelector,
    firstValueToCheck,
    secondValueToCheck,
    thirdValueToCheck
  ) => {
    cy.get(`${tableSelector} > tbody`).within(() => {
      cy.get('tr').each((row) => {
        if (firstValueToCheck) {
          cy.wrap(row).contains(firstValueToCheck);
        }

        if (secondValueToCheck) {
          cy.wrap(row).should('contain', secondValueToCheck);
        }

        if (thirdValueToCheck) {
          cy.wrap(row).should('contain', thirdValueToCheck);
        }
      });
    });
  };

  const checkSingleRow = (tableSelector, rowNumber, valueToCheck) => {
    cy.get(`${tableSelector} > tbody`).within(() => {
      cy.get('tr').eq(rowNumber).contains(valueToCheck);
    });
  };

  const filterAndRemove = (column, operator, inputValue) => {
    const {
      selectors: {
        projectsListTable: {
          columnTitleDropdown,
          operatorDropdown,
          filterValueInput,
          applyButton,
          tagCloseButton,
          teamProjectsTable,
        },
      },
    } = projects;

    cy.get(columnTitleDropdown).first().click();
    cy.contains(column).should('be.visible').click();

    cy.get(operatorDropdown).first().click();
    cy.contains(operator).should('be.visible').click();

    cy.get(filterValueInput).first().type(inputValue);
    cy.get(applyButton).first().click();

    checkRow(teamProjectsTable, inputValue);

    cy.get(tagCloseButton).click();
  };

  const filterWithoutRemove = (column, operator, inputValue) => {
    const {
      selectors: {
        projectsListTable: {
          columnTitleDropdown,
          operatorDropdown,
          filterValueInput,
          applyButton,
        },
      },
    } = projects;

    cy.get(columnTitleDropdown).first().click();
    cy.contains(column).should('be.visible').click();

    cy.get(operatorDropdown).first().click();
    cy.contains(operator).should('be.visible').click();

    cy.get(filterValueInput).first().type(inputValue);
    cy.get(applyButton).first().click();
  };

  it('checks empty state', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: { filterButton, teamProjectsEmpty },
      },
      stubbedResponses: { projectList },
    } = projects;

    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');

    cy.intercept(api.myProjects).as('myProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@teamProjectsList');
    cy.wait('@myProjectsList');

    cy.get(filterButton).first().click();

    filterWithoutRemove('Project Name', 'Contains', 'New Project');

    cy.get(teamProjectsEmpty).should('be.visible');
  });

  it('filters requests using different conditionals', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: { filterButton },
      },
      stubbedResponses: { projectList },
    } = projects;

    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');

    cy.intercept(api.myProjects).as('myProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@teamProjectsList');
    cy.wait('@myProjectsList');

    cy.get(filterButton).first().click();

    filterAndRemove('Project Number', 'Equal to', '1');
    filterAndRemove('Project Name', 'Contains', 'Test Company 1 - Project 2');
    filterAndRemove('Status', 'Contains', 'New');
    filterAndRemove('Project Owner', 'Contains', 'Abir');
    // filterAndRemove('Budget Source', 'Contains', 'ld_budget');
  });

  it('checks multiple filters using AND operator', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: {
          filterButton,
          ANDButton,
          clearAllButton,
          teamProjectsTable,
        },
      },
      stubbedResponses: { projectList },
    } = projects;

    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');

    cy.intercept(api.myProjects).as('myProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@teamProjectsList');
    cy.wait('@myProjectsList');

    cy.get(filterButton).first().click();

    filterWithoutRemove('Project Number', 'Equal to', '1');
    checkRow(teamProjectsTable, '1');

    cy.get(ANDButton).click();

    filterWithoutRemove(
      'Project Name',
      'Contains',
      'Test Company 1 - Project 1'
    );
    checkRow(teamProjectsTable, '1', 'Test Company 1 - Project 1');

    cy.get(ANDButton).click();

    filterWithoutRemove('Priority', 'Contains', 'High');
    checkRow(teamProjectsTable, '1', 'Test Company 1 - Project 1', 'High');

    cy.get(clearAllButton).contains('Clear All').click();
  });

  it('checks multiple filters using OR operator', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: {
          filterButton,
          ORButton,
          clearAllButton,
          teamProjectsTable,
        },
      },
      stubbedResponses: { projectList },
    } = projects;

    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');

    cy.intercept(api.myProjects).as('myProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@teamProjectsList');
    cy.wait('@myProjectsList');

    cy.get(filterButton).first().click();

    filterWithoutRemove('Project Number', 'Equal to', '2');
    checkRow(teamProjectsTable, '2');

    cy.get(ORButton).click();

    filterWithoutRemove(
      'Project Name',
      'Contains',
      'Test Company 1 - Project 1'
    );

    checkSingleRow(teamProjectsTable, 0, 'Test Company 1 - Project 1');
    checkSingleRow(teamProjectsTable, 1, '2');

    cy.get(ORButton).click();
    filterWithoutRemove('Priority', 'Contains', 'High');

    checkSingleRow(teamProjectsTable, 0, 'Test Company 1 - Project 1');
    checkSingleRow(teamProjectsTable, 1, '2');
    checkSingleRow(teamProjectsTable, 0, 'High');

    cy.get(clearAllButton).contains('Clear All').click();
  });

  it('checks filters using AND and OR operators simultaneously', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: {
          filterButton,
          ORButton,
          ANDButton,
          clearAllButton,
          teamProjectsTable,
        },
      },
      stubbedResponses: { projectList },
    } = projects;

    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');

    cy.intercept(api.myProjects).as('myProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@teamProjectsList');
    cy.wait('@myProjectsList');

    cy.get(filterButton).first().click();

    filterWithoutRemove('Project Number', 'Greater than', '1');
    checkRow(teamProjectsTable, '2');

    cy.get(ANDButton).click();

    filterWithoutRemove('Project Name', 'Contains', 'Test Company 1');
    checkRow(teamProjectsTable, '2', 'Test Company 1 - Project 2');

    cy.get(ORButton).click();

    filterWithoutRemove('Category', "Doesn't contain", 'Medium');
    checkRow(teamProjectsTable, '2', 'Test Company 1 - Project 2');

    cy.get(clearAllButton).contains('Clear All').click();
  });
});
