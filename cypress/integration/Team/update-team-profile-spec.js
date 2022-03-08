let selector;
describe('Update Team Member Information', () => {
  before('Load Fixtures', () => {
    cy.fixture('team').then((content) => (selector = content));
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
    cy.viewport(1300, 1000);
    cy.signIn();
  });

  it('checks if update team information modal is visible', () => {
    const { selectors, routes, stubbedTeam } = selector;
    cy.intercept(routes.teamApi, stubbedTeam).as('teams');
    cy.visit(routes.base);
    cy.wait('@teams').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      expect(data).to.not.be.empty;
    });
    cy.contains(selectors.employmentType).should('be.visible');
    cy.contains(selectors.teamMember).should('be.visible');
    cy.contains(selectors.hourlyRate).should('be.visible');
    cy.contains(selectors.jobTitle).should('be.visible');
    cy.contains(selectors.country).should('be.visible');
    cy.get(selectors.menuButton).eq(0).should('be.visible').click();
    cy.contains(selectors.updateInformation).should('be.visible').click();
    cy.get(selectors.updateModal).should('be.visible');
  });

  it('checks if when cancel button is pressed, modal disappears', () => {
    const { selectors, routes, stubbedTeam } = selector;
    cy.intercept(routes.teamApi, stubbedTeam).as('teams');
    cy.visit(routes.base);
    cy.wait('@teams').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      expect(data).to.not.be.empty;
    });
    cy.contains(selectors.employmentType).should('be.visible');
    cy.contains(selectors.teamMember).should('be.visible');
    cy.contains(selectors.hourlyRate).should('be.visible');
    cy.contains(selectors.jobTitle).should('be.visible');
    cy.contains(selectors.country).should('be.visible');
    cy.get(selectors.menuButton).eq(0).should('be.visible').click();
    cy.contains(selectors.updateInformation).should('be.visible').click();
    cy.get(selectors.cancelButton).should('be.visible').click();
    cy.get(selectors.updateModal).should('not.exist');
  });

  it('checks if update team information modal is editable and saved', () => {
    const { selectors, routes, stubbedTeam } = selector;
    cy.intercept(routes.teamApi, stubbedTeam).as('teams');
    cy.visit(routes.base);
    cy.wait('@teams').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      expect(data).to.not.be.empty;
    });
    cy.contains(selectors.employmentType).should('be.visible');
    cy.contains(selectors.teamMember).should('be.visible');
    cy.contains(selectors.hourlyRate).should('be.visible');
    cy.contains(selectors.jobTitle).should('be.visible');
    cy.contains(selectors.country).should('be.visible');
    cy.get(selectors.menuButton).eq(0).should('be.visible').click();
    cy.contains(selectors.updateInformation).should('be.visible').click();
    cy.get(selectors.dropdownSelect).eq(0).should('be.visible').click();
    cy.contains('Business Relationship Management')
      .should('be.visible')
      .click();
    cy.contains('Coaching').should('be.visible').click();
    cy.contains('Consulting').should('be.visible').click();
    cy.get(selectors.dropdownSelect).eq(1).should('be.visible').click();
    cy.contains('Afar').should('be.visible').click();
    cy.contains('Akan').should('be.visible').click();
    cy.get(selectors.inputSkill)
      .should('be.visible')
      .type('Software Engineering');
    cy.get(selectors.saveButton).should('be.visible').click();
  });
});
