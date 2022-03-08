import get from 'lodash/get';

describe('Edit Request', () => {
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

  it('Edit request and save it', () => {
    const { api } = constants;
    const { selectors: singleRequestSelectors } = singleRequestFixtures;

    cy.createRequestAndGoToRequestList('Editing a Request Test').then(
      (payload) => {
        const { routes } = constants;
        const { myRequestsTab } = requestList.selectors.requestTable;

        const requestId = payload.id;

        cy.url().should('include', routes.requestList);

        cy.get(myRequestsTab).click();
        cy.wait('@myRequests');
        cy.get(`[data-cy=request__title-${requestId}]`)
          .first()
          .click({ force: true });

        cy.url().should('include', `/request/${requestId}`);
        cy.get(requestList.selectors.details.requestTitleField).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestTitleField).clear();
        cy.get(requestList.selectors.details.requestTitleField).type(
          'Lorem epsum'
        );
        cy.get(requestList.selectors.details.secondTab).click();
        cy.get(requestList.selectors.details.requestDescriptionField)
          .should('be.visible')
          .clear()
          .type('Lorem epsum description');

        cy.intercept('PUT', api.updateRequest.replace('$', requestId)).as(
          'updateRequest'
        );
        cy.get(singleRequestSelectors.saveExitButton).click();

        cy.wait('@updateRequest').its('response.statusCode').should('eq', 200);
        cy.url().should('include', routes.requestList);

        cy.get(myRequestsTab).click();
        cy.wait('@myRequests').then((payload) => {
          const responseData = get(payload, 'response.body.data');
          expect(responseData).not.to.be.empty;

          cy.visit(`/request/${requestId}`);
          cy.url().should('include', `/request/${requestId}`);
          cy.get(requestList.selectors.details.requestTitleField).should(
            'be.visible'
          );
          cy.get(requestList.selectors.details.requestTitleField).should(
            'have.value',
            'Lorem epsum'
          );
          cy.get(requestList.selectors.details.secondTab).click();
          cy.get(requestList.selectors.details.requestDescriptionField).should(
            'be.visible'
          );

          cy.visit(routes.requestList);
          cy.url().should('include', routes.requestList);
          cy.get(myRequestsTab).click();
          cy.wait('@myRequests');
          cy.deleteRequestFromTable(requestId);
        });
      }
    );
  });

  it('Edit a submitted request and save the new details', () => {
    const { routes, api } = constants;
    const {
      filterRequestList: { submittedRequestId },
    } = requestList;
    const {
      selectors: singleRequestSelectors,
      stubbedResponses: { submittedRequestResponse },
    } = singleRequestFixtures;
    const requestTitle = Date.now();

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', submittedRequestResponse.data.id),
      submittedRequestResponse
    ).as('fetchRequestDetail');

    cy.visit(
      routes.requestDetails.replace('**', submittedRequestResponse.data.id)
    );

    cy.url().should('include', `/request/${submittedRequestResponse.data.id}`);

    cy.get(requestList.selectors.details.requestTitleField).should(
      'be.visible'
    );
    cy.get(requestList.selectors.details.requestTitleField).clear();
    cy.get(requestList.selectors.details.requestTitleField).type(requestTitle);

    cy.get(requestList.selectors.details.secondTab).click();
    cy.get(requestList.selectors.details.requestDescriptionField)
      .should('be.visible')
      .clear()
      .type(requestTitle);

    // cy.get('[data-testid=tab-3]').should('be.visible').click();

    // cy.get(singleRequestSelectors.ldOnlyPriorityDropdown).click();
    // cy.selectDropdownItem('High', 'high');
    // cy.get(requestList.selectors.details.thirdTab).click();
    // cy.get(requestList.selectors.details.additionalDetailsField)
    //   .should('be.visible')
    //   .clear()
    //   .type(requestTitle);
    cy.get(singleRequestSelectors.updateRequestButton).click();
  });
});
