/// <reference types="Cypress" />
export function OCR(ocr) {
  describe("BI - Validaciondes OCR", () => {
    beforeEach(() => {
      cy.visit("./");
      cy.server();
      cy.route("POST", "**/wsgetsessionidbi").as("code");
    });

    it("Obtener codigo", () => {
      cy.request("POST", Cypress.env("baseUrlBack") + "wsdatacleanerbi", {
        Email: pasd.mail,
      }).then((response) => {
        cy.log(JSON.stringify(response.body));
        expect(response.body.HttpResponse.code).to.eq(200);
      }); // fin del servicio de borrado
      cy.request("POST", Cypress.env("baseUrlBack") + "wsgetsessionidbi", {
        Email: pasd.mail,
      }).then((response) => {
        cy.log(JSON.stringify(response.body));
        expect(response.body.HttpResponse.code).to.eq(200);
        const secretCode = response.body.OnboardingSessionData.sessionId;
        cy.wait(30000);
        cy.get("[data-test=comencemos_btn]").click().wait(20000);
        cy.get("[data-test=insertar-correo]").type(pasd.mail);
        cy.get("[data-test=insertar-ccdigo]").type(secretCode);
        cy.get("[data-test=enviar-correo-electronico]").click();
        cy.get("[data-test=es-correcto-email]").click();
        cy.wait(5000);
      });
    });
  });
}
