import get from 'lodash/get';

describe('Request List Page', () => {
  let constants, requestList;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('requestList').then((content) => (requestList = content));
  });

  beforeEach(() => {
    const { routes } = constants;

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
    cy.visit(routes.requestList);
  });

  it('Should not display any requests that do not match the search paramters', () => {
    const { api } = constants;
    const { emptyRequestListResponse } = requestList.stubbedResponses;
    const { requestSearchInput, noRequestFound, requestTableRow } =
      requestList.selectors.requestTable;

    cy.intercept(api.allRequests, emptyRequestListResponse).as('allRequests');

    cy.wait('@allRequests').then(({ request, response }) => {
      const responseData = get(response, 'body.data');

      expect(responseData).to.be.empty;

      cy.get(requestSearchInput).first().type('dummy request');

      cy.get(noRequestFound).should('be.visible');

      responseData.map((data, index) => {
        cy.get(requestTableRow.replace('*', index)).should('not.be.visible');
        return null;
      });
    });
  });

  it('Should show requests that match the search parameters', () => {
    const { routes, api } = constants;
    const { requestListResponse } = requestList.stubbedResponses;
    const { requestSearchInput, requestTable } =
      requestList.selectors.requestTable;

    cy.intercept(api.allRequests, requestListResponse).as('allRequests');
    cy.wait('@allRequests').then(({ request, response }) => {
      const responseData = get(response, 'body.data');

      expect(responseData).to.not.be.empty;

      cy.get(requestSearchInput).first().type('QA-Test');
    });
  });
});
