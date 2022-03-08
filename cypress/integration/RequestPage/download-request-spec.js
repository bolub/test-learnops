describe('Download Request Button on Request Detail', () => {
  let constants, request;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('request').then((content) => (request = content));
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

  it('Checks if download button exists in a request', () => {
    const { routes, api } = constants;
    const { selectors } = request;
    const { requestResponse, requestId } = request.stubbedResponses;

    cy.visit(routes.requestDetails.replace('**', requestId));
    cy.url().should('include', `/request/${requestId}`);
    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      requestResponse
    ).as('fetchRequestDetail');
    cy.wait('@fetchRequestDetail');
    cy.get(selectors.moreActionsButton).should('be.visible').click();
    cy.get(selectors.downloadPdfButton)
      .should('be.visible')
      .should('have.text', 'Download Request');
  });
});
