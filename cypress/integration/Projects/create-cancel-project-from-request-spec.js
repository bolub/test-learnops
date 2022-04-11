describe('Create Cancel Project From Request', () => {
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

  it('checks for create project modal content', () => {
    const { routes } = constants;
    const {
      stubbedResponses: { approvedRequestResponse },
    } = request;
    const {
      selectors: {
        requestCreateProjectButton,
        moreActionsButton,
        createProjectModal: {
          projectInputName,
          projectInputDuration,
          projectInputCategory,
          projectInputProcess,
          projectInputPriority,
          projectInputPrivacy,
          saveOpenProject,
          saveNowProject,
          cancelProject,
        },
      },
    } = project;

    const requestId = 'b5848c2b-b865-4e71-b05a-f1a3a8925486';
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:8001/api/request/*',
      },
      approvedRequestResponse
    ).as('fetchRequestDetail');
    cy.visit(routes.requestDetails.replace('**', requestId));
    cy.url().should('include', `/request/${requestId}`);
    cy.wait('@fetchRequestDetail');
    cy.get(moreActionsButton).should('be.visible').click();
    cy.get(requestCreateProjectButton).should('be.visible').click();
    cy.get(projectInputName).should('be.visible');
    cy.get('.text-primary-light > :nth-child(2) > .h-auto').should(
      'be.visible'
    );
    cy.get(projectInputDuration).should('be.visible');
    cy.get(projectInputCategory).should('be.visible');
    cy.get(projectInputProcess).should('be.visible');
    cy.get(projectInputPriority).should('be.visible');
    cy.get(projectInputPrivacy).should('be.visible');
    cy.get(saveOpenProject).should('be.visible');
    cy.get(saveNowProject).should('be.visible');
    cy.get(cancelProject).should('be.visible');
  });

  it('checks for dropdown content', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        requestCreateProjectButton,
        moreActionsButton,
        createProjectModal: {
          projectInputPrivacy,
          projectInputProcess,
          projectInputCategory,
        },
      },
    } = project;

    const requestId = '8f8b8dd6-071c-46bc-8b0e-4b3d2272a406';
    cy.intercept(api.fetchRequestDetail.replace('**', requestId)).as(
      'fetchRequestDetail'
    );
    cy.intercept(api.fetchAllProjectProcesses).as('fetchAllProjectProcesses');
    cy.intercept(api.ldUsers).as('getLDUsers');
    cy.visit(routes.requestList);
    cy.wait('@allRequests');
    cy.visit(routes.requestDetails.replace('**', requestId));
    cy.url().should('include', `/request/${requestId}`);
    cy.wait('@fetchRequestDetail');
    cy.get(moreActionsButton).should('be.visible').click();
    cy.get(requestCreateProjectButton).click();
    cy.wait('@fetchAllProjectProcesses');
    cy.wait('@getLDUsers');
    cy.get('.text-primary-light > :nth-child(2) > .h-auto')
      .children()
      .then((childData) => {
        cy.get(childData[0]).click();
        cy.get(childData[1]).contains('Abir').click();
      });
    cy.get(projectInputPrivacy).click();
    cy.selectDropdownItem({ label: 'Private', value: 'private' });
    cy.get(projectInputCategory).click();
    cy.selectDropdownItem({
      label: 'New Training Development',
      value: 'a6a9dd58-33ea-4c62-bb65-9f0fb9485437',
    });
    cy.get(projectInputProcess).click();
    cy.selectDropdownItem({
      label: 'ADDIE',
      value: '73009fc1-19d2-405d-9ea8-7576177d747f',
    });
  });

  it('checks if create project can be cancelled', () => {
    const { routes } = constants;
    const {
      stubbedResponses: { approvedRequestResponse },
    } = request;
    const {
      selectors: {
        requestCreateProjectButton,
        moreActionsButton,
        createProjectModal: { cancelProject },
      },
    } = project;

    const requestId = 'b5848c2b-b865-4e71-b05a-f1a3a8925486';
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:8001/api/request/*',
      },
      approvedRequestResponse
    ).as('fetchRequestDetail');
    cy.visit(routes.requestDetails.replace('**', requestId));
    cy.url().should('include', `/request/${requestId}`);
    cy.wait('@fetchRequestDetail');
    cy.get(moreActionsButton).should('be.visible').click();
    cy.get(requestCreateProjectButton).click();

    cy.get(cancelProject).click();
  });

  it('checks if project is created', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        requestCreateProjectButton,
        moreActionsButton,
        projectStartDate,
        createProjectModal: {
          projectName,
          projectInputName,
          projectInputDuration,
          projectInputCategory,
          projectInputProcess,
          projectInputPriority,
          projectInputPrivacy,
          saveOpenProject,
          saveNowProject,
        },
      },
    } = project;

    const requestId = '8f8b8dd6-071c-46bc-8b0e-4b3d2272a406';
    cy.intercept(api.allRequests).as('fetchRequests');
    cy.intercept(api.fetchRequestDetail.replace('**', requestId)).as(
      'fetchRequestDetail'
    );
    cy.intercept(api.fetchAllProjectProcesses).as('fetchAllProjectProcesses');
    cy.intercept(api.ldUsers).as('fetchLDUsers');
    cy.visit(routes.requestList);
    cy.wait('@fetchRequests');
    cy.visit(routes.requestDetails.replace('**', requestId));
    cy.url().should('include', `/request/${requestId}`);
    cy.wait('@fetchRequestDetail');
    cy.get(moreActionsButton).should('be.visible').click();
    cy.get(requestCreateProjectButton).click();
    cy.wait('@fetchAllProjectProcesses');
    cy.wait('@fetchLDUsers');
    cy.get(saveOpenProject).should('be.disabled');
    cy.get(saveNowProject).should('be.disabled');

    cy.get(projectInputName).type(projectName);

    cy.get('.text-primary-light > :nth-child(2) > .h-auto')
      .children()
      .then((childData) => {
        cy.get(childData[0]).click();
        cy.get(childData[1]).contains('Abir').click();
      });

    cy.get(projectInputDuration).click();
    cy.get(projectStartDate).click();
    cy.get(projectStartDate).click();

    cy.get(projectInputCategory).click();
    cy.selectDropdownItem({
      label: 'New Training Development',
      value: 'a6a9dd58-33ea-4c62-bb65-9f0fb9485437',
    });

    cy.get(projectInputProcess).click();
    cy.selectDropdownItem({
      label: 'ADDIE',
      value: '73009fc1-19d2-405d-9ea8-7576177d747f',
    });

    cy.get(projectInputPriority).click();

    cy.selectDropdownItem({
      label: 'Medium',
      value: 'medium',
    });
    // cy.get(
    //   `[data-value='${JSON.stringify({ label: 'Medium', value: 'medium' })}']`
    // )
    //   .should('be.visible')
    //   .eq(1)
    //   .click();

    cy.get(projectInputPrivacy).click();
    cy.selectDropdownItem({ label: 'Public', value: 'public' });

    cy.intercept('POST', api.createProject).as('createProject');
    cy.get(saveNowProject).click();

    cy.wait('@createProject').its('response.statusCode').should('eq', 200);
    cy.get('.bg-success-lighter').should('be.visible');
  });
});
