/// <reference types="Cypress" />
export function OCR(ocr) {
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
    }); //Cierre del beforeEach

    it("Ocr", () => {
      cy.fixture("index").then((index) => {
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
        cy.wait(30000);
        cy.screenshot("Ocr/Ocr", { timeout: 60000 });
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });
      });
    });

    it("Datos generales - Validar Todos los campos requeridos", () => {
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
      cy.get(":nth-child(4) > .form-control").select("Selecciona una opción");
      cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
      cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
      cy.get("[data-test=situacion-laboral-select]").select(
        "Selecciona una opción"
      );
      cy.get(":nth-child(10) > .form-control").clear();
      cy.get(":nth-child(1) > .form-control").click();
      cy.get("[data-test=generar-contrato-btn]").should("be.disabled");
      cy.screenshot("Ocr/Campos_requeridos", { timeout: 60000 });
    });

    it("Datos generales - Validar campos Nacionalidad y numero de cedula deshabilitados", () => {
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
      cy.get(":nth-child(5) > .form-control").should("be.disabled");
      cy.get(":nth-child(6) > .form-control").should("be.disabled");
      cy.screenshot("Ocr/datos_generales_Nacionalidad_cedula_requeridos", {
        timeout: 6000,
      });
    });

    it("Datos generales - Validar escrituras de campos", () => {
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
      cy.screenshot("Ocr/datos_generales_campos_validos", { timeout: 6000 });
    });

    it("Datos generales - Validar regresar al llenar los campos", () => {
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
      cy.get('button[id="enviar-correo-incorrecto"]').click();
      cy.get(".pb-0").should(
        "have.text",
        "¡Muy bien!Ahora verifiquemos que tus datos estén correctos, puedes editarlos si es necesario:"
      );
      cy.wait(3000);
      cy.screenshot("Ocr/datos_generales_return", { timeout: 60000 });
    });

    it("Datos generales - Validar continuar al llenar los campos", () => {
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
      //cy.get('.pb-0').should('have.text', '¡Muy bien!Ahora verifiquemos que tus datos estén correctos, puedes editarlos si es necesario:')
      cy.wait(3000);
      cy.screenshot("Ocr/datos_generales_exitoso", { timeout: 60000 });
    });

    it("Validar maximo de intentos (6)", () => {
      cy.visit("/");
      cy.fixture("index").then((index) => {
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
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("REMSE3");
        });
        cy.get(".mTopModal > :nth-child(1) > :nth-child(1)")
          .should(
            "have.text",
            "¡Hola! Superaste los 6 intentos para solicitar una cuenta.Te hemos enviado un correo con RECOMENDACIONES A SEGUIR y un NUEVO CÓDIGO. Tendrás estos últimos 6 intentos adicionales para completar tu solicitud."
          )
          .and(
            "include.text",
            "Tendrás estos últimos 6 intentos adicionales para completar tu solicitud."
          );
        cy.screenshot("Ocr/Maximo_6_intentos", {screenshot:60000});
      });
    });
  });
}
