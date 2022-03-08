describe('Create New User', () => {
  let users, constants;

  before('Load Fixtures', () => {
    cy.fixture('user').then((content) => (users = content));
    cy.fixture('constants').then((content) => (constants = content));
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

  Cypress.Commands.add(
    'initCreateUser',
    (selectors, api, routes, userTypeLabel, userTypeValue) => {
      cy.visit(routes.settings);
      cy.intercept('POST', api.updateUser).as('addUser');
      cy.get(selectors.addUserButton).should('be.visible').click();
      cy.get(selectors.addUserModal.userEmailInput)
        .should('be.visible')
        .click()
        .type('user@email.com');
      cy.get(selectors.addUserModal.userTypeDropdown)
        .should('be.visible')
        .click();
      cy.selectDropdownItem(userTypeLabel, userTypeValue);
      cy.get(selectors.addUserModal.continueAddUserButton)
        .should('be.visible')
        .click();
      cy.get(selectors.userPage.updateButton).should('be.disabled');
    }
  );

  Cypress.Commands.add('fillUserInfo', (selectors) => {
    cy.get(selectors.userPage.firstNameInput)
      .should('be.visible')
      .click()
      .type('firstName');
    cy.get(selectors.userPage.lastNameInput)
      .should('be.visible')
      .click()
      .type('lastName');
    cy.get(selectors.userPage.emailInput)
      .should('be.visible')
      .should('have.value', 'user@email.com');
    cy.get(selectors.userPage.countryDropdown).should('be.visible').click();
    cy.selectDropdownItem('Aland Islands', 'AX');
    cy.get(selectors.userPage.jobTitleInput)
      .should('be.visible')
      .click()
      .type('Job Title');
  });

  it('checks for creating a learning user', () => {
    const { selectors } = users;
    const { api, routes } = constants;
    cy.initCreateUser(selectors, api, routes, 'Learning User', 'ld');
    cy.fillUserInfo(selectors);
    cy.get(selectors.userPage.employmentTypeDropdown)
      .should('be.visible')
      .click();
    cy.selectDropdownItem('Full Time', 'FULL_TIME');
    cy.get(selectors.userPage.weeklyCapacityInput)
      .should('be.visible')
      .click()
      .type(40);
    cy.get(selectors.userPage.updateButton).should('be.enabled').click();
    cy.wait('@addUser').then(() => {
      cy.url().should('include', routes.settings);
      cy.checkSuccessMessage();
    });
  });

  it('checks for creating a business user', () => {
    const { selectors } = users;
    const { api, routes } = constants;
    cy.initCreateUser(selectors, api, routes, 'Business User', 'business');
    cy.fillUserInfo(selectors);
    cy.get(selectors.userPage.businessTeamsDropdown)
      .should('be.visible')
      .click();
    cy.selectDropdownItem(
      'Test Company 1 - Business Team 1',
      '2e7449fe-1787-42cf-a7e8-cf478c11bd9f'
    );
    cy.get(selectors.userPage.updateButton).should('be.enabled').click();
    cy.wait('@addUser').then(() => {
      cy.url().should('include', routes.settings);
      cy.checkSuccessMessage();
    });
  });

  it('checks for creating an external user', () => {
    const { selectors } = users;
    const { api, routes } = constants;
    cy.initCreateUser(selectors, api, routes, 'External User', 'external');
    cy.fillUserInfo(selectors);
    cy.get(selectors.userPage.companyNameInput)
      .should('be.visible')
      .click()
      .type('Company Name');
    cy.get(selectors.userPage.updateButton).should('be.enabled').click();
    cy.wait('@addUser').then(() => {
      cy.url().should('include', routes.settings);
      cy.checkSuccessMessage();
    });
  });
});
