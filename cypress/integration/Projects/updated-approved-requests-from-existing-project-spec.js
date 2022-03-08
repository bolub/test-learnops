describe('Update approved requests from existing project', () => {
  let constants, projects, requestList, projectPage;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('requestList').then((content) => (requestList = content));
    cy.fixture('projectPage').then((content) => (projectPage = content));
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

  it('Links a second approved request to an existing project', () => {
    const { api, routes } = constants;

    const {
      stubbedResponses: { projectWithLinkedRequests },
      selectors: { updateProjectButton, projectSuccessModal },
    } = projects;

    const {
      selectors: {
        formBody,
        linkRequestTrigger,
        linkRequestSearchInput,
        linkRequestSaveButton,
        availableRequestsToLinkList,
        linkedRequestsTable,
      },
    } = projectPage;

    const { stubbedResponses } = requestList;
    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(
      `${api.fetchProjects}/${projectWithLinkedRequests.data.id}`,
      { times: 1 },
      projectWithLinkedRequests
    ).as('fetchProject');
    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(
      'PUT',
      `${api.createProject}/${projectWithLinkedRequests.data.id}`,
      { statusCode: 200 }
    );
    cy.intercept(
      'POST',
      api.setlinkRequests.replace('$', projectWithLinkedRequests.data.id),
      {
        statusCode: 200,
        body: {},
      }
    ).as('setlinkRequests');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`/project/${projectWithLinkedRequests.data.id}`);
    cy.wait('@fetchProject');
    cy.get(formBody).scrollTo('bottom');

    cy.get(linkedRequestsTable).should('be.visible');
    cy.get(linkedRequestsTable).contains(
      'td',
      'Linked project request QA test'
    );

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
    cy.get(linkedRequestsTable).contains('td', 'Approved-Request-QA-Test');

    cy.get(updateProjectButton).click();
    cy.get(projectSuccessModal).should('be.visible');
  });

  it('Unlink approved request from existing project', () => {
    const { api, routes } = constants;

    const {
      stubbedResponses: { projectWithLinkedRequests },
      selectors: { updateProjectButton, projectSuccessModal },
    } = projects;

    const {
      selectors: { unlinkRequestButton, formBody, linkedRequestsTable },
      constantTexts,
    } = projectPage;

    const { stubbedResponses } = requestList;

    cy.intercept(api.fetchProjects).as('fetchAllProjects');
    cy.intercept(
      `${api.fetchProjects}/${projectWithLinkedRequests.data.id}`,
      { times: 1 },
      projectWithLinkedRequests
    ).as('fetchProject');
    cy.intercept(api.allRequests, stubbedResponses.requestListResponse).as(
      'allRequests'
    );
    cy.intercept(
      'PUT',
      `${api.createProject}/${projectWithLinkedRequests.data.id}`,
      { statusCode: 200 }
    );
    cy.intercept(
      'POST',
      api.setlinkRequests.replace('$', projectWithLinkedRequests.data.id),
      {
        statusCode: 200,
        body: {},
      }
    ).as('setlinkRequests');
    cy.visit(routes.projectsList);
    cy.wait('@fetchAllProjects');
    cy.visit(`/project/${projectWithLinkedRequests.data.id}`);
    cy.wait('@fetchProject');
    cy.get(formBody).scrollTo('bottom');

    cy.get(linkedRequestsTable).should('be.visible');
    cy.get(linkedRequestsTable).contains(
      'td',
      'Linked project request QA test'
    );

    cy.get(unlinkRequestButton).should('be.visible').click();
    cy.get(linkedRequestsTable).contains(
      'td',
      constantTexts.emptyLinkedRequestsTableMessage
    );

    cy.get(updateProjectButton).click();
    cy.get(projectSuccessModal).should('be.visible');
  });
});
