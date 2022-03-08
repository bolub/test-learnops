describe('View Vendors', () => {
  let selector;

  before('Load Fixtures', () => {
    cy.fixture('vendors').then((content) => (selector = content));
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
  });

  it('admin views all vendors', () => {
    const { selectors, routes, vendors } = selector;
    cy.intercept(routes.vendorsApi, vendors).as('vendors');
    cy.visit(routes.vendorsPage);
    cy.contains(selectors.organiztionTab).click();
    cy.contains(selectors.vendorsTab).click();
    cy.wait('@vendors').then((payload) => {
      const {
        response: {
          body: { data },
        },
      } = payload;
      expect(data).to.not.be.empty;
    });
    for (selector of Object.keys(selectors.vendorsTable)) {
      cy.get(selectors.vendorsTable[selector]).should('be.visible');
    }
  });
});
