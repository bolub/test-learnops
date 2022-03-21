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

  it('Add vendor button is visiible', () => {
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
    cy.get(selectors.addVendorButton).should('be.visible');
  });

  it('Add Vendor Modal appears when button is pressed', () => {
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
    cy.get(selectors.addVendorButton).should('be.visible').click();
    cy.get(selectors.vendorModal).should('be.visible');
  });

  it('Check if save vendor details button is disabled when there is no  input', () => {
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
    cy.get(selectors.addVendorButton).should('be.visible').click();
    cy.get(selectors.vendorModal).should('be.visible');
    cy.get(selectors.saveVendorDetails).should(
      'not.have.css',
      'display',
      'disabled'
    );
  });

  it('Check if cancel button closes add vendor modal', () => {
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
    cy.get(selectors.addVendorButton).should('be.visible').click();
    cy.get(selectors.vendorModal).should('be.visible');
    cy.get(selectors.saveVendorDetails).should(
      'not.have.css',
      'display',
      'disabled'
    );
    cy.get(selectors.cancelButton).should('be.visible').click();
    cy.get(selectors.vendorModal).should('not.exist');
  });

  it('Add Vendor Modal Input Field can be populated', () => {
    const { selectors, routes, vendors, newVendor } = selector;
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
    cy.get(selectors.addVendorButton).should('be.visible').click();
    cy.get(selectors.vendorModal).should('be.visible');
    cy.get(selectors.saveVendorDetails).should(
      'not.have.css',
      'display',
      'disabled'
    );
    cy.get(selectors.vendorNameInput)
      .should('be.visible')
      .type(selectors.vendorName);
    cy.get(selectors.vendorAddressInput)
      .should('be.visible')
      .type(selectors.vendorAddress);
    cy.get(selectors.vendorCountryInput).should('be.visible').click();
    cy.contains('Austria').click();
    cy.get(selectors.vendorWebsiteInput)
      .should('be.visible')
      .type(selectors.vendorWebsite);
    cy.get(selectors.vendorEmailInput)
      .should('be.visible')
      .type(selectors.vendorEmail);
    cy.get(selectors.vendorDescriptionInput)
      .should('be.visible')
      .type(selectors.vendorDescription);
    cy.get(selectors.vendorProvinceInput).should('be.visible').click();
    cy.contains('Burgenland').click();
    cy.get(selectors.vendorContactInput)
      .should('be.visible')
      .type(selectors.vendorName);
    cy.get(selectors.vendorPhoneInput)
      .should('be.visible')
      .type(selectors.vendorPhone);
    cy.intercept('POST', routes.vendorsApi, newVendor).as('addVendor');
    cy.get(selectors.saveVendorDetails).should('be.visible').click();
    cy.wait('@addVendor');
    cy.location('pathname').should('eq', routes.settings);
  });
});
