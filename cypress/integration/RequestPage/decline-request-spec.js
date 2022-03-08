import get from 'lodash/get';

describe('Decline a request', () => {
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

  it('decline a request', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: {
        submittedRequestWithOwner,
        submittedRequestWithOwnerId,
      },
      selectors,
    } = request;

    cy.visit(routes.requestDetails.replace('**', submittedRequestWithOwnerId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', submittedRequestWithOwnerId),
      submittedRequestWithOwner
    ).as('fetchRequestDetail');

    cy.intercept(
      'PUT',
      api.updateRequest.replace('$', submittedRequestWithOwnerId)
    ).as('updateRequest');

    cy.get(selectors.declineRequestButton)
      .should('have.text', 'Decline')
      .click();

    cy.get(selectors.declineRequestModal.declineReasonDropdown)
      .should('be.visible')
      .click();

    cy.get('[role=listbox] li:last').click();
    cy.get(selectors.declineRequestModal.otherSpecificationInput)
      .should('be.visible')
      .clear()
      .type('Sample text');

    cy.get(selectors.declineRequestModal.requestDeclineButton)
      .should('be.visible')
      .click();

    cy.checkSuccessMessage();
  });
});
