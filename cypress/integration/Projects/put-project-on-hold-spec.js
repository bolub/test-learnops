describe('Put project on hold', () => {
  let constants, projects, projectPage, newProjectData;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('projectPage').then((content) => (projectPage = content));
    cy.fixture('newProject').then((content) => (newProjectData = content));
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
    cy.interceptApiRequests();
  });

  it('Puts project on hold and select a reason', () => {
    const { api, routes } = constants;
    const {
      selectors: { projectStatus },
    } = projects;
    const {
      selectors: { putProjectOnHold, formBody },
    } = projectPage;
    cy.intercept(api.fetchProjects).as('fetchProjects');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.customRequest('POST', `${routes.backendURL}${api.createProject}`, {
      ...newProjectData,
      status: 'in_progress',
    }).then((response) => {
      expect(response.status).to.eq(200);
      const newProject = response.body.data;
      cy.intercept(`${api.fetchProjects}/${newProject.id}`).as(
        'fetchProjectDetail'
      );
      cy.visit(`${routes.projectPage}${newProject.id}`);
      cy.wait('@fetchProjectDetail');
      cy.get(formBody).scrollTo('center');
      cy.get(projectStatus).click();
      cy.selectDropdownItem({ label: 'On Hold', value: 'on_hold' });
      cy.get(putProjectOnHold.modalWindow).should('be.visible');
      cy.get(putProjectOnHold.confirmButton).should('be.disabled');
      cy.get(putProjectOnHold.holdReasonPicker).click();
      cy.selectDropdownItem({
        label: 'Timeline conflict',
        value: 'Timeline conflict',
      });
      cy.get(putProjectOnHold.confirmButton).should('not.be.disabled').click();
      cy.get(putProjectOnHold.modalWindow).should('not.exist');
      cy.get(formBody).scrollTo('top');
      cy.get(putProjectOnHold.onHoldInlineNotification).should('be.visible');
      cy.get(putProjectOnHold.viewHoldReasonButton).click();
      cy.get(putProjectOnHold.modalWindow).should('be.visible');
      cy.get(putProjectOnHold.holdReasonPicker).should(
        'have.attr',
        'data-value',
        'Timeline conflict'
      );
      cy.get(putProjectOnHold.cancelButton).click();
      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.createProject}/${newProject.id}`,
        {}
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });

  it('Puts project on hold and specify a reason', () => {
    const { api, routes } = constants;
    const {
      selectors: { projectStatus },
    } = projects;
    const {
      selectors: { putProjectOnHold, formBody },
    } = projectPage;
    cy.intercept(api.fetchProjects).as('fetchProjects');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.customRequest('POST', `${routes.backendURL}${api.createProject}`, {
      ...newProjectData,
      status: 'in_progress',
    }).then((response) => {
      expect(response.status).to.eq(200);
      const newProject = response.body.data;
      cy.intercept(`${api.fetchProjects}/${newProject.id}`).as(
        'fetchProjectDetail'
      );
      cy.visit(`${routes.projectPage}${newProject.id}`);
      cy.wait('@fetchProjectDetail');
      cy.get(formBody).scrollTo('center');
      cy.get(projectStatus).click();
      cy.selectDropdownItem({ label: 'On Hold', value: 'on_hold' });
      cy.get(putProjectOnHold.modalWindow).should('be.visible');
      cy.get(putProjectOnHold.confirmButton).should('be.disabled');
      cy.get(putProjectOnHold.holdReasonPicker).click();
      cy.selectDropdownItem({ label: 'Other', value: 'Other' });
      cy.get(putProjectOnHold.confirmButton).should('be.disabled');
      cy.get(putProjectOnHold.specifyReasonInput).type(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      );
      cy.get(putProjectOnHold.confirmButton).should('not.be.disabled').click();
      cy.get('putProjectOnHold.modalWindow').should('not.exist');
      cy.get(formBody).scrollTo('top');
      cy.get(putProjectOnHold.onHoldInlineNotification).should('be.visible');
      cy.get(putProjectOnHold.viewHoldReasonButton).click();
      cy.get(putProjectOnHold.modalWindow).should('be.visible');
      cy.get(putProjectOnHold.holdReasonPicker).should(
        'have.attr',
        'data-value',
        'Other'
      );
      cy.get(putProjectOnHold.specifyReasonInput).should(
        'have.attr',
        'value',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      );
      cy.get(putProjectOnHold.cancelButton).click();
      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.createProject}/${newProject.id}`,
        {}
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });

  it('Cannot update hold reason when user is not an owner', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectSearchResponses },
    } = projects;
    const {
      selectors: { putProjectOnHold },
    } = projectPage;

    cy.intercept(api.allRequests, projectSearchResponses).as(
      'fetchAllProjects'
    );
    cy.intercept(`${api.fetchProjects}/${projectSearchResponses.data[1].id}`, {
      statusCode: 200,
      body: {
        code: 200,
        data: { ...projectSearchResponses.data[1] },
        success: true,
      },
    });
    cy.intercept(
      'PUT',
      `${api.fetchProjects}/${projectSearchResponses.data[1].id}`,
      { statusCode: 200 }
    ).as('updateProject');
    cy.visit(routes.projectsList);
    cy.visit(`${routes.projectPage}${projectSearchResponses.data[1].id}`);
    cy.get(putProjectOnHold.onHoldInlineNotification).should('be.visible');
    cy.get(putProjectOnHold.viewHoldReasonButton).click();
    cy.get(putProjectOnHold.modalWindow).should('be.visible');
    cy.get(putProjectOnHold.confirmButton).should('be.disabled');
  });

  it('Cancels put project on hold flow', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectSearchResponses },
      selectors: { projectStatus },
    } = projects;
    const {
      selectors: { putProjectOnHold, formBody },
    } = projectPage;

    cy.intercept(api.allRequests, projectSearchResponses).as(
      'fetchAllProjects'
    );
    cy.intercept(`${api.fetchProjects}/${projectSearchResponses.data[0].id}`, {
      statusCode: 200,
      body: {
        code: 200,
        data: { ...projectSearchResponses.data[0] },
        success: true,
      },
    });
    cy.intercept(
      'PUT',
      `${api.fetchProjects}/${projectSearchResponses.data[0].id}`,
      { statusCode: 200 }
    ).as('updateProject');
    cy.visit(routes.projectsList);
    cy.visit(`${routes.projectPage}${projectSearchResponses.data[0].id}`);
    cy.get(formBody).scrollTo('center');
    cy.get(projectStatus).click();
    cy.selectDropdownItem({ label: 'On Hold', value: 'on_hold' });
    cy.get(putProjectOnHold.modalWindow).should('be.visible');
    cy.get(putProjectOnHold.cancelButton).click();
    cy.get(projectStatus).should('have.attr', 'data-value', 'New');
  });
});
