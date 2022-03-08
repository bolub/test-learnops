const { _ } = Cypress;

describe('Sorting board projects', () => {
  let constants, projects;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('projects').then((content) => (projects = content));
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

  const validateSorting = (selector, order) => {
    const {
      stubbedResponses: { projectProcesses },
      selectors: { boardView },
    } = projects;
    const stages =
      projectProcesses.data[projectProcesses.data.length - 1].projectStages;
    cy.wrap(stages).each((stage) => {
      cy.get(boardView.teamBoard).within(() => {
        cy.get(boardView.stage.replace('$', stage.id)).within(($stage) => {
          cy.wrap($stage)
            .get(selector)
            .then(($elements) =>
              _.map($elements, 'attributes.data-value.textContent')
            )
            .then(($values) => {
              const sorted = _.orderBy($values, [], [order]);
              expect($values).to.deep.equal(sorted);
            });
        });
      });
    });
  };

  it('Changes the board process', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { projectBoard, projectProcesses },
      selectors: { boardViewSwitchButton, boardView },
      constantTexts,
    } = projects;
    cy.intercept(api.fetchProjects, projectBoard).as('teamProjectsList');
    cy.intercept(api.fetchAllProjectProcesses, projectProcesses).as(
      'fetchOrganizationProcesses'
    );
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.get(boardViewSwitchButton).should('be.visible').click();
    cy.get(boardView.teamBoard).should('be.visible');
    cy.get(boardView.processPicker).first().click();
    cy.contains(
      `${constantTexts.viewBy} ${projectProcesses.data[0].processName}`
    ).click();
    const stages = projectProcesses.data[0].projectStages;
    cy.wrap(stages).each((stage, index) => {
      if (index > 1) {
        cy.get(boardView.stagesList).first().scrollTo('right');
      }
      cy.get(boardView.stage.replace('$', stage.id)).should('be.visible');
    });
  });

  it('Sorts board projects by oldest target completion date', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { projectBoard, projectProcesses },
      selectors: { boardViewSwitchButton, boardView },
      constantTexts,
    } = projects;
    cy.intercept(api.fetchProjects, projectBoard).as('teamProjectsList');
    cy.intercept(api.fetchAllProjectProcesses, projectProcesses).as(
      'fetchOrganizationProcesses'
    );
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.get(boardViewSwitchButton).should('be.visible').click();
    cy.get(boardView.teamBoard).should('be.visible');
    cy.get(boardView.sortingPicker).first().click();
    cy.contains(constantTexts.oldest).click();
    validateSorting(boardView.projectCompletionDate, 'asc');
  });

  it('Sorts projects by newest target completion date', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { projectBoard, projectProcesses },
      selectors: { boardViewSwitchButton, boardView },
      constantTexts,
    } = projects;
    cy.intercept(api.fetchProjects, projectBoard).as('teamProjectsList');
    cy.intercept(api.fetchAllProjectProcesses, projectProcesses).as(
      'fetchOrganizationProcesses'
    );
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.get(boardViewSwitchButton).should('be.visible').click();
    cy.get(boardView.teamBoard).should('be.visible');
    cy.get(boardView.sortingPicker).first().click();
    cy.contains(constantTexts.newest).click();
    validateSorting(boardView.projectCompletionDate, 'desc');
  });

  it('Sorts projects by title from A-Z', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { projectBoard, projectProcesses },
      selectors: { boardViewSwitchButton, boardView },
      constantTexts,
    } = projects;
    cy.intercept(api.fetchProjects, projectBoard).as('teamProjectsList');
    cy.intercept(api.fetchAllProjectProcesses, projectProcesses).as(
      'fetchOrganizationProcesses'
    );
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.get(boardViewSwitchButton).should('be.visible').click();
    cy.get(boardView.teamBoard).should('be.visible');
    cy.get(boardView.sortingPicker).first().click();
    cy.contains(constantTexts.titleAsc).click();
    validateSorting(boardView.projectTitle, 'asc');
  });

  it('Sorts projects by title from Z-A', () => {
    const { routes, api } = constants;
    const {
      stubbedResponses: { projectBoard, projectProcesses },
      selectors: { boardViewSwitchButton, boardView },
      constantTexts,
    } = projects;
    cy.intercept(api.fetchProjects, projectBoard).as('teamProjectsList');
    cy.intercept(api.fetchAllProjectProcesses, projectProcesses).as(
      'fetchOrganizationProcesses'
    );
    cy.visit(routes.projectsList);
    cy.wait('@teamProjectsList');
    cy.get(boardViewSwitchButton).should('be.visible').click();
    cy.get(boardView.teamBoard).should('be.visible');
    cy.get(boardView.sortingPicker).first().click();
    cy.contains(constantTexts.titleDesc).click();
    validateSorting(boardView.projectTitle, 'desc');
  });
});
