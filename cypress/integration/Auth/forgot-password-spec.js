import appRoutes from '../../support/constants';

let routes;

before('Load Fixtures', () => {
  cy.fixture('auth').then((content) => (routes = content));
});

beforeEach(() => {
  cy.visit('/login');
});

describe('checks for forgot password form', () => {
  it('checks if recovery form loads upon clicking on forgot password link', () => {
    const { selectors } = routes;
    cy.get(selectors.forgotPasswordLink).click();
    cy.url().should('eq', appRoutes.FORGOT_PASSWORD_URL);
  });

  it('checks if email entered has wrong format', () => {
    const { selectors } = routes;
    cy.get(selectors.forgotPasswordLink).click();
    cy.get(selectors.forgotPasswordInputEmail).type('richard');
    cy.get(':nth-child(1) > .text-caption').should('contain', 'Invalid format');
  });

  it('checks for unregistered user', () => {
    const { selectors } = routes;
    cy.get(selectors.forgotPasswordLink).click();
    cy.get(selectors.forgotPasswordInputEmail).type('abc@email.com');
    cy.intercept(Cypress.env('COGNITO_URL')).as('forgot-password');
    cy.get(selectors.forgotPasswordSubmitButton).click();
    cy.wait('@forgot-password');
    cy.get(':nth-child(1) > .text-caption').should(
      'contain',
      'User not registered'
    );
  });
});
