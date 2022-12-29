/// <reference types="Cypress" />

export function LOGUIN(loguin) {
  describe("BI - Validaciondes Loguin", () => {
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

    it("Inicio", () => {
      cy.contains("¡Hola! Soy Dana.");
      cy.screenshot("Loguin/Inicio", { timeout: 60000 });
    });

    it("Loguin Exitoso", () => {
      cy.fixture("index").then((index) => {
        cy.get("[data-test=comencemos_btn]").click();
        cy.wait(7000);
        cy.get("[data-test=insertar-correo]").click();
        cy.get("[data-test=insertar-correo]").type(loguin.datosUsuario.email);
        cy.get("[data-test=insertar-ccdigo]").click();
        cy.get("[data-test=insertar-ccdigo]").type(loguin.datosUsuario.code);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
        });
        cy.wait(5000);
        cy.screenshot("Loguin/Loguin_exitoso", { timeout: 60000 });
      });
    });

    it("Codigo invalido en el Loguin", () => {
      cy.get("[data-test=comencemos_btn]").click();
      cy.wait(7000);
      cy.get("[data-test=insertar-correo]").click();
      cy.get("[data-test=insertar-correo]").type(loguin.datosUsuario.email);
      cy.get("[data-test=insertar-ccdigo]").click();
      cy.get("[data-test=insertar-ccdigo]").type("123456");
      cy.get('[data-test="enviar-correo-electronico"]').click();
      cy.get('[data-test="es-correcto-email"]').click();
      cy.wait(4000);
      cy.contains(
        "El correo o código que ingresaste no se encuentra registrado en nuestro sistema."
      );
      cy.screenshot("Loguin/Loguin_Invalido", { timeout: 60000 });
    });

    it("Preguntas Regulatorias", () => {
      cy.fixture("index").then((index) => {
        cy.get("[data-test=comencemos_btn]").click();
        cy.wait(7000);
        cy.get("[data-test=insertar-correo]").click();
        cy.get("[data-test=insertar-correo]").type(loguin.datosUsuario.email);
        cy.get("[data-test=insertar-ccdigo]").click();
        cy.get("[data-test=insertar-ccdigo]").type(loguin.datosUsuario.code);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
        });
        cy.wait(5000);
        cy.get('[data-test=quiero-mi-cuenta-btn]').click()
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        /*cy.get('[data-test=fatcapep-btn-siguiente]').click()
            cy.wait('@FatcaPep', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              });*/
        cy.wait(5000);
        cy.screenshot("Loguin/pantalla_preguntas_regulatorias", { timeout: 60000 });
      });
    });

    it("Ocr", () => {
      cy.fixture("index").then((index) => {
        cy.get("[data-test=comencemos_btn]").click();
        cy.wait(7000);
        cy.get("[data-test=insertar-correo]").click();
        cy.get("[data-test=insertar-correo]").type(loguin.datosUsuario.email);
        cy.get("[data-test=insertar-ccdigo]").click();
        cy.get("[data-test=insertar-ccdigo]").type(loguin.datosUsuario.code);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
        });
        cy.wait(5000);
        cy.get('[data-test=quiero-mi-cuenta-btn]').click()
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        });
        cy.wait(5000);
        cy.screenshot("Loguin/pantalla_Ocr", { timeout: 60000 });
      });
    });

    it("Usar un correo que ya tenga el KO - SES3FA", () => {
      cy.get("[data-test=comencemos_btn]").click();
      cy.wait(7000);
      cy.get("[data-test=insertar-correo]").click();
      cy.get("[data-test=insertar-correo]").type("prueba07@yopmail.com");
      cy.get("[data-test=insertar-ccdigo]").click();
      cy.get("[data-test=insertar-ccdigo]").type("896938");
      cy.get('[data-test="enviar-correo-electronico"]').click();
      cy.get('[data-test="es-correcto-email"]').click();
      cy.contains(
        "Nuestro equipo estará revisando la información que pudiste completar en la plataforma. Te estaremos notificando en los próximos 5 días el resultado del caso. Si el problema es de conexión de internet, no podremos atenderte por el momento.",
        { timeout: 10000 }
      );
      cy.screenshot("Loguin/KO_SES3FA", { timeout: 60000 });
    });
  });
}
