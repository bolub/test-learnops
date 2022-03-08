import appRoutes from '../../support/constants';

let routes;

before('Load Fixtures', () => {
  cy.fixture('auth').then((content) => (routes = content));
});

beforeEach(() => {
  cy.visit('/login');
});

describe('checks for empty fields', () => {
  it('checks if fields are empty and contains correct placeholder default', () => {
    const { selectors } = routes;

    cy.get(selectors.loginInputEmail)
      .should('be.visible')
      .and('have.value', '')
      .invoke('attr', 'placeholder')
      .should('contain', 'Enter your email');

    cy.get(selectors.loginInputPassword)
      .should('be.visible')
      .and('have.value', '')
      .invoke('attr', 'placeholder')
      .should('contain', '●●●●●●●●●●●');
  });
});

describe('checks for error states', () => {
  it('checks for invalid email', () => {
    const { selectors } = routes;

    cy.get(selectors.loginInputEmail).type('richard');

    cy.get(':nth-child(1) > .text-caption').should('contain', 'Invalid input');
    cy.get(':nth-child(2) > .text-caption').should('contain', 'Input missing');
  });

  it('checks for unregistered user', () => {
    const { selectors } = routes;

    cy.get(selectors.loginInputEmail).type('abc@email.com');
    cy.get(selectors.loginInputPassword).type('password');

    cy.intercept(Cypress.env('COGNITO_URL')).as('login');
    cy.get(selectors.loginSubmitButton).click();

    cy.wait('@login');

    cy.get(':nth-child(1) > .text-caption').should(
      'contain',
      'User not registered'
    );
  });

  it('checks for wrong password', () => {
    const { selectors } = routes;

    cy.get(selectors.loginInputEmail).type(Cypress.env('USER_EMAIL'));
    cy.get(selectors.loginInputPassword).type('password');

    cy.intercept(Cypress.env('COGNITO_URL')).as('login');
    cy.get(selectors.loginSubmitButton).click();

    cy.wait('@login');

    cy.get(':nth-child(2) > .text-caption').should(
      'contain',
      'Password does not match'
    );
  });
});

describe('checks for successful login', () => {
  it('checks if login was successful', () => {
    const { selectors } = routes;

    cy.get(selectors.loginInputEmail).type(Cypress.env('USER_EMAIL'));
    cy.get(selectors.loginInputPassword).type(Cypress.env('USER_PASSWORD'));

    cy.intercept(Cypress.env('COGNITO_URL')).as('login');
    cy.get(selectors.loginSubmitButton).click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('eq', appRoutes.LOGIN_URL);
  });
});
