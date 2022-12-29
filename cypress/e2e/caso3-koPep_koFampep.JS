/// <reference types="Cypress" />

export function KOPEP(casepep) {
  describe("Onboarding KO PEP - FAMPEP", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.wait(5000);
      cy.server();
      //Servicio al insertar email
      cy.route("POST", "**/wscreatesessionbyemail").as("Sessionid");
      //Servicio al insertar codigo de sesion
      cy.route("POST", "**/wsvalidatecodesession").as("ValidateSessionId");
      //Servicio FATCA y PEP
      cy.route("POST", "**/wsfatca").as("FatcaPep");
    }); //Cierre del beforeEach

    it("Preguntas Regulatorias KOPEP", () => {
      cy.fixture("index").then((index) => {
        cy.get("[data-test=comencemos_btn]").click();
        cy.wait(7000);
        cy.get("[data-test=insertar-correo]").click();
        cy.get("[data-test=insertar-correo]").type(casepep.datosUsuario.email);
        cy.get("[data-test=insertar-ccdigo]").click();
        cy.get("[data-test=insertar-ccdigo]").type(casepep.datosUsuario.code);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
        });
        cy.wait(5000);
        cy.get("[data-test=quiero-mi-cuenta-btn]").click();
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=si-pep]").click();
        cy.wait(300);
        cy.get("[data-test=es-correcto-email]").click();
        cy.wait(300);
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingFatcaData.code).to.eq("CPEP");
        });
        cy.wait(5000);
        cy.contains(
          "En estos momentos no se cumplen las condiciones para continuar con la solicitud de la cuenta."
        );
        cy.screenshot("KO'S/KOPEP", { timeout: 60000 });
      });
    });

    it("Validar KO PEP", () => {
      cy.fixture("index").then((index) => {
        cy.get("[data-test=comencemos_btn]").click();
        cy.wait(7000);
        cy.get("[data-test=insertar-correo]").click();
        cy.get("[data-test=insertar-correo]").type(casepep.datosUsuario.email);
        cy.get("[data-test=insertar-ccdigo]").click();
        cy.get("[data-test=insertar-ccdigo]").type(casepep.datosUsuario.code);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("CPEP");
        });
        cy.wait(5000);
        cy.contains(
          "En estos momentos no se cumplen las condiciones para continuar con la solicitud de la cuenta."
        );
        cy.screenshot("KO'S/KOPEP_LOGUIN", { timeout: 60000 });
      });
    });

    it("Preguntas Regulatorias KOFAMPEP", () => {
      cy.fixture("index").then((index) => {
        cy.get("[data-test=comencemos_btn]").click();
        cy.wait(7000);
        cy.get("[data-test=insertar-correo]").click();
        cy.get("[data-test=insertar-correo]").type(
          casepep.datosUsuario.emailfampep
        );
        cy.get("[data-test=insertar-ccdigo]").click();
        cy.get("[data-test=insertar-ccdigo]").type(
          casepep.datosUsuario.codefampep
        );
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
        });
        cy.wait(7000);
        cy.get("[data-test=quiero-mi-cuenta-btn]").click();
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=si-fampep]").click();
        cy.wait(300);
        cy.get("[data-test=es-correcto-email]").click();
        cy.wait(300);
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingFatcaData.code).to.eq("FAMILPEP");
        });
        cy.wait(5000);
        cy.contains(
          "En estos momentos no se cumplen las condiciones para continuar con la solicitud de la cuenta."
        );
        cy.screenshot("KO'S/KOFAMPEP", { timeout: 60000 });
      });
    });

    it("Validar KO FAMPEP", () => {
      cy.fixture("index").then((index) => {
        cy.get("[data-test=comencemos_btn]").click();
        cy.wait(7000);
        cy.get("[data-test=insertar-correo]").click();
        cy.get("[data-test=insertar-correo]").type(
          casepep.datosUsuario.emailfampep
        );
        cy.get("[data-test=insertar-ccdigo]").click();
        cy.get("[data-test=insertar-ccdigo]").type(
          casepep.datosUsuario.codefampep
        );
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("FAMILPEP");
        });
        cy.wait(5000);
        cy.contains(
          "En estos momentos no se cumplen las condiciones para continuar con la solicitud de la cuenta."
        );
        cy.screenshot("KO'S/KOFAMPEP_VALIDAR", { timeout: 60000 });
      });
    });
  });
}
