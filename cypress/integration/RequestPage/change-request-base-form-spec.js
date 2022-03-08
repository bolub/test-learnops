describe('Change request base form', () => {
  let constants, request;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('request').then((content) => (request = content));
    cy.initAmplifyConfiguration();
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
  });

  it('Shows warning modal when the base form of a request changes', () => {
    const { routes, api } = constants;
    const {
      requestResponse,
      questionResponse,
      formOptions,
      requestId,
      otherFormData,
    } = request.stubbedResponses;

    cy.visit(routes.requestDetails.replace('**', requestId));
    cy.intercept('GET', api.fetchForms, formOptions).as('fetchFormOptions');
    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      requestResponse
    ).as('fetchRequestDetail');
    cy.intercept(
      'GET',
      api.fetchRequestQuestions.replace('**', requestId),
      questionResponse
    ).as('fetchQuestions');
    cy.get(request.selectors.formTypeDropdown)
      .click()
      .get(`[data-value='${JSON.stringify(otherFormData)}']`)
      .click();
    cy.get(request.selectors.changeFormModal).should('be.visible');
  });

  it('Request is deleted and re-created when the base form changes', () => {
    const { routes, api } = constants;
    const {
      requestResponse,
      questionResponse,
      formOptions,
      newRequest,
      requestId,
      newRequestId,
      otherFormId,
      otherFormData,
    } = request.stubbedResponses;

    cy.visit(routes.requestDetails.replace('**', requestId));

    cy.intercept('GET', api.fetchForms, formOptions).as('fetchFormOptions');
    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      requestResponse
    ).as('fetchRequestDetail');
    cy.intercept(
      'GET',
      api.fetchRequestQuestions.replace('**', requestId),
      questionResponse
    ).as('fetchQuestions');

    cy.get(request.selectors.formTypeDropdown)
      .click()
      .get(`[data-value='${JSON.stringify(otherFormData)}']`)
      .click();
    cy.get(request.selectors.changeFormModal)
      .should('be.visible')
      .get(request.selectors.changeFormButton)
      .click();

    cy.intercept(
      'DELETE',
      api.fetchRequestDetail.replace('**', requestId),
      requestResponse
    ).as('removeRequest');

    cy.intercept(
      'POST',
      api.createRequest.replace('**', otherFormId),
      newRequest
    ).as('createRequest');

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', newRequestId),
      newRequest
    ).as('fetchNewRequestDetail');
  });
});
