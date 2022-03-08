describe('Export Request Button on Request List Page', () => {
  let constants, requestList;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('requestList').then((content) => (requestList = content));
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
    cy.signIn();
    cy.interceptApiRequests();
  });

  it('Checks if export button exists', () => {
    const { routes } = constants;
    const { selectors } = requestList;
    cy.visit(routes.requestList);
    cy.wait('@allRequests');
    cy.get(selectors.exportRequestButton)
      .should('be.visible')
      .first()
      .should('have.text', 'Export');
  });
});
