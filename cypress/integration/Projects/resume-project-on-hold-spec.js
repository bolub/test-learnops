describe('Resume an on-hold status project', () => {
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
    cy.signInLD();
    cy.interceptApiRequests();
  });

  it('Resumes on-hold project', () => {
    const { api, routes } = constants;
    const {
      selectors: { projectStatus, updateProjectButton, projectSuccessModal },
    } = projects;
    const {
      selectors: { putProjectOnHold, formBody },
    } = projectPage;

    cy.intercept(api.fetchProjects).as('fetchProjects');
    cy.intercept(`${api.fetchProjects}/**`).as('fetchProjectDetail');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.customRequest('POST', `${routes.backendURL}${api.createProject}`, {
      ...newProjectData,
      status: 'on_hold',
    }).then((response) => {
      expect(response.status).to.eq(200);
      const newProject = response.body.data;
      cy.visit(`${routes.projectPage}${newProject.id}`);
      cy.wait('@fetchProjectDetail');
      cy.get(putProjectOnHold.onHoldInlineNotification).should('be.visible');
      cy.get(formBody).scrollTo('center');
      cy.get(projectStatus)
        .should('have.attr', 'data-value', 'On Hold')
        .click();
      cy.selectDropdownItem({ label: 'New', value: 'new' });
      cy.get(updateProjectButton).should('not.be.disabled').click();
      cy.get(putProjectOnHold.onHoldInlineNotification).should('not.exist');
      cy.get(projectSuccessModal).should('be.visible');
      cy.customRequest(
        'DELETE',
        `${routes.backendURL}${api.createProject}/${newProject.id}`,
        {}
      ).then((resp) => expect(resp.status).to.eq(200));
    });
  });
});
