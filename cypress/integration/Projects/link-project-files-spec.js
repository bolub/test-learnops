describe('Link file(s) to a project', () => {
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

  it('Displays the link file form', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, projectWithFiles },
    } = projects;
    const {
      selectors: { tabs, filesTab },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('fetchProjects');
    cy.intercept(`${api.fetchProjects}/${projectWithFiles.data.id}`, {
      statusCode: 200,
      body: projectWithFiles,
    }).as('fetchProject');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.visit(`${routes.projectPage}${projectWithFiles.data.id}`);
    cy.wait('@fetchProject');
    cy.get(tabs.files).click();
    cy.get(filesTab.linkFileButton).should('be.visible').click();
    cy.get(filesTab.linkFileButton).should('not.exist');
    cy.get(filesTab.linkFileNameInput).should('be.visible');
    cy.get(filesTab.linkFileUrlInput).should('be.visible');
    cy.get(filesTab.confirmLinkFileButton).should('be.visible');
    cy.get(filesTab.cancelLinkFileButton).should('be.visible').click();
    cy.get(filesTab.linkFileNameInput).should('not.exist');
    cy.get(filesTab.linkFileUrlInput).should('not.exist');
    cy.get(filesTab.confirmLinkFileButton).should('not.exist');
    cy.get(filesTab.cancelLinkFileButton).should('not.exist');
  });

  it('Cannot link a file when required files are empty', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, projectWithFiles },
    } = projects;
    const {
      selectors: { tabs, filesTab },
      constantTexts: { requiredInformation },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('fetchProjects');
    cy.intercept(`${api.fetchProjects}/${projectWithFiles.data.id}`, {
      statusCode: 200,
      body: projectWithFiles,
    }).as('fetchProject');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.visit(`${routes.projectPage}${projectWithFiles.data.id}`);
    cy.wait('@fetchProject');
    cy.get(tabs.files).click();
    cy.get(filesTab.linkFileButton).click();
    cy.get(filesTab.linkFileNameInput).should('be.visible');
    cy.get(filesTab.linkFileUrlInput).should('be.visible');
    cy.get(filesTab.confirmLinkFileButton).should('be.visible').click();
    cy.get(filesTab.linkFileName).contains(requiredInformation);
    cy.get(filesTab.linkFileUrl).contains(requiredInformation);
  });

  it('Links a files correctly', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, projectWithFiles },
    } = projects;
    const {
      selectors: { tabs, filesTab },
      stubbedResponses: { linkedProjectFile },
    } = projectPage;
    const { ldUsers } = users;
    cy.intercept(api.fetchProjects, projectList).as('fetchProjects');
    cy.intercept(api.ldUsers, ldUsers).as('fetchLDUsers');
    cy.intercept(`${api.fetchProjects}/${projectWithFiles.data.id}`, {
      statusCode: 200,
      body: projectWithFiles,
    }).as('fetchProject');
    cy.intercept('PUT', `${api.fetchProjects}/${projectWithFiles.data.id}`, {
      statusCode: 200,
      body: {
        ...projectWithFiles,
        data: {
          ...projectWithFiles.data,
          data: {
            files: projectWithFiles.data.data.files.concat(linkedProjectFile),
          },
        },
      },
    }).as('updateProject');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.visit(`${routes.projectPage}${projectWithFiles.data.id}`);
    cy.wait('@fetchProject');
    cy.get(tabs.files).click();
    cy.get(filesTab.linkFileButton).click();
    cy.get(filesTab.linkFileNameInput).type('Lorem ipsum dolor sit amet');
    cy.get(filesTab.linkFileUrlInput).type('https://loremflickr.com/640/360');
    cy.get(filesTab.confirmLinkFileButton).click();
    cy.wait('@updateProject');
    cy.get(filesTab.filesTable)
      .get('tbody > tr')
      .eq(1)
      .then(($row) => {
        cy.wrap($row).contains('td', 'link');
        cy.wrap($row).contains('td', 'Lorem ipsum dolor sit amet');
        cy.wrap($row).contains('td', 'Abir Halwa');
      });
  });

  it('Unlinks a file correctly', () => {
    const { api, routes } = constants;
    const {
      stubbedResponses: { projectList, projectWithFiles },
    } = projects;
    const {
      selectors: { tabs, filesTab },
      stubbedResponses: { linkedProjectFile },
    } = projectPage;
    cy.intercept(api.fetchProjects, projectList).as('fetchProjects');
    cy.intercept(`${api.fetchProjects}/${projectWithFiles.data.id}`, {
      statusCode: 200,
      body: {
        ...projectWithFiles,
        data: {
          ...projectWithFiles.data,
          data: {
            files: projectWithFiles.data.data.files.concat(linkedProjectFile),
          },
        },
      },
    }).as('fetchProject');
    cy.intercept('PUT', `${api.fetchProjects}/${projectWithFiles.data.id}`, {
      statusCode: 200,
      body: projectWithFiles,
    }).as('updateProject');
    cy.visit(routes.projectsList);
    cy.wait('@fetchProjects');
    cy.visit(`${routes.projectPage}${projectWithFiles.data.id}`);
    cy.wait('@fetchProject');
    cy.get(tabs.files).click();
    cy.get(filesTab.filesTable)
      .get('tbody > tr')
      .eq(1)
      .then(($row) => {
        cy.wrap($row)
          .find(filesTab.deleteFileButton)
          .should('be.visible')
          .click();
      });
    cy.wait('@updateProject');
    cy.get(filesTab.filesTable).get('tbody > tr').should('have.length', 1);
  });
});
