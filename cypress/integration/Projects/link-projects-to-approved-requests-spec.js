describe('e2e for link projects to approved requests', () => {
  let constants, request, project;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('request').then((content) => (request = content));
    cy.fixture('projects').then((content) => (project = content));
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

  const openLinkProjectModal = () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { approvedRequestResponse },
    } = request;
    const {
      selectors: { linkRequestToProjectButton, moreActionsButton },
      stubbedResponses: { projectSearchResponses },
    } = project;

    const requestId = 'b5848c2b-b865-4e71-b05a-f1a3a8925486';

    cy.visit(routes.requestDetails.replace('**', requestId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', requestId),
      approvedRequestResponse
    ).as('fetchRequestDetail');
    cy.url().should('include', `/request/${requestId}`);

    cy.wait('@fetchRequestDetail');

    cy.intercept('GET', api.fetchProjects, projectSearchResponses).as(
      'fetchProjects'
    );

    cy.get(moreActionsButton).should('be.visible').click();
    cy.get(linkRequestToProjectButton).click();

    cy.wait('@fetchProjects').its('response.statusCode').should('eq', 200);
  };

  const linkProjectToRequest = (dropdownData) => {
    const {
      selectors: { autoCompleteSearchInput },
    } = constants;
    const {
      selectors: {
        linkRequestToProjectModal: {
          searchProjectsToLinkButton,
          addToLinkedProjectTable,
        },
      },
    } = project;

    cy.get(searchProjectsToLinkButton).click();
    cy.get(autoCompleteSearchInput).type('QA');
    cy.get(`[data-value='${dropdownData}']`).click();

    cy.get(addToLinkedProjectTable).click();
  };

  const saveLinkedProjects = (type = 'single') => {
    const { api } = constants;
    const {
      stubbedResponses: {
        linkEmptyProjectToRequestResponse,
        linkMultipleProjectToRequestResponse,
        linkSingleProjectToRequestResponse,
      },
      selectors: {
        linkRequestToProjectModal: { saveLinkedProjectsToRequest },
      },
    } = project;

    switch (type) {
      case 'empty':
        cy.intercept(
          'POST',
          api.linkProjectsToRequest.replace(
            '$',
            'b5848c2b-b865-4e71-b05a-f1a3a8925486'
          ),
          linkEmptyProjectToRequestResponse
        ).as('linkProjects');
        break;

      case 'multiple':
        cy.intercept(
          'POST',
          api.linkProjectsToRequest.replace(
            '$',
            'b5848c2b-b865-4e71-b05a-f1a3a8925486'
          ),
          linkMultipleProjectToRequestResponse
        ).as('linkProjects');
        break;

      default:
        cy.intercept(
          'POST',
          api.linkProjectsToRequest.replace(
            '$',
            'b5848c2b-b865-4e71-b05a-f1a3a8925486'
          ),
          linkSingleProjectToRequestResponse
        ).as('linkProjects');
    }

    cy.get(saveLinkedProjectsToRequest).click();

    cy.wait('@linkProjects').its('response.statusCode').should('eq', 200);

    cy.checkSuccessMessage(
      'The Projects linked to this Request have been updated.'
    );
  };

  it('checks for link project modal content', () => {
    const {
      selectors: { autoCompleteSearchInput },
    } = constants;
    const {
      selectors: {
        linkRequestToProjectModal: {
          searchProjectsToLinkButton,
          addToLinkedProjectTable,
          cancelLinkToTable,
          singleProjectTitle,
          singleProjectStatus,
          singleProjectUnlinkFromTableButton,
          saveLinkedProjectsToRequest,
          cancelLinkProjectsToRequest,
          noLinkedProjects,
        },
      },
      stubbedResponses: { projectSearchResponses },
    } = project;

    openLinkProjectModal();

    const first = JSON.stringify(projectSearchResponses.data[0]);

    cy.get(noLinkedProjects)
      .should('be.visible')
      .and('have.text', 'No project linked');
    cy.get(searchProjectsToLinkButton).should('be.visible').click();

    cy.get(addToLinkedProjectTable).should('be.visible').and('be.disabled');

    cy.get(autoCompleteSearchInput).should('be.visible').type('QA');
    cy.get(`[data-value='${first}']`).should('be.visible').click();

    cy.get(cancelLinkToTable).should('be.visible');
    cy.get(addToLinkedProjectTable).click();

    cy.get(
      singleProjectTitle.replace('$', projectSearchResponses.data[0].id)
    ).should('be.visible');
    cy.get(
      singleProjectStatus.replace('$', projectSearchResponses.data[0].id)
    ).should('be.visible');
    cy.get(
      singleProjectUnlinkFromTableButton.replace(
        '$',
        projectSearchResponses.data[0].id
      )
    ).should('be.visible');

    cy.get(saveLinkedProjectsToRequest).should('be.visible');
    cy.get(cancelLinkProjectsToRequest).should('be.visible');
  });

  it('checks if not clicking on save cancels projects linking', () => {
    const {
      selectors: { autoCompleteSearchInput },
    } = constants;
    const {
      selectors: {
        linkRequestToProjectButton,
        moreActionsButton,
        linkRequestToProjectModal: {
          searchProjectsToLinkButton,
          addToLinkedProjectTable,
          cancelLinkProjectsToRequest,
          noLinkedProjects,
        },
      },
      stubbedResponses: { projectSearchResponses },
    } = project;

    openLinkProjectModal();

    const first = JSON.stringify(projectSearchResponses.data[0]);

    cy.get(searchProjectsToLinkButton).click();

    cy.get(autoCompleteSearchInput).type('QA');
    cy.get(`[data-value='${first}']`).click();

    cy.get(addToLinkedProjectTable).click();
    cy.get(cancelLinkProjectsToRequest).click();

    cy.get(moreActionsButton).should('be.visible').click();
    cy.get(linkRequestToProjectButton).click();
    cy.get(noLinkedProjects)
      .should('be.visible')
      .and('have.text', 'No project linked');
  });

  it('checks for single linked project', () => {
    const {
      stubbedResponses: { projectSearchResponses },
      selectors: {
        linkRequestToProjectButton,
        moreActionsButton,
        linkRequestToProjectModal: {
          singleProjectUnlinkFromTableButton,
          noLinkedProjects,
        },
      },
    } = project;

    openLinkProjectModal();

    const first = JSON.stringify(projectSearchResponses.data[0]);

    linkProjectToRequest(first);

    saveLinkedProjects('single');

    cy.get(moreActionsButton).should('be.visible').click();
    cy.get(linkRequestToProjectButton).click();

    cy.get(
      singleProjectUnlinkFromTableButton.replace(
        '$',
        projectSearchResponses.data[0].id
      )
    ).click();

    cy.get(noLinkedProjects)
      .should('be.visible')
      .and('have.text', 'No project linked');

    saveLinkedProjects('empty');
  });

  it('checks for multiple linked projects', () => {
    const {
      selectors: {
        linkRequestToProjectButton,
        moreActionsButton,
        linkRequestToProjectModal: {
          singleProjectUnlinkFromTableButton,
          singleProjectTitle,
          linkedRequestsTablebody,
        },
      },
      stubbedResponses: { projectSearchResponses },
    } = project;

    openLinkProjectModal();

    const first = JSON.stringify(projectSearchResponses.data[0]);
    const second = JSON.stringify(projectSearchResponses.data[1]);
    const third = JSON.stringify(projectSearchResponses.data[2]);
    const fourth = JSON.stringify(projectSearchResponses.data[3]);
    const fifth = JSON.stringify(projectSearchResponses.data[4]);
    const sixth = JSON.stringify(projectSearchResponses.data[5]);

    linkProjectToRequest(first);
    linkProjectToRequest(second);
    linkProjectToRequest(third);
    linkProjectToRequest(fourth);
    linkProjectToRequest(fifth);
    linkProjectToRequest(sixth);

    cy.get(linkedRequestsTablebody).scrollTo('bottom');
    cy.get(
      singleProjectTitle.replace('$', projectSearchResponses.data[5].id)
    ).should('be.visible');

    saveLinkedProjects('multiple');

    cy.get(moreActionsButton).should('be.visible').click();
    cy.get(linkRequestToProjectButton).click();
    cy.get(
      singleProjectUnlinkFromTableButton.replace(
        '$',
        projectSearchResponses.data[0].id
      )
    ).click();
    cy.get(
      singleProjectUnlinkFromTableButton.replace(
        '$',
        projectSearchResponses.data[1].id
      )
    ).click();
    cy.get(
      singleProjectUnlinkFromTableButton.replace(
        '$',
        projectSearchResponses.data[2].id
      )
    ).click();
    cy.get(
      singleProjectUnlinkFromTableButton.replace(
        '$',
        projectSearchResponses.data[3].id
      )
    ).click();
    cy.get(
      singleProjectUnlinkFromTableButton.replace(
        '$',
        projectSearchResponses.data[4].id
      )
    ).click();
    cy.get(
      singleProjectUnlinkFromTableButton.replace(
        '$',
        projectSearchResponses.data[5].id
      )
    ).click();

    saveLinkedProjects('empty');
  });
});
