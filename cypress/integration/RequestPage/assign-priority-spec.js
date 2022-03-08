let comments, constants, requestList, singleRequestFixtures;
describe('Assign Priority To Requests By L and D user', () => {
  before('Load Fixtures', () => {
    cy.fixture('comments').then((content) => (comments = content));
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
    cy.signInLD();
    cy.interceptApiRequests();
  });

  const goToLDTab = () => {
    const {
      selectors: routeSelector,
      stubbedResponses: {
        submittedRequestWithOwner,
        submittedRequestWithOwnerId,
      },
    } = singleRequestFixtures;

    const { api, routes } = constants;

    cy.visit(routes.requestDetails.replace('**', submittedRequestWithOwnerId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', submittedRequestWithOwnerId),
      submittedRequestWithOwner
    ).as('fetchRequestDetail');

    cy.get(routeSelector.ldRequestTabButton).should('be.visible').click();
  };

  it('checks if requests can be created and L and D tab exists', () => {
    goToLDTab();
  });

  it('checks priority dropdown content', () => {
    const { selectors: routeSelector } = singleRequestFixtures;

    goToLDTab();

    cy.get(routeSelector.ldOnlyPriorityDropdown).should('be.visible').click();

    cy.checkDropdownItemVisibility('High', 'high');
    cy.checkDropdownItemVisibility('Medium', 'medium');
    cy.checkDropdownItemVisibility('Low', 'low');
    cy.checkDropdownItemVisibility('Not Assigned', 'unassigned');
  });
});
