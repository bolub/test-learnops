import get from 'lodash/get';

describe('L & D user Request List View', () => {
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
    cy.signInLD();
    cy.interceptApiRequests();
  });

  it('Display the recieved requests for the L & D user', () => {
    const { routes, api } = constants;

    cy.intercept(api.getUserInfo.replace('*', Cypress.env('USER_EMAIL')));

    cy.visit(routes.requestList);
    cy.wait('@allRequests').then((payload) => {
      const responseData = get(payload, 'response.body.data');

      expect(responseData).not.to.be.empty;
      cy.get(requestList.selectors.requestPageTitle).should('be.visible');
      cy.get(requestList.selectors.addRequestButton).should('be.visible');
      cy.get(requestList.selectors.requestTabs).should('be.visible');
      cy.get(requestList.selectors.requestTable.reqNo).should('be.visible');
      cy.get(requestList.selectors.requestTable.owners).should('be.visible');
      cy.get(requestList.selectors.requestTable.requesterName).should(
        'be.visible'
      );
      cy.get(requestList.selectors.requestTable.reqTitle).should('be.visible');
      cy.get(requestList.selectors.requestTable.businessUnit).should(
        'be.visible'
      );
      cy.get(requestList.selectors.requestTable.reqSubmissionDate).should(
        'be.visible'
      );
      cy.get(requestList.selectors.requestTable.reqStatus).should('be.visible');
    });
  });
});
