export function FLUJOSCOMPLETOSCE(e2eCE) {
  describe("APERTURA DE CUENTAS - PORTAL CLIENTE", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.exec("npm cache clear --force");
      cy.wait(10000);
      cy.server();
      //Servicio al insertar email
      cy.route("POST", "**/wscreatesessionbyemail").as("Sessionid");
      //Servicio al insertar codigo de sesion
      cy.route("POST", "**/wsvalidatecodesession").as("ValidateSessionId");
      cy.route("POST", "**/wsconsultparameters").as("wsconsultparameters");
      //Servicio FATCA y PEP
      cy.route("POST", "**/wsfatca").as("FatcaPep");
      // Servicio de OCR
      cy.route("POST", "**/wsocr").as("Ocr");
      //servicio de wsvalidatedata
      cy.route("POST", "**/wsvalidatedata").as("validatedata");
      // Servicio de apptividad
      cy.route("POST", "**/wsvalidateapptivity").as("apptividad");
      // Servicio de biometria
      cy.route("POST", "**/wsbiometric").as("biometria");
      // Servicio de guardar direccion
      cy.route("POST", "**/wssavesessionaddress").as("guardarDireccion");
      // Servicio de seguro de fraude
      cy.route("POST", "**/wsconsultinsurance").as("seguro");
      // Servicio de tdd
      cy.route("POST", "**/wsconsulttdd").as("tdd");
      // Servicio de tipo de negocios
      cy.route("POST", "**/wstypeofbusiness").as("negocios");
      // Servicio de tipo de profession
      cy.route("POST", "**/wsprofession").as("profesion");
      // Servicio de tipo de situacion empleado
      cy.route("POST", "**/wsemploymentsituation").as("empleados");
      // Servicio de estado civil
      cy.route("POST", "**/wscivilstatus").as("estadoCivil");
      // Servicio de paises de transferencia
      cy.route("POST", "**/wsfiltercountriestransfer").as(
        "paisestransferencia"
      );
      // Servicio de tipo de fondos
      cy.route("POST", "**/wsconsultorigin").as("empleados");
      // Servicio de estado civil
      cy.route("POST", "**/wsfilteroperation").as("perfiltransaccional");
      // Servicio de estado civil
      cy.route("POST", "**/wsupdateprospect").as("actualizarprospect");
      // Servicio de guardar imagenes declaracion jurada
      cy.route("POST", "**/wsgetimages").as("guardarimagenes");
      // Servicio de filtrar paises baneficiarios
      cy.route("POST", "**/wsfiltercountries").as("beneficiariosPaises");
      // Servicio de filtrar relacion beneficiarios
      cy.route("POST", "**/wsfilterrelationship").as("relacionBeneficiarios");
      // Servicio de guardar baneficiarios
      cy.route("POST", "**/wsbeneficiaries").as("guardarBeneficiarios");
      // Servicio de fmostrar el contrato
      cy.route("POST", "**/wsgetfullcontract").as("mostrarContracto");
      // Servicio de aceptarcontrato
      cy.route("POST", "**/wsconfirmanswer").as("aceptarContracto");
      // Servicio de registrar pendiente de aprobacion
      cy.route("POST", "**/wsregisterpending").as("registrarpendiente");
      // Servicio de mostrar el contrato simplificada
      cy.route("POST", "**/wsgetfullcontractsimp").as("mostrarContractosimpl");
      // Servicio de aceptarcontrato
      cy.route("POST", "**/wsupdateprospectsimp").as(
        "actualizarprospectsimpli"
      );
    }); //Cierre del beforeEach

    it("Cuenta simplificada - CLIENTE EXISTE", () => {
      cy.fixture("index").then((index) => {
        // INICIO
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        // LOGUIN
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2eCE.datosUsuario.emailCtaSimplificada);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2eCE.datosUsuario.codeCtasimplificada);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
        });
        cy.wait("@wsconsultparameters", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingParametersData.data.documenttyped
          ).to.eq("CUENTA DE AHORROS SIMPLIFICADA");
        });

        cy.Preguntas_Regulatorias();
        cy.Ocr_ce(e2eCE);
        cy.Apptividad();
        cy.Biometria();
        cy.Direccion(e2eCE);

        //TDD
        cy.wait(10000);
        cy.get("[data-test=btn-quiero-tarjeta]").should("be.visible").click();
        cy.wait("@negocios", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingTypeOfBusinessMessage.code).to.eq(
            200
          );
          expect(
            xhr.responseBody.OnboardingTypeOfBusinessMessage.message
          ).to.eq("Ok");
        });
        cy.wait("@profesion", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingProfessionMessage.code).to.eq(200);
          expect(xhr.responseBody.OnboardingProfessionMessage.message).to.eq(
            "Ok"
          );
        });
        cy.wait("@empleados", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingEmploymentSituationMessage.code
          ).to.eq(200);
          expect(
            xhr.responseBody.OnboardingEmploymentSituationMessage.message
          ).to.eq("Ok");
        });
        cy.wait("@estadoCivil", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingCivilStatusMessage.code).to.eq(200);
          expect(xhr.responseBody.OnboardingCivilStatusMessage.message).to.eq(
            "Ok"
          );
        });

        // DECLARACION JURADA
        cy.wait(10000);
        cy.get("[data-test=situacion-laboral-select]")
          .should("be.visible")
          .select("ASALARIADO");
        cy.get("[data-test=tipo-negocio-select]")
          .should("be.visible")
          .select("ADMINISTRACION");
        cy.get("[data-test=ocupacion-select]")
          .should("be.visible")
          .select("ADMINISTRADOR");
        cy.get("[data-test=salario-input]")
          .should("be.visible")
          .type(e2eCE.declaracion.salario);
        cy.get("[data-test=estado-civil-select]")
          .should("be.visible")
          .select("SOLTERO(A)");
        cy.screenshot("C_SIMPLIFICADA/D_Jurada_Simplificada_CE.png");
        cy.get("[data-test=generar-contrato-btn]").should("be.visible").click();
        cy.wait("@actualizarprospectsimpli", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
          expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(
            true
          );
          expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(
            true
          );
        });
        cy.wait(14000);
        cy.get(".p-2 > #CONDICIONESDETUCUENTA").should("be.visible").click();
        cy.wait(3000);

        //Visor de contratos
        cy.wait("@mostrarContractosimpl", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000);
        cy.get("[data-test=acepto-contrato]").click();
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(
            true
          );
        });
        cy.screenshot("C_SIMPLIFICADA/contrato");
        cy.wait(30000);
        cy.screenshot("C_SIMPLIFICADA/P_Finalizado_CS");
      });
    });

    it("Cuenta Ahorro - CLIENTE EXISTE", () => {
      cy.fixture("index").then((index) => {
        //Pantalla de loguin
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();
        //Pantalla de loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2eCE.datosUsuario.emailCtaAhorro);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2eCE.datosUsuario.codeCtaAhorro);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 })
          .then((xhr) => {
            expect(xhr.status).to.eq(200);
            expect(xhr.responseBody.HttpResponse.code).to.eq(200);
            expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
            const token = xhr.responseBody.OnboardingEmailData.token;
            return token;
          })
          .as("token");
        cy.wait("@wsconsultparameters", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingParametersData.data.documenttyped
          ).to.eq("CUENTA DE AHORRO");
        });

        cy.get("@token").then((token2) => {
          const decoded = jwt_decode(token2);
          const fase = decoded.phase;
          switch (fase) {
            case "1":
              cy.Preguntas_Regulatorias();
              cy.Ocr(e2eCE);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "3":
              cy.Ocr(e2eCE);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "5":
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "7":
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "7.1":
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "8":
              cy.Beneficiarios(e2eCE);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Euros - CLIENTE EXISTE", () => {
      cy.fixture("index").then((index) => {
        //Pantalla de loguin
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();
        //Pantalla de loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2eCE.datosUsuario.emailCtaEuro);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2eCE.datosUsuario.codeCtaEuro);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 })
          .then((xhr) => {
            expect(xhr.status).to.eq(200);
            expect(xhr.responseBody.HttpResponse.code).to.eq(200);
            expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
            const token = xhr.responseBody.OnboardingEmailData.token;
            return token;
          })
          .as("token");
        cy.wait("@wsconsultparameters", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingParametersData.data.documenttyped
          ).to.eq("CUENTA DE AHORRO EN EUROS");
        });
        cy.get("@token").then((token2) => {
          const decoded = jwt_decode(token2);
          const fase = decoded.phase;
          switch (fase) {
            case "1":
              cy.Preguntas_Regulatorias();
              cy.Ocr(e2eCE);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "3":
              cy.Ocr(e2eCE);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "5":
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "7":
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "7.1":
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "8":
              cy.Beneficiarios(e2eCE);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Corriente - CLIENTE EXISTE", () => {
      cy.fixture("index").then((index) => {
        // Inicio
        cy.wait(10000);
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        //Loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaCorriente);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaCorriente);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 })
          .then((xhr) => {
            expect(xhr.status).to.eq(200);
            expect(xhr.responseBody.HttpResponse.code).to.eq(200);
            expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
            const token = xhr.responseBody.OnboardingEmailData.token;
            return token;
          })
          .as("token");
        cy.wait("@wsconsultparameters", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingParametersData.data.documenttyped
          ).to.eq("CUENTA CORRIENTE");
        });
        cy.get("@token").then((token2) => {
          const decoded = jwt_decode(token2);
          const fase = decoded.phase;
          switch (fase) {
            case "1":
              cy.Preguntas_Regulatorias();
              cy.Ocr(e2eCE);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "3":
              cy.Ocr(e2eCE);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "5":
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "7":
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "7.1":
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "8":
              cy.Beneficiarios(e2eCE);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Multipanama - CLIENTE EXISTE", () => {
      cy.fixture("index").then((index) => {
        // INICIO
        cy.wait(10000);
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        // LOGUIN
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaMultipanama);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaMultipanama);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 })
          .then((xhr) => {
            expect(xhr.status).to.eq(200);
            expect(xhr.responseBody.HttpResponse.code).to.eq(200);
            expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
            const token = xhr.responseBody.OnboardingEmailData.token;
            return token;
          })
          .as("token");
        cy.wait("@wsconsultparameters", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingParametersData.data.documenttyped
          ).to.eq("CUENTA DE AHORRO MULTIPANAMA");
        });
        cy.get("@token").then((token2) => {
          const decoded = jwt_decode(token2);
          const fase = decoded.phase;
          switch (fase) {
            case "1":
              cy.Preguntas_Regulatorias();
              cy.Ocr(e2eCE);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "3":
              cy.Ocr(e2eCE);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "5":
              cy.Direccion(e2eCE);
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "7":
              cy.Declaracion_Jurada(e2eCE);
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "7.1":
              cy.Carga_documentos();
              cy.Beneficiarios(e2eCE);
              break;
            case "8":
              cy.Beneficiarios(e2eCE);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Multititular Principal - CLIENTE EXISTE", () => {
      cy.fixture("index").then((index) => {
        // INICIO
        cy.wait(10000);
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        // LOGUIN
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaMultititular0);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaMultititular00);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
          expect(xhr.responseBody.OnboardingEmailData.clientExist).to.eq(true);
        });
        cy.wait("@wsconsultparameters", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingParametersData.data.documenttyped
          ).to.eq("CUENTA DE AHORRO MULTI TITULAR");
        });
        cy.Preguntas_Regulatorias();
        cy.Ocr(e2eCE);
        cy.Apptividad();
        cy.Biometria();
        cy.Direccion(e2eCE);
        cy.TDD();
        cy.Declaracion_Jurada(e2eCE);

        //Contrato
        cy.wait(100000);
        cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000);
        cy.get("[data-test=acepto-contrato]").click();
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(
            true
          );
        });
        cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingRegisterPendingData.serviceResponse
          ).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contracto.png");
      });
    });

    it("Cuenta Multititular secundario - CLIENTE EXISTE", () => {
      cy.fixture("index").then((index) => {
        // inicio
        cy.wait(10000);
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        // Loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaMultititular1);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaMultititular01);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
          expect(xhr.responseBody.OnboardingEmailData.clientExist).to.eq(true);
        });
        cy.wait("@wsconsultparameters", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingParametersData.data.documenttyped
          ).to.eq("CUENTA DE AHORRO MULTI TITULAR");
        });
        cy.Preguntas_Regulatorias();
        cy.Ocr(e2eCE);
        cy.Apptividad();
        cy.Biometria();
        cy.Direccion(e2eCE);
        cy.TDD();
        cy.Declaracion_Jurada(e2eCE);

        //Visor de contrato
        cy.wait(10000);
        cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000);
        cy.get("[data-test=acepto-contrato]").click();
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(
            true
          );
        });
        cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingRegisterPendingData.serviceResponse
          ).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contrato.png");
      });
    });
  });
}
