import get from 'lodash/get';

describe('Project List View', () => {
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

  const isVisible = (elem) =>
    !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

  it('Checks if table does not show if no projects are available', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: {
          myProjectsTab,
          myProjectsEmpty,
          teamProjectsEmpty,
        },
      },
    } = projects;

    cy.intercept(api.fetchProjects, {
      status: 200,
      data: [],
      success: true,
    }).as('teamProjectsList');

    cy.intercept(api.myProjects, {
      status: 200,
      data: [],
      success: true,
    }).as('myProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@teamProjectsList');
    cy.wait('@myProjectsList');

    cy.get(teamProjectsEmpty).should('be.visible');

    cy.get(myProjectsTab).click();

    cy.get(myProjectsEmpty).should('be.visible');
  });

  it('Display the list of projects in the table format for team projects', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: {
          tableRow,
          teamProjectsNumber,
          teamProjectsName,
          teamProjectsStatus,
          teamProjectsBusinessUnit,
          teamProjectsCategory,
          teamProjectsPriority,
          teamProjectsOwner,
          teamProjectsStartDate,
          teamProjectsTargetLaunchDate,
          teamProjectsActualCompletionDate,
          teamProjectsResourcingType,
          teamProjectsBudgetSource,
          teamProjectsProcessStage,
          teamProjectsHealth,
        },
      },
      stubbedResponses: { projectList },
    } = projects;

    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@teamProjectsList').then((payload) => {
      const responseData = get(payload, 'response.body.data');
      expect(responseData).not.to.be.empty;

      const toCheck = [
        teamProjectsNumber,
        teamProjectsName,
        teamProjectsStatus,
        teamProjectsBusinessUnit,
        teamProjectsCategory,
        teamProjectsPriority,
        teamProjectsOwner,
        teamProjectsStartDate,
        teamProjectsTargetLaunchDate,
        teamProjectsActualCompletionDate,
        teamProjectsResourcingType,
        teamProjectsBudgetSource,
        teamProjectsProcessStage,
        teamProjectsHealth,
      ];

      toCheck.forEach((element) => {
        cy.get(element).then((item) => {
          expect(isVisible(item[0])).to.be.true;
        });
      });

      responseData.map((data) => {
        cy.get(tableRow.replace('*', data.id)).should('be.visible');
      });
    });
  });

  it('Display the list of projects in the table format for my projects', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: {
          myProjectsTab,
          myProjectsNumber,
          myProjectsName,
          myProjectsStatus,
          myProjectsBusinessUnit,
          myProjectsRole,
          myProjectsHealth,
          myProjectsCategory,
          myProjectsPriority,
        },
      },
      stubbedResponses: { projectList },
    } = projects;

    cy.intercept(api.myProjects, projectList).as('myProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@myProjectsList').then((payload) => {
      cy.get(myProjectsTab).click();

      cy.get(myProjectsNumber).should('be.visible');
      cy.get(myProjectsName).should('be.visible');
      cy.get(myProjectsCategory).should('be.visible');
      cy.get(myProjectsBusinessUnit).should('be.visible');
      cy.get(myProjectsRole).should('be.visible');
      cy.get(myProjectsPriority).should('be.visible');
      cy.get(myProjectsStatus).should('be.visible');
      cy.get(myProjectsHealth).should('be.visible');
    });
  });

  it('checks if clicking on a table Row opens a project', () => {
    const { routes, api } = constants;
    const {
      selectors: {
        projectsListTable: { projectTitle },
      },
      stubbedResponses: { projectList },
    } = projects;

    cy.intercept(api.fetchProjects, projectList).as('teamProjectsList');

    cy.visit(routes.projectsList);

    cy.wait('@teamProjectsList').then((payload) => {
      const responseData = get(payload, 'response.body.data');
      expect(responseData).not.to.be.empty;

      cy.get(projectTitle.replace('$', responseData[0].id)).click();

      cy.url().should('include', `/project/${responseData[0].id}`);
    });
  });
});
