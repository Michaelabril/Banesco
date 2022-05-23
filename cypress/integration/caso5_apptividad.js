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
    }); //Cierre del beforeEach

    it("Inicio", () => {
      cy.contains("¡Hola! Soy Dana.");
    });

    it("Apptividad", () => {
      cy.get("[data-test=comencemos_btn]").click();
      cy.wait(7000);
      cy.get("[data-test=insertar-correo]").click();
      cy.get("[data-test=insertar-correo]").type(ocr.datosUsuario.email);
      cy.get("[data-test=insertar-ccdigo]").click();
      cy.get("[data-test=insertar-ccdigo]").type(ocr.datosUsuario.code);
      cy.get('[data-test="enviar-correo-electronico"]').click();
      cy.get('[data-test="es-correcto-email"]').click();
      cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
      });
      cy.wait(20000);
      cy.get("[data-test=ocr-unificado-siguiente]").click();
      cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
      });
      cy.get(":nth-child(1) > .form-control").clear();
      cy.get(":nth-child(2) > .form-control").clear();
      cy.get('input[formcontrolname="FechaNacimiento"]').clear();
      cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
      cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();

      cy.get(":nth-child(10) > .form-control").clear();
      cy.get(":nth-child(1) > .form-control").click();
      cy.get(":nth-child(1) > .form-control").type(ocr.datosUsuario.nombres);
      cy.get(":nth-child(2) > .form-control").type(ocr.datosUsuario.apellidos);
      cy.get('input[formcontrolname="FechaNacimiento"]').type(
        ocr.datosUsuario.fechaNacimiento
      );
      cy.get(":nth-child(4) > .form-control").select("Masculino");
      cy.get('input[formcontrolname="Fecha_expedicion"]').type(
        ocr.datosUsuario.fechaexpedicion
      );
      cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
        ocr.datosUsuario.fechaVencimiento
      );
      cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
      cy.get(":nth-child(10) > .form-control").type(ocr.datosUsuario.numeroRif);
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
      cy.screenshot("datos_generales_exitoso");
    });
  });
}
