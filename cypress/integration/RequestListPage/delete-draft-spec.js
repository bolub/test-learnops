import get from 'lodash/get';

let route, selector, request;

describe('Delete a request draft', () => {
  before('Load Fixtures', () => {
    cy.fixture('constants').then((content) => (route = content));
    cy.fixture('requestList').then((content) => (selector = content));
    cy.fixture('request').then((content) => (request = content));
  });

  beforeEach(() => {
    const { routes } = route;

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
    cy.visit(`${routes.requestList}`);
  });

  it('checks if delete draft modal shows up after the delete button is pressed', () => {
    const { api } = route;
    const {
      selectors: { deleteDraft },
    } = selector;
    const { requestListResponse } = selector.stubbedResponses;

    cy.intercept(api.allRequests, requestListResponse).as('allRequests');
    cy.wait('@allRequests').then((payload) => {
      const responseData = get(payload, 'response.body.data');
      expect(responseData).not.to.be.empty;
      cy.get(
        request.selectors.deleteRequestButton.replace('$', responseData[0].id)
      )
        .first()
        .click({ force: true });
      cy.contains(`${deleteDraft.deleteAction}`).should('be.visible');
    });
  });

  it('checks if delete draft modal leaves after the cancel button is pressed', () => {
    const { api } = route;
    const {
      selectors: { deleteDraft },
    } = selector;
    const { requestListResponse } = selector.stubbedResponses;

    cy.intercept(api.allRequests, requestListResponse).as('allRequests');

    cy.wait('@allRequests').then((payload) => {
      const responseData = get(payload, 'response.body.data');
      cy.get('[data-testid=tab-1]').should('be.visible').click();
      cy.get(
        request.selectors.deleteRequestButton.replace('$', responseData[0].id)
      )
        .first()
        .click({ force: true });
      cy.get(`${deleteDraft.cancel}`).click();
    });
  });

  it('checks if deletion success modal shows up after the draft is deleted and if deleted draft is removed from table', () => {
    const { api } = route;
    const {
      selectors: { deleteDraft },
    } = selector;
    const { requestListResponse } = selector.stubbedResponses;

    cy.intercept(api.allRequests, requestListResponse).as('allRequests');
    cy.wait('@allRequests').then((payload) => {
      const responseData = get(payload, 'response.body.data');

      cy.get(
        request.selectors.deleteRequestButton.replace('$', responseData[0].id)
      )
        .first()
        .click({ force: true });

      cy.contains(`${deleteDraft.deleteAction}`).should('be.visible').click();
      cy.get(`${deleteDraft.successFeedback}`).should('be.visible');
      cy.reload();
      cy.contains(`${deleteDraft.draftTitle}`).should('not.exist');
    });
  });
});
