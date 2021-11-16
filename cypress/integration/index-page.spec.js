const { expect } = require("chai");
const { it } = require("mocha");

describe("Landing Page", () => {
  before(() => {
    cy.visit("/");
  });

  // This needs to be a better test, we should stub data. its not always going to be 50
  it("Loads events", () => {
    cy.get('[data-cy="event"]').should("have.lengthOf.at.least", 1);
  });

  it("Correctly changes date and updates events", () => {
    cy.get("#selectedDate")
      .invoke("val")
      .then((prev) => {
        cy.get(".SingleDatePicker").click();

        // Click a date 3 days ahead
        cy.get('.CalendarDay[aria-disabled="false"]').eq(3).click();

        expect(prev).not.to.be.undefined;
        expect(prev).not.to.equal(cy.get("#selectedDate").invoke("val"));
      });
  });

  it("Updates events on date change", () => {
    cy.get('[data-cy="artist-name"]')
      .eq(0)
      .invoke("text")
      .then((prevArtist) => {
        cy.get(".SingleDatePicker").click();

        // Click a date 3 days ahead
        cy.get('.CalendarDay[aria-disabled="false"]').eq(3).click();

        expect(prevArtist).not.to.be.undefined;
        expect(prevArtist).not.to.equal(
          cy.get('[data-cy="artist-name"]').eq(0).invoke("text")
        );
      });
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

    cy.get('[data-cy="error"]').should("have.length", 1);
  });

  xit("Shows the proper error message for api failure", () => {
    cy.intercept("GET", "https://api.songkick.com/api/3.0/events*", {
      statusCode: 403,
      body: {
        resultsPage: {
          status: "error",
          error: { message: "Invalid or missing apikey" },
        },
      },
    });

    cy.get('[data-cy="error"]').should("have.length", 1);
  });
});
