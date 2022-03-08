import get from 'lodash/get';

describe('Update budget plan e2e', () => {
  let constants, projectPage;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
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
    cy.signInLD();
    cy.interceptApiRequests();
  });

  const visitProjectPeoplePage = () => {
    const { api, routes } = constants;

    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';
    cy.intercept(`${api.fetchProjects}/${projectId}`).as('fetchProject');
    cy.intercept(api.fetchVendors).as('fetchVendors');

    cy.visit(`${routes.projectPage}${projectId}?tab=people`);
    cy.wait('@fetchProject');
  };

  it('Checks for people plan fields and components', () => {
    const {
      selectors: {
        peopleTab: {
          projectResourceType,
          projectResourceVendorDropdown,
          projectResourceCancelButton,
          projectResourceSaveButton,
        },
      },
    } = projectPage;

    visitProjectPeoplePage();

    cy.get('[data-testid=tab-0]').should('have.text', 'Resource Plan');
    cy.get(projectResourceType).should('be.visible').click();

    const data = {
      label: 'Vendor',
      value: 'vendor',
    };

    cy.get(`[data-value='${JSON.stringify(data)}']`)
      .should('be.visible')
      .click();

    cy.get(projectResourceVendorDropdown).should('be.visible');
    cy.get(projectResourceCancelButton).should('be.visible');
    cy.get(projectResourceSaveButton).should('be.visible');
  });

  it('Checks if cancel option works and if save button is disabled by default', () => {
    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';

    const {
      selectors: {
        peopleTab: { projectResourceCancelButton, projectResourceSaveButton },
      },
    } = projectPage;

    visitProjectPeoplePage();

    cy.get(projectResourceSaveButton).should(
      'have.attr',
      'aria-disabled',
      'true'
    );
    cy.get(projectResourceCancelButton).click();
    cy.url().should('include', `/project/${projectId}?tab=overview`);
  });

  it('Checks if resource plan fields are updated', () => {
    const { api } = constants;
    const projectId = 'd5b298c3-9393-4efe-b1bf-8fabd5306484';

    const {
      selectors: {
        peopleTab: {
          projectResourceType,
          projectResourceVendorDropdown,
          projectResourceSaveButton,
        },
      },
    } = projectPage;

    visitProjectPeoplePage();

    cy.wait('@fetchVendors').then((payload) => {
      const allVendors = get(payload, 'response.body.data.vendors');

      cy.get(projectResourceType).should('be.visible').click();

      const vendorDrop = {
        label: 'Vendor',
        value: 'vendor',
      };

      const internalDrop = {
        label: 'Internal',
        value: 'internal',
      };

      cy.get(`[data-value='${JSON.stringify(vendorDrop)}']`).click();

      cy.get(projectResourceVendorDropdown).click();

      const newVendor = {
        label: allVendors[0].vendorName,
        value: allVendors[0].id,
      };

      cy.get(`[data-value='${JSON.stringify(newVendor)}']`).click();

      cy.intercept('PUT', `${api.fetchProjects}/${projectId}`).as(
        'updateProject'
      );
      cy.get(projectResourceSaveButton).click();

      cy.wait('@updateProject');
      cy.checkSuccessMessage();

      cy.reload();
      cy.wait('@fetchProject');

      cy.get(projectResourceType).should('be.visible').click();

      cy.get(`[data-value='${JSON.stringify(vendorDrop)}']`).should(
        'have.attr',
        'tabIndex',
        '0'
      );

      cy.get(`[data-value='${JSON.stringify(internalDrop)}']`)
        .eq(0)
        .click();

      cy.get(projectResourceSaveButton).click();
      cy.wait('@updateProject');
      cy.checkSuccessMessage();

      cy.get(projectResourceType).should('be.visible').click();

      cy.get(`[data-value='${JSON.stringify(internalDrop)}']`).should(
        'have.attr',
        'tabIndex',
        '0'
      );
    });
  });
});
