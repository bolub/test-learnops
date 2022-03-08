import get from 'lodash/get';

describe('Add questions spec', () => {
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

  it('is able to create URL, upload and textArea type question', () => {
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
          id: '08085c6a-dc7e-4327-bd78-025a1843784f',
          questionnaireId: submitStatusRequestId,
          requestId: submitStatusRequestId,
          type: 'url',
          data: {
            label: 'URL',
            value: '',
            showMenu: true,
          },
          section: 'additionalDetails',
          updatedAt: '2021-12-06T07:35:30.520Z',
          createdAt: '2021-12-06T07:35:30.520Z',
          deletedAt: null,
        }
      ).as('createUrl');
      cy.intercept(
        'GET',
        api.fetchRequestQuestions,
        additonalQuestionsResponse
      );
      cy.get('[data-testid=url-trigger]').click();
      cy.wait('@createUrl').then((payload) => {
        const responseBody = get(payload, 'response.body');
        expect(responseBody).not.to.be.empty;
        expect(responseBody.type).eq('url');
      });

      cy.intercept(
        'POST',
        createRequestQuestions.replace('**', submitStatusRequestId),
        {
          id: '67d89ac5-2b2b-4dfd-92ce-a502d371935f',
          questionnaireId: submitStatusRequestId,
          requestId: submitStatusRequestId,
          type: 'file',
          data: {
            label: 'File',
            value: '',
            showMenu: true,
          },
          section: 'additionalDetails',
          updatedAt: '2021-12-06T07:44:36.882Z',
          createdAt: '2021-12-06T07:44:36.882Z',
          deletedAt: null,
        }
      ).as('createUpload');
      cy.intercept(
        'GET',
        api.fetchRequestQuestions,
        additonalQuestionsResponse
      );
      cy.get('[data-testid=upload-trigger]').click();
      cy.wait('@createUpload').then((payload) => {
        const responseBody = get(payload, 'response.body');
        expect(responseBody).not.to.be.empty;
        expect(responseBody.type).eq('file');
      });

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
      ).as('createTextarea');
      cy.intercept(
        'GET',
        api.fetchRequestQuestions,
        additonalQuestionsResponse
      );

      cy.get('[data-testid=textArea-trigger]').click();
      cy.wait('@createTextarea').then((payload) => {
        const responseBody = get(payload, 'response.body');
        expect(responseBody).not.to.be.empty;
        expect(responseBody.type).eq('customTextArea');
      });
    });
  });
});
