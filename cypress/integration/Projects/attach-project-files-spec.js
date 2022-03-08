describe('Attach file(s) to a project', () => {
  let constants, projects, projectPage, users;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('projectPage').then((content) => (projectPage = content));
    cy.fixture('user').then((content) => (users = content));
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

  it('Displays an empty table of files', () => {
    const { api, routes } = constants;
    const { stubbedResponses } = projects;
    const {
      selectors: { tabs, filesTab },
      constantTexts: { emptyProjectFilesTableMessage },
    } = projectPage;
    const selectedProject = stubbedResponses.projectList.data[0];
    cy.intercept(api.fetchProjects, stubbedResponses.projectList).as(
      'fetchProjects'
    );
    cy.intercept(`${api.fetchProjects}/${selectedProject.id}`, {
      statusCode: 200,
      body: { code: 200, data: selectedProject, success: true },
    }).as('fetchProject');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.visit(`${routes.projectPage}${selectedProject.id}`);
    cy.wait('@fetchProject');
    cy.get(tabs.files).should('be.visible').click();
    cy.get(filesTab.filesTable)
      .should('be.visible')
      .contains(emptyProjectFilesTableMessage);
    cy.get(filesTab.attachFilesButton).should('be.visible');
    cy.get(filesTab.linkFileButton).should('be.visible');
  });

  it('Displays attach files picker and cancel button', () => {
    const { api, routes } = constants;
    const { stubbedResponses } = projects;
    const {
      selectors: { tabs, filesTab },
    } = projectPage;
    const selectedProject = stubbedResponses.projectList.data[0];
    cy.intercept(api.fetchProjects, stubbedResponses.projectList).as(
      'fetchProjects'
    );
    cy.intercept(`${api.fetchProjects}/${selectedProject.id}`, {
      statusCode: 200,
      body: { code: 200, data: selectedProject, success: true },
    }).as('fetchProject');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.visit(`${routes.projectPage}${selectedProject.id}`);
    cy.wait('@fetchProject');
    cy.get(tabs.files).click();
    cy.get(filesTab.attachFilesButton).click();
    cy.get(filesTab.filePicker).should('be.visible');
    cy.get(filesTab.attachFilesButton).should('not.exist');
    cy.get(filesTab.cancelFileAttachButton).should('be.visible').click();
    cy.get(filesTab.attachFilesButton).should('be.visible');
    cy.get(filesTab.filePicker).should('not.exist');
    cy.get(filesTab.cancelFileAttachButton).should('not.exist');
  });

  it('Displays the attached files on the table correctly', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, projectWithFiles },
    } = projects;
    const {
      selectors: { tabs, filesTab },
    } = projectPage;
    const { ldUsers } = users;
    cy.intercept(api.fetchProjects, projectList).as('fetchProjects');
    cy.intercept(api.ldUsers, ldUsers).as('fetchLDUsers');
    cy.intercept(`${api.fetchProjects}/${projectWithFiles.data.id}`, {
      statusCode: 200,
      body: projectWithFiles,
    }).as('fetchProject');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.visit(`${routes.projectPage}${projectWithFiles.data.id}`);
    cy.wait('@fetchProject');
    cy.get(tabs.files).click();
    cy.wait('@fetchLDUsers');
    cy.get(filesTab.filesTable).contains('td', 'download-one-more.jpeg');
    cy.get(filesTab.filesTable).contains('td', 'Abir Halwa');
    cy.get(filesTab.filesTable).contains('td', '.jpeg');
  });

  it('Deletes attached file from listing', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, projectWithFiles },
    } = projects;
    const {
      selectors: { tabs, filesTab },
      constantTexts: { emptyProjectFilesTableMessage },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('fetchProjects');
    cy.intercept(`${api.fetchProjects}/${projectWithFiles.data.id}`, {
      statusCode: 200,
      body: projectWithFiles,
    }).as('fetchProject');
    cy.intercept('PUT', `${api.fetchProjects}/${projectWithFiles.data.id}`, {
      statusCode: 200,
      body: {
        ...projectWithFiles,
        data: { ...projectWithFiles.data, data: [] },
      },
    }).as('updateProject');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.visit(`${routes.projectPage}${projectWithFiles.data.id}`);
    cy.wait('@fetchProject');
    cy.get(tabs.files).click();
    cy.get(filesTab.deleteFileButton).click();
    cy.wait('@updateProject');
    cy.get(filesTab.filesTable).contains(emptyProjectFilesTableMessage);
  });
});
