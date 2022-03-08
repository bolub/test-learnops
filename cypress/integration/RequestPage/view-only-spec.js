describe('View-only', () => {
  let constants, request, requestList;

  before('Load Fixtures', () => {
    cy.fixture('request').then((content) => (request = content));
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
  });

  it('check if request fields are editable if user is requester', () => {
    const { routes, api } = constants;

    const {
      stubbedResponses: {
        submittedRequestResponse,
        submittedRequestResponseId,
      },
      selectors: { nextButton },
    } = request;

    const {
      selectors: {
        details: {
          requestNumberField,
          businessUnitField,
          requestTitleField,
          requestDescriptionField,
        },
      },
    } = requestList;

    cy.signIn();
    cy.interceptApiRequests();
    cy.visit(routes.requestDetails.replace('**', submittedRequestResponseId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', submittedRequestResponseId),
      submittedRequestResponse
    ).as('fetchRequestDetail');

    cy.get(requestNumberField).should('have.attr', 'disabled');
    cy.get(requestTitleField).should('not.have.attr', 'disabled');
    cy.get(businessUnitField).should('not.have.attr', 'aria-disabled', 'true');

    cy.get(nextButton).click();
    cy.get(requestDescriptionField).should('not.have.attr', 'disabled');
  });

  it('check if request fields are read-only if user is not the requester or request owner', () => {
    const { routes, api } = constants;

    const {
      stubbedResponses: {
        submittedRequestWithOwner,
        submittedRequestWithOwnerId,
      },
      selectors: { nextButton },
    } = request;

    const {
      selectors: {
        details: {
          requestNumberField,
          businessUnitField,
          requestTitleField,
          requestDescriptionField,
        },
      },
    } = requestList;

    cy.signIn();
    cy.interceptApiRequests();
    cy.visit(routes.requestDetails.replace('**', submittedRequestWithOwnerId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', submittedRequestWithOwnerId),
      submittedRequestWithOwner
    ).as('fetchRequestDetail');

    cy.get(requestNumberField).should('have.attr', 'disabled');
    cy.get(requestTitleField).should('have.attr', 'disabled');
    cy.get(businessUnitField).should('have.attr', 'aria-disabled', 'true');

    cy.get(nextButton).click();
    cy.get(requestDescriptionField).should('have.attr', 'disabled');
  });

  it('check if LD only tab is not visible if user is business user', () => {
    const { routes, api } = constants;

    const {
      stubbedResponses: {
        submittedRequestWithOwner,
        submittedRequestWithOwnerId,
      },
      selectors: { lDOnlyTab },
    } = request;

    cy.signIn();
    cy.interceptApiRequests();
    cy.visit(routes.requestDetails.replace('**', submittedRequestWithOwnerId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', submittedRequestWithOwnerId),
      submittedRequestWithOwner
    ).as('fetchRequestDetail');

    cy.get(lDOnlyTab).should('not.exist');
  });

  it('check if LD only tab is visible if user is business user and fields are not disabled', () => {
    const { routes, api } = constants;

    const {
      stubbedResponses: {
        submittedRequestWithOwner,
        submittedRequestWithOwnerId,
      },

      selectors: {
        ldRequestTabButton,
        ldOnlyPriorityDropdown,
        ldOnlyEstimatedCost,
        ldOnlyEstimatedEffort,
        ldOnlyComments,
      },
    } = request;

    cy.signInLD();
    cy.interceptApiRequests();
    cy.visit(routes.requestDetails.replace('**', submittedRequestWithOwnerId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', submittedRequestWithOwnerId),
      submittedRequestWithOwner
    ).as('fetchRequestDetail');

    cy.get(ldRequestTabButton).should('be.visible').click();
    cy.get(ldOnlyPriorityDropdown)
      .should('be.visible')
      .and('not.have.attr', 'aria-disabled', 'true');
    cy.get(ldOnlyEstimatedCost)
      .should('be.visible')
      .and('not.have.attr', 'disabled');
    cy.get(ldOnlyEstimatedEffort)
      .should('be.visible')
      .and('not.have.attr', 'disabled');

    cy.get(ldOnlyComments)
      .should('be.visible')
      .and('not.have.attr', 'disabled');
  });
});
