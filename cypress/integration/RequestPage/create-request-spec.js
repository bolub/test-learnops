describe('Request Page', () => {
  let constants, requestList, singleRequestFixtures;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('requestList').then((content) => (requestList = content));
    cy.fixture('request').then((content) => (singleRequestFixtures = content));
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

  it('checks if request is submitted/created', () => {
    cy.createRequestAndGoToRequestList('Create Request Test', 'submit');
  });

  it('checks if a request is saved', () => {
    cy.createRequestAndGoToRequestList('Test Request').then(() => {
      cy.get('[data-cy=app-inline-notification]').should('be.visible');
    });
  });
});
