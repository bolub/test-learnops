describe('Filter projects list board', () => {
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

  const applyFilter = (column, operator, inputValue, countOfCards) => {
    const {
      selectors: {
        projectsListTable: {
          columnTitleDropdown,
          operatorDropdown,
          filterValueInput,
          applyButton,
          tagCloseButton,
        },
        boardView,
      },
    } = projects;

    cy.get(columnTitleDropdown).first().click();
    cy.contains(column).should('be.visible').click();

    cy.get(operatorDropdown).first().click();
    cy.contains(operator).should('be.visible').click();

    cy.get(filterValueInput).first().type(inputValue);
    cy.get(applyButton).first().click();

    cy.get(boardView.teamBoard).within(() => {
      cy.get(boardView.stageCard).should('have.length', countOfCards);
    });

    cy.get(tagCloseButton).click();
  };

  it('Filters board projects', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { projectBoard, projectProcesses },
      selectors: { boardViewSwitchButton, boardView },
    } = projects;
    cy.intercept(api.fetchProjects, projectBoard).as('teamProjectsList');
    cy.intercept(api.fetchAllProjectProcesses, projectProcesses).as(
      'fetchOrganizationProcesses'
    );
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.get(boardViewSwitchButton).should('be.visible').click();
    cy.get(boardView.teamBoard).should('be.visible');
    cy.get(boardView.filterButton).first().click();
    cy.get(boardView.filterFields).should('be.visible');
    applyFilter('Project Name', 'Contains', 'Nunc', 2);
    applyFilter('Status', 'Contains', 'New', 2);
    applyFilter('Priority', 'Contains', 'High', 3);
    applyFilter('Health', 'Contains', 'At Risk', 4);
    applyFilter('Project Owner', 'Contains', 'Drine', 5);
  });

  it('Searches project by title', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { projectBoard, projectProcesses },
      selectors: { boardViewSwitchButton, boardView },
    } = projects;
    cy.intercept(api.fetchProjects, projectBoard).as('teamProjectsList');
    cy.intercept(api.fetchAllProjectProcesses, projectProcesses).as(
      'fetchOrganizationProcesses'
    );
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.get(boardViewSwitchButton).should('be.visible').click();
    cy.get(boardView.teamBoard).should('be.visible');
    cy.get(boardView.searchInput).first().type('Aliquam dictum sapien et');
    cy.get(boardView.teamBoard).within(() => {
      cy.get(boardView.stageCard).should('have.length', 1);
    });
  });
});
