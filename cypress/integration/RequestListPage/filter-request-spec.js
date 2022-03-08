describe('Filter Requests', () => {
  let constants, requestList;

  before(() => {
    cy.fixture('constants').then((content) => (constants = content));
    cy.fixture('requestList').then((content) => (requestList = content));
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

  it('filters requests using different conditionals', () => {
    const { routes, api } = constants;
    const { selectors, filterRequestList } = requestList;

    cy.visit(routes.requestList);
    cy.intercept(api.allRequests, filterRequestList).as('allRequests');

    cy.get(selectors.filter.filterRequestButton).first().click();
    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Requester').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('1');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=tag-close]').click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Requester').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('User');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=tag-close]').click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Request Title').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('Request 4');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=tag-close]').click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Submission Date').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Less than or Equal to').should('be.visible').click();
    cy.get('[aria-label=From]').click();
    cy.get('[data-value=4]').click();
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=tag-close]').click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Status').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('In Review');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=tag-close]').click();
  });

  it('checks multiple filters using AND operator', () => {
    const { routes, api } = constants;
    const { selectors, filterRequestList } = requestList;

    cy.visit(routes.requestList);
    cy.intercept(api.allRequests, filterRequestList).as('allRequests');

    cy.get(selectors.filter.filterRequestButton).first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Requester').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('Abir');
    cy.get(selectors.filter.applyButton).first().click();

    cy.get('[data-testid=and__button]').first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Request Number').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Equal to').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('1');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=and__button]').first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Request Title').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('Sample Request');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get(`[data-cy=total_results-1]`).contains('1 Results');
    cy.contains('Clear All').click();
  });

  it('checks multiple filters using OR operator', () => {
    const { routes, api } = constants;
    const { selectors, filterRequestList } = requestList;

    cy.visit(routes.requestList);
    cy.intercept(api.allRequests, filterRequestList).as('allRequests');

    cy.get(selectors.filter.filterRequestButton).first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Request Number').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Equal to').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('1');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=or__button]').first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Request Title').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('Request 4');
    cy.get(selectors.filter.applyButton).first().click();
    cy.contains('Clear All').click();
  });

  it('checks filters using AND and OR operators simultaneously', () => {
    const { routes, api } = constants;
    const { selectors, filterRequestList } = requestList;

    cy.visit(routes.requestList);
    cy.intercept(api.allRequests, filterRequestList).as('allRequests');

    cy.get(selectors.filter.filterRequestButton).first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Request Number').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Greater than').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('1');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=and__button]').first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Status').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('draft');
    cy.get(selectors.filter.applyButton).first().click();

    cy.get('[data-testid=or__button]').first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Request Title').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains('Contains').should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('Request 4');
    cy.get(selectors.filter.applyButton).first().click();
    cy.contains('Clear All').click();
  });

  it('checks Does not contain filter', () => {
    const { routes, api } = constants;
    const { selectors, filterRequestList } = requestList;

    cy.visit(routes.requestList);
    cy.intercept(api.allRequests, filterRequestList).as('allRequests');

    cy.get(selectors.filter.filterRequestButton).first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Request Number').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains("Doesn't contain").should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('11');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=and__button]').first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Request Title').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains("Doesn't contain").should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('QA Request');
    cy.get(selectors.filter.applyButton).first().click();
    cy.get('[data-testid=and__button]').first().click();

    cy.get(selectors.filter.columnTitle).first().click();
    cy.contains('Status').should('be.visible').click();
    cy.get(selectors.filter.operator).first().click();
    cy.contains("Doesn't contain").should('be.visible').click();
    cy.get(selectors.filter.filterValue).first().type('approved');
    cy.get(selectors.filter.applyButton).first().click();
    cy.contains('Clear All').click();
  });
});
