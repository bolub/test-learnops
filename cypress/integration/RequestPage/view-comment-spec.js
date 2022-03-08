import get from 'lodash/get';

describe('View Comment on a Request', () => {
  let constants, requestList, comments;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('requestList').then((content) => (requestList = content));
    cy.fixture('comments').then((content) => (comments = content));
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

  it('checks empty comments on a request in basic details section', () => {
    const { routes, api } = constants;
    const { selectors } = requestList;
    const {
      stubRequestDetail,
      nullStubRequestPropertyCommentsByProperty,
      requestId,
    } = comments.stubbedData;

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      stubRequestDetail
    ).as('fetchRequestDetail');

    cy.intercept(
      'GET',
      api.fetchRequestPropertyComments.replace('$', requestId),
      nullStubRequestPropertyCommentsByProperty
    ).as('fetchRequestPropertyComments');

    cy.visit(routes.requestDetails.replace('**', requestId));

    cy.wait('@fetchRequestDetail');

    cy.get('[data-testid=comments_topbar-button]').first().click();

    cy.wait('@fetchRequestPropertyComments');
    cy.get(selectors.details.requestNumberCommentBox)
      .should('be.visible')
      .contains('0')
      .should('have.class', 'text-neutral')
      .click()
      .should('have.class', 'text-neutral-white');
  });

  it('checks one comment on a request in basic details section', () => {
    const { routes, api } = constants;
    const { selectors } = requestList;
    const {
      stubRequestDetail,
      stubRequestPropertyCommentsByProperty,
      requestId,
    } = comments.stubbedData;

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      stubRequestDetail
    ).as('fetchRequestDetail');

    cy.intercept(
      'GET',
      api.fetchRequestPropertyComments.replace('$', requestId),
      stubRequestPropertyCommentsByProperty
    ).as('fetchRequestPropertyComments');

    cy.visit(routes.requestDetails.replace('**', requestId));

    cy.wait('@fetchRequestDetail');

    cy.get(selectors.details.firstTab).click();

    cy.wait('@fetchRequestPropertyComments').then((payload) => {
      const responseData = get(payload, 'response.body.data');
      expect(responseData.requestPropertyCommentsByProperty).not.to.be.empty;
      cy.get('[data-testid=comments_topbar-button]').first().click();
      cy.get(selectors.details.requestNumberCommentBox)
        .should('be.visible')
        .contains('1')
        .should('have.class', 'text-neutral')
        .click();
    });
  });

  it('checks multiple comments on a request in basic details section', () => {
    const { routes, api } = constants;
    const { selectors } = requestList;
    const {
      stubRequestList,
      stubRequestDetail,
      stubMultipleRequestPropertyCommentsByProperty,
      requestId,
    } = comments.stubbedData;

    cy.intercept(api.allRequests, stubRequestList).as('allRequests');

    cy.visit(routes.requestDetails.replace('**', requestId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      stubRequestDetail
    ).as('fetchRequestDetail');

    cy.intercept(
      'GET',
      api.fetchRequestPropertyComments.replace('$', requestId),
      stubMultipleRequestPropertyCommentsByProperty
    ).as('fetchRequestPropertyComments');

    cy.wait('@fetchRequestDetail');

    cy.get(selectors.details.firstTab).click();

    cy.wait('@fetchRequestPropertyComments').then((payload) => {
      const responseData = get(payload, 'response.body.data');
      expect(responseData.requestPropertyCommentsByProperty).not.to.be.empty;
      cy.get('[data-testid=comments_topbar-button]').first().click();
      cy.get(selectors.details.requestNumberCommentBox)
        .should('be.visible')
        .contains('9+')
        .should('have.class', 'text-neutral')
        .click();
    });
  });

  it('checks comments on a question in a request', () => {
    const { routes, api } = constants;
    const { selectors } = requestList;
    const {
      stubRequestDetail,
      stubQuestionsComments,
      requestId,
      stubRequestQuestions,
    } = comments.stubbedData;

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      stubRequestDetail
    ).as('fetchRequestDetail');

    cy.intercept(
      'GET',
      api.fetchComments.replace('$', requestId),
      stubQuestionsComments
    ).as('fetchComments');

    cy.intercept(
      'GET',
      api.fetchRequestQuestions.replace('**', requestId),
      stubRequestQuestions
    ).as('fetchRequestQuestions');

    cy.visit(routes.requestDetails.replace('**', requestId));

    cy.wait('@fetchRequestDetail');

    cy.wait('@fetchRequestQuestions');

    cy.get(selectors.details.firstTab).click();

    cy.wait('@fetchComments').then((payload) => {
      const responseData = get(payload, 'response.body.intakeQuestions');
      expect(responseData[0]).not.to.be.empty;

      cy.get(selectors.details.thirdTab).click();

      cy.get('[data-testid=comments_topbar-button]').first().click();

      cy.get(
        selectors.details.questionsCommentBox.replace('$', responseData[0].id)
      )
        .scrollIntoView()
        .should('be.visible')
        .contains('2')
        .click();
    });
  });

  it('checks multiple comments on a question in a request', () => {
    const { routes, api } = constants;
    const { selectors } = requestList;
    const {
      stubRequestDetail,
      stubQuestionsComments,
      requestId,
      stubRequestQuestions,
    } = comments.stubbedData;

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      stubRequestDetail
    ).as('fetchRequestDetail');

    cy.intercept(
      'GET',
      api.fetchRequestQuestions.replace('**', requestId),
      stubRequestQuestions
    ).as('fetchRequestQuestions');

    cy.intercept(
      'GET',
      api.fetchComments.replace('$', requestId),
      stubQuestionsComments
    ).as('fetchComments');

    cy.visit(routes.requestDetails.replace('**', requestId));

    cy.wait('@fetchRequestDetail');

    cy.wait('@fetchComments').then((payload) => {
      const responseData = get(payload, 'response.body.intakeQuestions');
      expect(responseData[1]).not.to.be.empty;
      cy.get('[data-testid=comments_topbar-button]').first().click();
      cy.get(
        selectors.details.questionsCommentBox.replace('$', responseData[1].id)
      )
        .should('be.visible')
        .contains('9+')
        .click();

      cy.get(
        selectors.details.hiddenCommentsButton.replace('$', responseData[1].id)
      ).click();
    });
  });

  it('checks null comments on a question in a request', () => {
    const { routes, api } = constants;
    const { selectors } = requestList;
    const {
      stubRequestDetail,
      nullStubQuestionsComments,
      questionId1,
      questionId2,
      requestId,
      stubRequestQuestions,
    } = comments.stubbedData;

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      stubRequestDetail
    ).as('fetchRequestDetail');

    cy.intercept(
      'GET',
      api.fetchRequestQuestions.replace('**', requestId),
      stubRequestQuestions
    ).as('fetchRequestQuestions');

    cy.intercept(
      'GET',
      api.fetchComments.replace('$', requestId),
      nullStubQuestionsComments
    ).as('fetchNullComments');

    cy.visit(routes.requestDetails.replace('**', requestId));

    cy.wait('@fetchRequestDetail');

    cy.wait('@fetchNullComments').then((payload) => {
      const responseData = get(payload, 'response.body.intakeQuestions');
      expect(responseData).to.be.empty;
      cy.get('[data-testid=comments_topbar-button]').first().click();
      cy.get(selectors.details.questionsCommentBox.replace('$', questionId2))
        .should('be.visible')
        .contains('0')
        .should('have.class', 'text-neutral')
        .click()
        .should('have.class', 'text-neutral-white');

      cy.get(selectors.details.thirdTab).click();
      cy.get(selectors.details.questionsCommentBox.replace('$', questionId1))
        .scrollIntoView()
        .should('be.visible')
        .contains('0')
        .should('have.class', 'text-neutral')
        .click()
        .should('have.class', 'text-neutral-white');
    });
  });
});
