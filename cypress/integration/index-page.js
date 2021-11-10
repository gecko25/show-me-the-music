const { it } = require("mocha");

describe("Landing Page", () => {
  it("Loads events", () => {
    cy.visit("/");
    // Check it loads 50 events
    cy.get('[data-cypress="event"]').should("have.length", 50);
  });

  // TODO: This requires setting some server side stuff up
  // https://glebbahmutov.com/blog/mock-network-from-server/
  xit("Shows the proper error page on failure", () => {
    cy.intercept("GET", "https://api.songkick.com/api/3.0/events*", {
      statusCode: 400,
      body: {
        resultsPage: {
          status: "error",
          error: {
            message:
              "Parameter 'location' must be one of the forms: 'sk:1234', 'geo:-21.22,40.0', 'clientip' or 'ip:127.0.0.1'",
          },
        },
      },
    });

    cy.get('[data-cypress="error"]').should("have.length", 1);
  });
});
