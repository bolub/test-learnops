describe('Projects list board view', () => {
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

  it.only('Can switch to board view', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { projectList, projectProcesses },
      selectors: {
        boardViewSwitchButton,
        listViewSwitchButton,
        boardView,
        projectsListTable,
      },
    } = projects;
    // cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');
    // cy.intercept(api.fetchAllProjectProcesses, projectProcesses).as(
    //   'fetchOrganizationProcesses'
    // );
    cy.visit(routes.projectsList);
    // cy.wait('@teamProjectsList');
    // cy.get(boardViewSwitchButton).should('be.visible').click();
    // cy.get(boardView.teamBoard).should('be.visible');
    // const stages =
    //   projectProcesses.data[projectProcesses.data.length - 1].projectStages;
    // cy.wrap(stages).each((stage) => {
    //   cy.get(boardView.stage.replace('$', stage.id)).should('be.visible');
    // });
    // cy.get(boardView.myBoardTab).click();
    // cy.get(boardView.myBoard).should('be.visible');
    // cy.get(listViewSwitchButton).click();
    // cy.get(projectsListTable.teamProjectsTable).should('be.visible');
  });

  it('Displays an empty board and message when no projects available', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { projectSearchResponses, projectProcesses },
      selectors: { boardViewSwitchButton, boardView },
      constantTexts,
    } = projects;
    cy.intercept(api.fetchProjects, projectSearchResponses).as(
      'teamProjectsList'
    );
    cy.intercept(api.fetchAllProjectProcesses, projectProcesses).as(
      'fetchOrganizationProcesses'
    );
    cy.visit(routes.projectsList);
    // cy.wait('@teamProjectsList');
    cy.get(boardViewSwitchButton).should('be.visible').click();
    cy.get(boardView.emptyBoard)
      .should('be.visible')
      .contains(constantTexts.emptyBoardMessage);
    cy.get(boardView.getStartedButton).first().click();
    cy.url().should('include', '/new-project');
  });
});
