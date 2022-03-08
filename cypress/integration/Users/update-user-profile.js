describe('Update User', () => {
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

  it('checks for updating a user', () => {
    const { selectors, allUsers } = users;
    const { api, routes } = constants;
    cy.intercept(api.usersApi, allUsers).as('users');
    cy.visit(routes.settings);
    cy.wait('@users').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      expect(data).to.not.be.empty;
      const selectedUser = { data: { user: data[0] } };
      const userInfo = selectedUser.data.user;
      const userId = userInfo.id;
      cy.intercept(`${api.fetchUser}/${userId}`, selectedUser).as('getUser');
      cy.intercept('PUT', `${api.updateUser}/${userId}`).as('updateUser');
      cy.get(selectors.tableRow.replace('$', userId)).click();
      cy.url().should('include', userId);
      cy.wait('@getUser').then((payload) => {
        const {
          response: {
            body: { data },
          },
        } = payload;
        expect(data).to.not.be.empty;
        cy.get(selectors.userPage.updateButton).should('be.disabled');
        cy.get(selectors.userPage.firstNameInput)
          .should('have.value', userInfo.data.firstName)
          .click()
          .clear()
          .type('User');
        cy.get(selectors.userPage.updateButton).should('be.enabled').click();
        cy.wait('@updateUser').then(() => {
          cy.url().should('include', routes.settings);
          cy.checkSuccessMessage();
        });
      });
    });
  });
});
