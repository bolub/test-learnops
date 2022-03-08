describe('Approve a request', () => {
  let constants, request;

  before('Load Fixtures', () => {
    cy.fixture('request').then((content) => (request = content));
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
    cy.signIn();
    cy.interceptApiRequests();
  });

  it('approves a request and validates notification banner', () => {
    const { routes, api } = constants;
    const {
      selectors,
      stubbedResponses: {
        submittedRequestWithOwner,
        submittedRequestWithOwnerId,
      },
    } = request;

    cy.visit(routes.requestDetails.replace('**', submittedRequestWithOwnerId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', submittedRequestWithOwnerId),
      submittedRequestWithOwner
    ).as('fetchRequestDetail');

    cy.get(selectors.approveRequestButton)
      .should('have.text', 'Approve')
      .click();
    cy.get('.bg-success-lighter').should('be.visible');
  });
});
