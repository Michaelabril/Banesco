/// <reference types="Cypress" />

export function APPTIVIDAD(apptividad) {
  describe("BI - Validaciondes OCR", () => {
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
      // Servicio de OCR
      cy.route("POST", "**/wsocr").as("Ocr");
      //servicio de wsvalidatedata
      cy.route("POST", "**/wsvalidatedata").as("validatedata");
      // Servicio de apptividad
      cy.route("POST", "**/wsvalidateapptivity").as("apptividad");
      // Servicio de biometria
      //cy.route("POST", "**/wsbiometric").as("biometria");
    }); //Cierre del beforeEach

    it("Inicio", () => {
      cy.contains("¡Hola! Soy Dana.");
    });

    it("Apptividad Rechazado", () => {
      cy.fixture("index").then((index) => {
        cy.get("[data-test=comencemos_btn]").click();
        cy.wait(7000);
        cy.get("[data-test=insertar-correo]").click();
        cy.get("[data-test=insertar-correo]").type(
          apptividad.datosUsuario.email
        );
        cy.get("[data-test=insertar-ccdigo]").click();
        cy.get("[data-test=insertar-ccdigo]").type(
          apptividad.datosUsuario.code
        );
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
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        });
        cy.wait(20000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });
        cy.wait(3000);
        cy.get(":nth-child(1) > .form-control").clear();
        cy.get(":nth-child(2) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').clear();
        cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
        cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
        cy.get(":nth-child(10) > .form-control").clear();
        cy.get(":nth-child(1) > .form-control").click();
        cy.get(":nth-child(1) > .form-control").type(
          apptividad.datosUsuario.nombres
        );
        cy.get(":nth-child(2) > .form-control").type(
          apptividad.datosUsuario.apellidos
        );
        cy.get('input[formcontrolname="FechaNacimiento"]').type(
          apptividad.datosUsuario.fechaNacimiento
        );
        cy.get(":nth-child(4) > .form-control").select("Masculino");
        cy.get('input[formcontrolname="Fecha_expedicion"]').type(
          apptividad.datosUsuario.fechaexpedicion
        );
        cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
          apptividad.datosUsuario.fechaVencimiento
        );
        cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
        cy.get(":nth-child(10) > .form-control").type(
          apptividad.datosUsuario.numeroRif
        );
        cy.get("[data-test=generar-contrato-btn]").should(
          "have.class",
          "btnDCLJR"
        );
        cy.get("[data-test=generar-contrato-btn]").click();
        cy.wait(1000);
        cy.get('button[id="enviar-correo-correcto"]').click();
        cy.wait("@validatedata", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingValidateData.serviceResponse).to.eq(
            true
          );
        });
        cy.wait(3000);
        cy.get("[data-test=btn-no-acepto-apptividad]").click();
        cy.wait(3000);
        cy.get(":nth-child(1) > span").should(
          "have.text",
          "¡Gracias por confiar en Banesco!"
        );
        cy.screenshot("Apptividad/rechazado");
      });
    });

    it("Apptividad Exitoso", () => {
      cy.fixture("index").then((index) => {
        cy.get("[data-test=comencemos_btn]").click();
        cy.wait(7000);
        cy.get("[data-test=insertar-correo]").click();
        cy.get("[data-test=insertar-correo]").type(
          apptividad.datosUsuario.email
        );
        cy.get("[data-test=insertar-ccdigo]").click();
        cy.get("[data-test=insertar-ccdigo]").type(
          apptividad.datosUsuario.code
        );
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
        });
        cy.wait(5000);
        cy.get("[data-test=apptividad-acepto-btn]").click();
        cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnboardingApptivityData.serviceResponse
          ).to.eq(true);
        });
        cy.get('p[class="titleTutorialCedulaICB"]')
          .eq(1)
          .should("have.text", "Tómate una selfie, tal y como lo ves");
        cy.wait(8000);
        cy.get("[data-test=iniciar-captura-unificado]").click();
        cy.wait(3000);
        cy.screenshot("");
      });
    });
  });
}
