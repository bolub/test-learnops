describe('Projects Privacy', () => {
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
    cy.signIn();
    cy.interceptApiRequests();
  });

  it('checks private privacy option in basic details section', () => {
    const { selectors } = projects;
    const { routes } = constants;
    cy.visit(routes.projectsList);
    cy.get(`${selectors.addProjectButton}`).should('be.visible').click();
    cy.get('[data-cy=project-form-body]').scrollTo('bottom');
    cy.get(`${selectors.projectPrivacy}`).should('be.visible').click();
    cy.selectDropdownItem('Private', 'private');
    cy.get('[data-cy=project-privacy-helper-text]')
      .should('be.visible')
      .contains('The project access is limited to your account');
  });

  it('checks team privacy option in basic details section', () => {
    const { selectors } = projects;
    const { routes } = constants;
    cy.visit(routes.projectsList);
    cy.get(`${selectors.addProjectButton}`).should('be.visible').click();
    cy.get('[data-cy=project-form-body]').scrollTo('bottom');
    cy.get(`${selectors.projectPrivacy}`).should('be.visible').click();
    cy.selectDropdownItem('Team', 'team');
    cy.get('[data-cy=project-team-input]').should('be.visible').click();
    cy.selectDropdownItem(
      'Test Company 1 - Learning Team 1',
      'f8bf7b58-7662-49a5-b234-3fa1680f2603'
    );
    cy.selectDropdownItem(
      'Test Company 1 - Learning Team 2',
      '9b65072b-469a-4ae6-a3da-355fb8a1825f'
    );
  });

  it('checks public privacy option in basic details section', () => {
    const { selectors } = projects;
    const { routes } = constants;
    cy.visit(routes.projectsList);
    cy.get(`${selectors.addProjectButton}`).should('be.visible').click();
    cy.get('[data-cy=project-form-body]').scrollTo('bottom');
    cy.get(`${selectors.projectPrivacy}`).should('be.visible').click();
    cy.selectDropdownItem('Public', 'public');
    cy.get('[data-cy=project-privacy-helper-text]')
      .should('not.contain', 'The project access is limited to your account')
      .should(
        'not.contain',
        'The project access is limited the teams you select'
      );
  });
});
