describe('Export Request Button on Project List Page', () => {
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

  it('Checks if export button exists', () => {
    const { routes } = constants;
    const {
      selectors: { projectsListTable },
    } = projects;

    cy.visit(routes.projectsList);

    cy.get(projectsListTable.exportProjectButton)
      .should('be.visible')
      .first()
      .should('have.text', 'Export');
  });
});
