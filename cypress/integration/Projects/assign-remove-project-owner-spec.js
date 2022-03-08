describe('Assign and Remove project owner', () => {
  let constants, projects, projectPage, request;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
    cy.fixture('projectPage').then((content) => (projectPage = content));
    cy.fixture('request').then((content) => (request = content));
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

  const composeOwnerData = (user) => {
    const firstName = user.data.firstName;
    const lastName = user.data.lastName;

    return {
      label: `${firstName} ${lastName}`,
      avatar: { initial: `${firstName.charAt(0)}${lastName.charAt(0)}` },
      value: user.id,
    };
  };

  it('check if the assign project owner field exists while creating a project from project page', () => {
    const { routes } = constants;
    const {
      selectors: { addProjectButton, addProjectOwnersButton },
    } = projects;

    cy.visit(routes.projectsList);
    cy.get(addProjectButton).click();
    cy.get(addProjectOwnersButton).should('be.visible');
  });

  it('check if the assign project owner field exists while updating a project', () => {
    const { routes, api } = constants;
    const {
      selectors: { addProjectOwnersButton },

      stubbedResponses: { newProject, newProjectId },
    } = projects;

    cy.intercept(api.singleProject.replace('*', newProjectId), newProject);

    cy.visit(`${routes.projectPage}${newProjectId}`);

    cy.get(addProjectOwnersButton).should('be.visible');
  });

  it('check if the assign project owner field exists while creating a project from an approved request', () => {
    const { routes, api } = constants;

    const {
      stubbedResponses: { approvedRequestResponse, approvedRequestResponseId },
      selectors: { moreActionsButton },
    } = request;
    const {
      selectors: { requestCreateProjectButton, addProjectOwnersButton },
    } = projects;

    cy.visit(routes.requestDetails.replace('**', approvedRequestResponseId));

    cy.intercept(
      'GET',
      api.fetchRequestDetail.replace('**', approvedRequestResponseId),
      approvedRequestResponse
    ).as('fetchRequestDetail');
    cy.url().should('include', `/request/${approvedRequestResponseId}`);

    cy.wait('@fetchRequestDetail');

    cy.get(moreActionsButton).should('be.visible').click();
    cy.get(requestCreateProjectButton).click();
    cy.get(addProjectOwnersButton).should('be.visible');
  });

  it("confirm that if only one user is selected as a project owner, you can't uncheck", () => {
    const { routes, api } = constants;
    const {
      selectors: { addProjectButton, addProjectOwnersButton },
      stubbedResponses: { projectLdUsers },
    } = projects;

    cy.visit(routes.projectsList);

    cy.intercept(api.ldUsers, projectLdUsers).as('projectOwners');

    cy.get(addProjectButton).click();

    cy.wait('@projectOwners');

    cy.get(addProjectOwnersButton).click();

    cy.get(
      `[data-value='${JSON.stringify(
        composeOwnerData(projectLdUsers.data[0])
      )}']`
    )
      .should('be.visible')
      .click();

    cy.get(
      `[data-value='${JSON.stringify(
        composeOwnerData(projectLdUsers.data[0])
      )}']`
    )
      .should('be.visible')
      .click()
      .within(() => {
        cy.get('input').should('have.attr', 'aria-checked', 'true');
      });
  });

  it.only('confirm only 2 users can be selected as a project owner', () => {
    const { routes, api } = constants;
    const {
      selectors: { addProjectButton, addProjectOwnersButton },
      stubbedResponses: { projectLdUsers },
    } = projects;

    cy.visit(routes.projectsList);

    cy.intercept(api.ldUsers, projectLdUsers).as('projectOwners');

    cy.get(addProjectButton).click();

    cy.wait('@projectOwners');

    cy.get(addProjectOwnersButton).click();

    cy.get(
      `[data-value='${JSON.stringify(
        composeOwnerData(projectLdUsers.data[0])
      )}']`
    )
      .should('be.visible')
      .click();

    cy.get(
      `[data-value='${JSON.stringify(
        composeOwnerData(projectLdUsers.data[1])
      )}']`
    )
      .should('be.visible')
      .click();

    cy.get(
      `[data-value='${JSON.stringify(
        composeOwnerData(projectLdUsers.data[2])
      )}']`
    )
      .should('be.visible')
      .click();

    cy.get(
      `[data-value='${JSON.stringify(
        composeOwnerData(projectLdUsers.data[3])
      )}']`
    )
      .should('be.visible')
      .click();

    cy.get('[data-value="selected users"]').within(() => {
      cy.get('ul li').should('have.length', 2);
    });
  });

  it.only('confirm that project owners can be removed', () => {
    const { routes, api } = constants;
    const {
      selectors: { addProjectButton, addProjectOwnersButton },
      stubbedResponses: { projectLdUsers },
    } = projects;

    cy.visit(routes.projectsList);

    cy.intercept(api.ldUsers, projectLdUsers).as('projectOwners');

    cy.get(addProjectButton).click();

    cy.wait('@projectOwners');

    cy.get(addProjectOwnersButton).click();

    cy.get(
      `[data-value='${JSON.stringify(
        composeOwnerData(projectLdUsers.data[0])
      )}']`
    )
      .should('be.visible')
      .click();

    cy.get(
      `[data-value='${JSON.stringify(
        composeOwnerData(projectLdUsers.data[1])
      )}']`
    )
      .should('be.visible')
      .click();

    cy.get(
      `[data-value='${JSON.stringify(
        composeOwnerData(projectLdUsers.data[0])
      )}']`
    )
      .should('be.visible')
      .click();

    cy.get('[data-value="selected users"]').within(() => {
      cy.get('ul li').should('have.length', 1);
    });
  });
});
