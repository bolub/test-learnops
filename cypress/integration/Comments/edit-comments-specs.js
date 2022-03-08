let comments, constants, requestList, singleRequestFixtures;
describe('Edit comments on request', () => {
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
    cy.signIn();
    cy.interceptApiRequests();
  });

  it('checks if comment button is visible and icon is clickable', () => {
    const {
      selectors,
      routes: { commentsRoute },
    } = comments;
    const { api } = constants;
    cy.createRequestAndGoToRequestList('Create Request Test', 'submit').then(
      (payload) => {
        const { routes } = constants;
        const { singleRequestTitle, myRequestsTab } =
          requestList.selectors.requestTable;

        const requestId = payload.id;

        cy.url().should('include', routes.requestList);

        cy.get(myRequestsTab).click();
        cy.wait('@allRequests');

        cy.get(singleRequestTitle.replace('$', requestId)).should('be.visible');

        cy.intercept('GET', api.fetchForms).as('fetchFormOptions');
        cy.intercept(
          'DELETE',
          api.fetchRequestDetail.replace('**', requestId)
        ).as('removeRequest');
        cy.visit(`${commentsRoute + requestId}`);

        cy.contains(selectors.comments).should('be.visible').click();
        cy.get(selectors.commentsButton).should('be.visible').eq(0).click();
      }
    );
  });

  it('checks if menu button and edit button is visible', () => {
    const {
      selectors,
      routes: { commentsRoute },
    } = comments;
    const { api } = constants;
    cy.createRequestAndGoToRequestList('Create Request Test', 'submit').then(
      (payload) => {
        const { routes } = constants;
        const { singleRequestTitle, myRequestsTab } =
          requestList.selectors.requestTable;

        const requestId = payload.id;

        cy.url().should('include', routes.requestList);

        cy.get(myRequestsTab).click();
        cy.wait('@allRequests');

        cy.get(singleRequestTitle.replace('$', requestId)).should('be.visible');

        cy.intercept('GET', api.fetchForms).as('fetchFormOptions');
        cy.intercept(
          'DELETE',
          api.fetchRequestDetail.replace('**', requestId)
        ).as('removeRequest');
        cy.visit(`${commentsRoute + requestId}`);

        cy.contains(selectors.comments).should('be.visible').click();
        cy.get(selectors.commentsButton).should('be.visible').eq(0).click();
        cy.get(selectors.textArea).eq(0).type(selectors.commentUpdateText);
        cy.get(selectors.postComment)
          .should('be.visible')
          .click({ force: true });
        cy.get('[data-cy=overflow-button]')
          .should('be.visible')
          .click({ force: true });
        cy.get(selectors.editButton).should('be.visible').first().click();
      }
    );
  });

  it('checks if comment is edited and shows in comment list', () => {
    const {
      selectors,
      routes: { commentsRoute },
    } = comments;
    const { api } = constants;
    cy.createRequestAndGoToRequestList('Create Request Test', 'submit').then(
      (payload) => {
        const { routes } = constants;
        const { singleRequestTitle, myRequestsTab } =
          requestList.selectors.requestTable;

        const requestId = payload.id;

        cy.url().should('include', routes.requestList);

        cy.get(myRequestsTab).click();
        cy.wait('@allRequests');

        cy.get(singleRequestTitle.replace('$', requestId)).should('be.visible');

        cy.intercept('GET', api.fetchForms).as('fetchFormOptions');
        cy.intercept(
          'DELETE',
          api.fetchRequestDetail.replace('**', requestId)
        ).as('removeRequest');
        cy.visit(`${commentsRoute + requestId}`);

        cy.contains(selectors.comments).should('be.visible').click();
        cy.get(selectors.commentsButton).should('be.visible').eq(0).click();
        cy.get(selectors.textArea).eq(0).type(selectors.commentUpdateText);
        cy.get(selectors.postComment)
          .should('be.visible')
          .click({ force: true });
        cy.get('[data-cy=overflow-button]')
          .should('be.visible')
          .click({ force: true });
        cy.get(selectors.editButton).should('be.visible').first().click();
        cy.get(selectors.textArea).eq(0).clear();
        cy.get(selectors.textArea).eq(0).type(selectors.commentUpdateText);
        cy.get(selectors.updateButton).click({ force: true });
        cy.contains(selectors.commentUpdateText).should('be.visible');
      }
    );
  });
});
