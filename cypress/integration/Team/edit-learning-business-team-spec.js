describe('Edit Team', () => {
  let allTeams, constants;

  before('Load Fixtures', () => {
    cy.fixture('allTeams').then((content) => (allTeams = content));
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

  it('Edit a learning team', () => {
    const { selectors, learningTeams, learningTeamData } = allTeams;
    const { routes, api } = constants;
    cy.intercept(api.fetchLearningTeams, learningTeams).as('learningTeams');
    cy.visit(routes.settings);
    cy.get(selectors.organizationTab).should('be.visible').click();
    cy.get(selectors.learningTeamsTab).should('be.visible').click();
    cy.wait('@learningTeams').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      const teamId = data.learningTeams[0].id;
      cy.intercept(api.learningTeam.replace('$', teamId), learningTeamData).as(
        'ldTeam'
      );
      cy.get(selectors.learningTeamsTableRow.replace('$', teamId)).click();
      cy.url().should('include', teamId);
      cy.wait('@ldTeam').then((payload) => {
        const {
          response: {
            body: { data },
          },
        } = payload;
        expect(data).to.not.be.empty;
        cy.get(selectors.updateButton).should('be.disabled');
        cy.get(selectors.teamMembersTable).should('be.visible');
        cy.get(selectors.teamNameInput)
          .should('have.value', learningTeamData.data.learningTeam.name)
          .click()
          .clear()
          .type('Lorem Epsum');
        cy.intercept('PUT', api.learningTeam.replace('$', teamId)).as(
          'updateTeam'
        );
        cy.get(selectors.updateButton).should('be.enabled').click();
        cy.wait('@updateTeam').then(() => {
          cy.url().should('include', routes.settings);
          cy.checkSuccessMessage();
        });
      });
    });
  });

  it('Edit a business team', () => {
    const { selectors, businessTeams, businessTeamData } = allTeams;
    const { routes, api } = constants;
    cy.intercept(api.businessTeams, businessTeams).as('businessTeams');
    cy.visit(routes.settings);
    cy.get(selectors.organizationTab).should('be.visible').click();
    cy.get(selectors.businessTeamsTab).should('be.visible').click();
    cy.wait('@businessTeams').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      const teamId = data.businessTeams[0].id;
      cy.intercept(`${api.businessTeams}/${teamId}`, businessTeamData).as(
        'businessTeam'
      );
      cy.get(selectors.businessTeamsTableRow.replace('$', teamId)).click();
      cy.url().should('include', teamId);
      cy.wait('@businessTeam').then((payload) => {
        const {
          response: {
            body: { data },
          },
        } = payload;
        expect(data).to.not.be.empty;
        cy.get(selectors.updateButton).should('be.disabled');
        cy.get(selectors.teamMembersTable).should('be.visible');
        cy.get(selectors.teamNameInput)
          .should('have.value', businessTeamData.data.businessTeam.title)
          .click()
          .clear()
          .type('Lorem Epsum');
        cy.intercept('PUT', `${api.businessTeams}/${teamId}`).as('updateTeam');
        cy.get(selectors.updateButton).should('be.enabled').click();
        cy.wait('@updateTeam').then(() => {
          cy.url().should('include', routes.settings);
          cy.checkSuccessMessage();
        });
      });
    });
  });
});
