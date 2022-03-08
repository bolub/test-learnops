import get from 'lodash/get';

describe('Request List Page', () => {
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

  it('Display the list of requests in the table format', () => {
    const { routes, api } = constants;
    const { selectors, stubbedResponses } = requestList;

    cy.visit(routes.requestList);

    cy.intercept(api.myRequests, stubbedResponses.requestListResponse).as(
      'myRequests'
    );

    cy.get(selectors.requestTable.myRequestsTab).click();

    cy.wait('@myRequests').then((payload) => {
      const responseData = get(payload, 'response.body.data');

      expect(responseData).not.to.be.empty;
      cy.get(requestList.selectors.requestPageTitle).should('be.visible');
      cy.get(requestList.selectors.addRequestButton).should('be.visible');
      cy.get(requestList.selectors.requestTabs).should('be.visible');
      cy.get(requestList.selectors.requestTable.reqNo).should('be.visible');
      cy.get(requestList.selectors.requestTable.requesterName).should(
        'be.visible'
      );
      cy.get(requestList.selectors.requestTable.reqTitle).should('be.visible');
      cy.get(requestList.selectors.requestTable.reqSubmissionDate).should(
        'be.visible'
      );
      cy.get(requestList.selectors.requestTable.reqUpdateDate).should(
        'be.visible'
      );
      cy.get(requestList.selectors.requestTable.reqStatus).should('be.visible');
      responseData.map((data, index) => {
        cy.get(`[data-testid=table-row-${index}]`).should('be.visible');
        return null;
      });
    });
  });

  it('Should not display the list of requests in the table format if no requests exists', () => {
    const { routes, api } = constants;
    const { selectors } = requestList;

    cy.visit(routes.requestList);

    cy.intercept(api.myRequests, { status: 200, data: [], success: true }).as(
      'myRequests'
    );

    cy.get(selectors.requestTable.myRequestsTab).click();

    cy.wait('@myRequests').then(({ request, response }) => {
      const responseData = get(response, 'body.data');

      expect(responseData).to.be.empty;
      cy.get(requestList.selectors.requestPageTitle).should('be.visible');
      cy.get(requestList.selectors.addRequestButton).should('be.visible');
      cy.get(requestList.selectors.requestTabs).should('be.visible');
    });
  });

  it.only('Should open request in edit mode', () => {
    const { routes } = constants;
    const { selectors } = requestList;

    cy.createRequestAndGoToRequestList('Request List', 'submit').then(
      (payload) => {
        const requestId = payload.id;

        cy.get(selectors.requestTable.myRequestsTab).click({ force: true });
        cy.wait('@myRequests');

        cy.get(`[data-cy=request__title-${requestId}]`)
          .first()
          .click({ force: true });

        cy.url().should('include', `/request/${requestId}`);
        cy.get(requestList.selectors.details.tabs).should('be.visible');

        cy.get(requestList.selectors.details.firstTab).click();
        cy.get(requestList.selectors.details.basicDetailsTab).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestNumberLabel).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestNumberField).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.businessUnitLabel).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestTitleLabel).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestTitleField).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.secondTab).click();
        cy.get(requestList.selectors.details.requestDescriptionLabel).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestDescriptionField).should(
          'be.visible'
        );

        cy.visit(routes.requestList);
        cy.wait('@allRequests');
        cy.get(`[data-cy=request__title-${requestId}]`)
          .first()
          .click({ force: true });

        cy.get(requestList.selectors.details.tabs).should('be.visible');

        cy.get(requestList.selectors.details.firstTab).click();
        cy.get(requestList.selectors.details.basicDetailsTab).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestNumberLabel).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestNumberField).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.businessUnitLabel).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestTitleLabel).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestTitleField).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.secondTab).click();
        cy.get(requestList.selectors.details.requestDescriptionLabel).should(
          'be.visible'
        );
        cy.get(requestList.selectors.details.requestDescriptionField).should(
          'be.visible'
        );
      }
    );
  });
});
