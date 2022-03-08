describe('Delete Team', () => {
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

  it('delete a learning team that does not have members', () => {
    const { selectors, learningTeams, noMembersLearningTeam } = allTeams;
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
      cy.intercept(
        api.learningTeam.replace('$', teamId),
        noMembersLearningTeam
      ).as('ldTeam');
      cy.get(selectors.learningTeamsTableRow.replace('$', teamId)).click();
      cy.url().should('include', teamId);
      cy.wait('@ldTeam').then((payload) => {
        const {
          response: {
            body: { data },
          },
        } = payload;
        expect(data).to.not.be.empty;
        cy.intercept('DELETE', api.learningTeam.replace('$', teamId)).as(
          'deleteTeam'
        );
        cy.get(selectors.moreActionsDropdown).should('be.visible').click();
        cy.get(selectors.deleteTeamOption).should('be.visible').click();
        cy.get(selectors.deleteTeamModal.modal).should('be.visible');
        cy.get(selectors.deleteTeamModal.deleteButton)
          .should('be.visible')
          .click();
        cy.wait('@deleteTeam').then(() => {
          cy.url().should('include', routes.settings);
          cy.checkSuccessMessage();
          cy.get(selectors.learningTeamsTableRow.replace('$', teamId)).should(
            'not.be.visible'
          );
        });
      });
    });
  });

  it('delete a team that does not have members', () => {
    const { selectors, businessTeams, noMembersBusinessTeam } = allTeams;
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
      const teamId = data.businessTeams[1].id;
      cy.intercept(`${api.businessTeams}/${teamId}`, noMembersBusinessTeam).as(
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
        cy.get(selectors.moreActionsDropdown).should('be.visible').click();
        cy.get(selectors.deleteTeamOption).should('be.visible').click();
        cy.get(selectors.deleteTeamModal.modal).should('be.visible');
        cy.get(selectors.deleteTeamModal.cancelButton)
          .should('be.visible')
          .click();
        cy.url().should('include', teamId);
        cy.intercept(
          'DELETE',
          `${api.businessTeams}/419e455d-5027-403c-91e4-0cb66142bc2a`
        ).as('deleteTeam');
        cy.get(selectors.moreActionsDropdown).should('be.visible').click();
        cy.get(selectors.deleteTeamOption).should('be.visible').click();
        cy.get(selectors.deleteTeamModal.modal).should('be.visible');
        cy.get(selectors.deleteTeamModal.deleteButton)
          .should('be.visible')
          .click();
        cy.wait('@deleteTeam').then(() => {
          cy.url().should('include', routes.settings);
          cy.checkSuccessMessage();
          cy.get(selectors.businessTeamsTableRow.replace('$', teamId)).should(
            'not.be.visible'
          );
        });
      });
    });
  });

  it('delete a business team that has members', () => {
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
      const teamId = data.businessTeams[1].id;
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
        cy.get(selectors.moreActionsDropdown).should('be.visible').click();
        cy.get(selectors.deleteTeamOption)
          .should('be.visible')
          .trigger('mouseover');
        cy.get(selectors.noDeleteTooltip).should('be.visible');
        cy.get(selectors.deleteTeamOption).first().click();
        cy.url().should('include', teamId);
      });
    });
  });
});
