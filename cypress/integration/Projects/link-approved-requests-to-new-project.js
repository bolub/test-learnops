describe('Link approved requests to new project', () => {
  let constants, projects, newProject, requestList;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('projectPage').then((content) => (newProject = content));
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
    cy.signInLD();
  });

  it('Links approved request', () => {
    const { routes, api } = constants;
    const {
      selectors: { addProjectButton },
    } = projects;
    const {
      selectors: {
        formBody,
        linkRequestTrigger,
        linkRequestSearchInput,
        linkRequestSaveButton,
        availableRequestsToLinkList,
        linkedRequestsTable,
        unlinkRequestButton,
      },
      constantTexts,
    } = newProject;
    const { stubbedResponses } = requestList;
    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.visit(routes.projectsList);
    cy.get(addProjectButton).should('be.visible').click();
    cy.get(formBody).scrollTo('bottom');
    cy.get(linkedRequestsTable)
      .should('be.visible')
      .contains('td', constantTexts.emptyLinkedRequestsTableMessage);
    cy.get(linkRequestTrigger).click();
    cy.get(linkRequestSaveButton).should('have.attr', 'disabled');
    cy.get(linkRequestSearchInput).should('be.visible').click();
    cy.get(linkRequestSearchInput)
      .should('be.visible')
      .type('Approved-Request-QA-Test');
    cy.get(availableRequestsToLinkList)
      .children()
      .should('have.length', 1)
      .first()
      .click();
    cy.get(linkRequestSaveButton)
      .should('not.have.attr', 'disabled', false)
      .click();
    cy.get(linkedRequestsTable).contains('td', '#0982774635');
    cy.get(linkedRequestsTable).contains('td', 'Sara Drine');
    cy.get(linkedRequestsTable).contains('td', 'Abir Halwa');
    cy.get(linkedRequestsTable).contains('td', 'Approved-Request-QA-Test');
    cy.get(linkedRequestsTable).contains('td', 'Approved');
    cy.get(unlinkRequestButton).should('be.visible').click();
    cy.get(linkedRequestsTable).contains(
      'td',
      constantTexts.emptyLinkedRequestsTableMessage
    );
  });
});
