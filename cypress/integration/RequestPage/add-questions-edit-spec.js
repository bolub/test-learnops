import get from 'lodash/get';

describe('View Comment on a Request', () => {
  let constants, request, requestList;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('requestList').then((content) => (requestList = content));
    cy.fixture('request').then((content) => (request = content));
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

  it('is able to click on overflowMenu option verifying edit action works', () => {
    const {
      routes,
      api,
      selectors: { createRequestQuestions },
    } = constants;
    const { selectors } = requestList;
    const {
      stubbedResponses: {
        submitStatusRequestResponse,
        submitStatusRequestId,
        additonalQuestionsResponse,
      },
    } = request;

    cy.visit(routes.requestDetails.replace('**', submitStatusRequestId));
    cy.url().should('include', `/request/${submitStatusRequestId}`);

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', submitStatusRequestId),
      submitStatusRequestResponse
    ).as('fetchRequestDetail');
    cy.wait('@fetchRequestDetail').then((payload) => {
      const responseData = get(payload, 'response.body.data');
      expect(responseData).not.to.be.empty;

      cy.get(selectors.details.thirdTab).click();

      cy.get('[data-testid=open-flyout]').scrollIntoView().click();
      cy.intercept(
        'POST',
        createRequestQuestions.replace('**', submitStatusRequestId),
        {
          id: '3b451a8a-c599-43cf-8cc6-3855f465cc3e',
          questionnaireId: submitStatusRequestId,
          requestId: submitStatusRequestId,
          type: 'customTextArea',
          data: {
            label: 'Text',
            value: '',
            showMenu: true,
          },
          section: 'additionalDetails',
          updatedAt: '2021-12-06T07:33:21.053Z',
          createdAt: '2021-12-06T07:33:21.053Z',
          deletedAt: null,
        }
      ).as('createQuestions');
      cy.intercept(
        'GET',
        api.fetchRequestQuestions,
        additonalQuestionsResponse
      );

      cy.get('[data-testid=textArea-trigger]').click();

      cy.wait('@createQuestions').then((payload) => {
        const responseBody = get(payload, 'response.body');
        expect(responseBody).not.to.be.empty;
        expect(responseBody.type).eq('customTextArea');
        const questionId = 'cbe3f04b-26f6-4525-9533-08f5447263dc';
        cy.get(`[data-testid=${questionId}-menu-ellipsis]`).should(
          'be.visible'
        );
        cy.get(`[data-testid=${questionId}-menu-ellipsis]`).click();
        cy.intercept(
          'GET',
          api.fetchRequestQuestions.replace('**', submitStatusRequestId)
        ).as('fetchRequestQuestions');
        cy.get(`[data-testid=${questionId}-edit-option]`).click();
        cy.get('#editable-question').type('hello editable');
        cy.get(`[data-testid=${questionId}-save-option]`).click();
        cy.wait('@fetchRequestQuestions').then((payload) => {
          const responseBody = get(payload, 'response.body');
          expect(responseBody).not.to.be.empty;
          const result = responseBody.data.filter(
            (question) => question.id === questionId
          );
        });
      });
    });
  });
});
