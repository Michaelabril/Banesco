import jwt_decode from "jwt-decode";

export function FLUJOSCOMPLETOS(e2e) {
  describe("APERTURA DE CUENTA CLIENTES NUEVOS - PORTAL CLIENTE", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.exec("npm cache clear --force");
      cy.wait(10000);
      cy.server();
      //Servicio al insertar email
      cy.route("POST", "**/wscreatesessionbyemail").as("Sessionid");
      // servicio de consulta de parametros
      cy.route("POST", "**/wsconsultparameters").as("wsconsultparameters");
      //Servicio FATCA y PEP
      cy.route("POST", "**/wsfatca").as("FatcaPep");
      // Servicio de OCR
      cy.route("POST", "**/wsocr").as("Ocr");
      //servicio de wsvalidatedata
      cy.route("POST", "**/wsvalidatedata").as("validatedata");
      // Servicio de apptividad
      cy.route("POST", "**/wsvalidateapptivity").as("apptividad");
      // Servicio de apptividad del menor
      cy.route("POST", "**/wsmenorvalidateapptivity").as("apptividad_menor");
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
      // Servicio de guardar imagenes declaracion jurada regular
      cy.route("POST", "**/wsgetimages").as("guardarimagenes");
      // Servicio de guardar imagenes declaracion jurada menor de edad
      cy.route("POST", "**/wsmenorgetimages").as("guardarImagenesMenor");
      // Servicio de filtrar paises baneficiarios
      cy.route("POST", "**/wsfiltercountries").as("beneficiariosPaises");
      // Servicio de filtrar relacion beneficiarios
      cy.route("POST", "**/wsfilterrelationship").as("relacionBeneficiarios");
      // Servicio de guardar baneficiarios
      cy.route("POST", "**/wsbeneficiaries").as("guardarBeneficiarios");
      // Servicio de mostrar el contracto
      cy.route("POST", "**/wsgetfullcontract").as("mostrarContracto");
      // Servicio de mostrar el contracto del menor
      cy.route("POST", "**/wsmenorgetfullcontract").as("mostrarContractoMenor");
      // Servicio de aceptarcontracto
      cy.route("POST", "**/wsconfirmanswer").as("aceptarContracto");
      // Servicio de registrar pendiente de aprobacion
      cy.route("POST", "**/wsregisterpending").as("registrarpendiente");
      // Servicio de mostrar el contracto simplificada
      cy.route("POST", "**/wsgetfullcontractsimp").as("mostrarContractosimpl");
      // Servicio de aceptarcontracto
      cy.route("POST", "**/wsupdateprospectsimp").as(
        "actualizarprospectsimpli"
      );
    });

    it("Cuenta Menor de edad", () => {
      cy.fixture("index").then((index) => {
        //Pantalla de INICIO
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();
        //Pantalla de loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaMenorEdad);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaMenorEdad);
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
        cy.wait("@wsconsultparameters", { timeout: 60000 })
          .then((xhr) => {
            expect(xhr.status).to.eq(200);
            expect(xhr.responseBody.HttpResponse.code).to.eq(200);
            expect(
              xhr.responseBody.OnboardingParametersData.data.codesubproduct
            ).to.eq("1240");
            const si_Menor =
              xhr.responseBody.OnboardingParametersData.data.isMenor;
            return si_Menor;
          })
          .as("si_menor");

        cy.get("@token").then((token2) => {
          const decoded = jwt_decode(token2);
          const fase = decoded.phase;
          switch (fase) {
            case "1":
              cy.Preguntas_Regulatorias();
              cy.Ocr_ce(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.InicioMenor(e2e);
              cy.Preguntas_Regulatorias();
              cy.Apptividad();
              cy.Direccion_cm(e2e);
              cy.Declaracion_Jurada_menor(e2e);
              cy.Carga_documentos_menor();

              break;
            case "3":
              cy.get("@si_menor").then((menor) => {
                if (menor == true) {
                  cy.Apptividad();
                  cy.Direccion_cm(e2e);
                  cy.Declaracion_Jurada_menor(e2e);
                  cy.Carga_documentos_menor();
                }else {
                  cy.Ocr_ce(e2e);
                  cy.Apptividad();
                  cy.Biometria();
                  cy.InicioMenor(e2e);
                  cy.Preguntas_Regulatorias();
                  cy.Apptividad();
                  cy.Direccion_cm(e2e);
                  cy.Declaracion_Jurada_menor(e2e);
                  cy.Carga_documentos_menor();
                }
              });
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.InicioMenor(e2e);
              cy.Preguntas_Regulatorias();
              cy.Apptividad();
              cy.Direccion_cm(e2e);
              cy.Declaracion_Jurada_menor(e2e);
              cy.Carga_documentos_menor();
            case "4":
              cy.get("@si_menor").then((menor) => {
                if (menor == true) {
                  cy.Direccion_cm(e2e);
                  cy.Declaracion_Jurada_menor(e2e);
                  cy.Carga_documentos_menor();
                } else {
                  cy.Biometria();
                  cy.InicioMenor(e2e);
                  cy.Preguntas_Regulatorias();
                  cy.Apptividad();
                  cy.Direccion_cm(e2e);
                  cy.Declaracion_Jurada_menor(e2e);
                  cy.Carga_documentos_menor();
                }
              });
              break;
            case "5":
              cy.InicioMenor(e2e);
              cy.Preguntas_Regulatorias();
              cy.Apptividad();
              cy.Direccion_cm(e2e);
              cy.Declaracion_Jurada_menor(e2e);
              cy.Carga_documentos_menor();
              break;
            case "6":
              cy.Direccion_cm();
              cy.Declaracion_Jurada_menor(e2e);
              cy.Carga_documentos_menor();
              break;
            case "7":
              cy.Declaracion_Jurada_menor(e2e);
              cy.Carga_documentos_menor();
              break;
            case "7.1":
              cy.Carga_documentos_menor();
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta simplificada", () => {
      cy.fixture("index").then((index) => {
        // INICIO
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();
        // LOGUIN
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaSimplificada);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtasimplificada);
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
          ).to.eq("CUENTA DE AHORRO SIMPLIFICADA");
        });
        cy.get("@token").then((token2) => {
          const decoded = jwt_decode(token2);
          const fase = decoded.phase;
          switch (fase) {
            case "1":
              cy.Preguntas_Regulatorias();
              cy.Ocr_simplificada(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD_Simplificada();
              cy.Declaracion_Jurada_simplificada(e2e);
            case "3":
              cy.Ocr_simplificada(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD_Simplificada();
              cy.Declaracion_Jurada_simplificada(e2e);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD_Simplificada();
              cy.Declaracion_Jurada_simplificada(e2e);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD_Simplificada();
              cy.Declaracion_Jurada_simplificada(e2e);
              break;
            case "5":
              cy.Direccion_cn(e2e);
              cy.TDD_Simplificada();
              cy.Declaracion_Jurada_simplificada(e2e);
              break;
            case "6":
              cy.TDD_Simplificada();
              cy.Declaracion_Jurada_simplificada(e2e);
              break;
            case "7":
              cy.Declaracion_Jurada_simplificada(e2e);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Ahorro FATCA - CRS - PEP - FAMPEP", () => {
      cy.fixture("index").then((index) => {
        cy.screenshot("E2E/main.png");
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        //Pantalla de loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaAhorro);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaAhorro);
        cy.screenshot("E2E/loguin.png");
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
              cy.Preguntas_Regulatorias_si();
              cy.FATCA();
              cy.CRS();
              cy.PEP();
              cy.FAMPEP();
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "1.1":
              cy.FATCA();
              cy.CRS();
              cy.PEP();
              cy.FAMPEP();
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "1.2":
              cy.CRS();
              cy.PEP();
              cy.FAMPEP();
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "1.3":
              cy.PEP();
              cy.FAMPEP();
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "1.4":
              cy.FAMPEP();
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3":
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "5":
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7":
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7.1":
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "8":
              cy.Beneficiarios(e2e);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Ahorro", () => {
      cy.fixture("index").then((index) => {
        cy.screenshot("E2E/main.png");
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        //Pantalla de loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaAhorro);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaAhorro);
        cy.screenshot("E2E/loguin.png");
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
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3":
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "5":
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7":
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7.1":
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "8":
              cy.Beneficiarios(e2e);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Multipanama", () => {
      cy.fixture("index").then((index) => {
        // INICIO
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
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3":
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "5":
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7":
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7.1":
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "8":
              cy.Beneficiarios(e2e);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Corriente", () => {
      cy.fixture("index").then((index) => {
        // Inicio
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
          ).to.eq("CUENTA DE AHORRO CORRIENTE");
        });
        cy.get("@token").then((token2) => {
          const decoded = jwt_decode(token2);
          const fase = decoded.phase;
          switch (fase) {
            case "1":
              cy.Preguntas_Regulatorias();
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3":
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "5":
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7":
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7.1":
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "8":
              cy.Beneficiarios(e2e);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Euros", () => {
      cy.fixture("index").then((index) => {
        //Pantalla de INICIO
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();
        //Pantalla de loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaEuro);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaEuro);
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
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3":
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "4":
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "5":
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7":
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "7.1":
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos();
              cy.Beneficiarios(e2e);
              break;
            case "8":
              cy.Beneficiarios(e2e);
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Multititular Principal", () => {
      cy.fixture("index").then((index) => {
        // INICIO
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
        });
        cy.wait("@wsconsultparameters", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingParametersData.data.documenttyped
          ).to.eq("CUENTA DE AHORRO MULTI TITULAR");
        });

        cy.Preguntas_Regulatorias();
        cy.Ocr_cn(e2e);
        cy.Apptividad();
        cy.Biometria();
        cy.Direccion_cn(e2e);
        cy.TDD();
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
        cy.wait("@paisestransferencia", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
        });
        cy.wait("@empleados", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
          ).to.eq(true);
        });
        cy.wait("@perfiltransaccional", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
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
          .type(e2e.declaracion.salario);
        cy.get("[data-test=text-otros-ingresos]")
          .should("be.visible")
          .type(e2e.declaracion.descripcionOtrosIngresos);
        cy.get("[data-test=monto-otros-ingresos]")
          .should("be.visible")
          .type(e2e.declaracion.montoOtrosIngresos);
        cy.get("[data-test=monto_apertura-input]")
          .should("be.visible")
          .type(e2e.declaracion.montoApertura);
        cy.get("[data-test=origen_fondos-select]")
          .should("be.visible")
          .select("FONDOS PROPIOS");
        cy.get("[data-test=estado-civil-select]")
          .should("be.visible")
          .select("SOLTERO(A)");
        cy.get("[data-test=perfil_transaccional-select]")
          .should("be.visible")
          .select("PREFIERO HACER MOVIMIENTOS LOCALES E INTERNACIONALES");
        cy.get("[data-test=generar-contrato-btn]").should("be.visible").click();
        cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
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

        //Carga de documentos
        cy.wait(10000);
        cy.get(".col-lg-9 > .container-fluid > :nth-child(1)").contains(
          "Antes de continuar, necesito que nos proporciones los siguientes datos que completarán la prueba de tus ingresos"
        );
        const CTRABAJO = "ctrabajo.pdf";
        const DRENTA = "drenta.pdf";
        const EFINANCIERO = "efinanciero.pdf";
        const CINGRESOS = "cingresos2.jpg";
        const FIRMA = "firma.jpg";
        cy.get("#file").attachFile(CTRABAJO);
        cy.get("#file").attachFile(DRENTA);
        cy.get("#file").attachFile(EFINANCIERO);
        cy.get("#file").attachFile(CINGRESOS);
        cy.get("#file2").attachFile(FIRMA);
        cy.get('[data-test="generar-contrato-btn"]')
          .should("be.visible")
          .click();
        cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
          expect(
            xhr.responseBody.OnboardingGetImagesData.serviceResponse
          ).to.eq(true);
        });

        //Contracto
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

    it("Cuenta Multititular secundario", () => {
      cy.fixture("index").then((index) => {
        // inicio
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
        });
        cy.wait("@wsconsultparameters", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingParametersData.data.documenttyped
          ).to.eq("CUENTA DE AHORRO MULTI TITULAR");
        });

        cy.Preguntas_Regulatorias();
        cy.Ocr_cn(e2e);
        cy.Apptividad();
        cy.Biometria();
        cy.Direccion_cn(e2e);
        cy.TDD();
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
        cy.wait("@paisestransferencia", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
        });
        cy.wait("@empleados", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
          ).to.eq(true);
        });
        cy.wait("@perfiltransaccional", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
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
          .type(e2e.declaracion.salario);
        cy.get("[data-test=text-otros-ingresos]")
          .should("be.visible")
          .type(e2e.declaracion.descripcionOtrosIngresos);
        cy.get("[data-test=monto-otros-ingresos]")
          .should("be.visible")
          .type(e2e.declaracion.montoOtrosIngresos);
        cy.get("[data-test=monto_apertura-input]")
          .should("be.visible")
          .type(e2e.declaracion.montoApertura);
        cy.get("[data-test=origen_fondos-select]")
          .should("be.visible")
          .select("FONDOS PROPIOS");
        cy.get("[data-test=estado-civil-select]")
          .should("be.visible")
          .select("SOLTERO(A)");
        cy.get("[data-test=generar-contrato-btn]").should("be.visible").click();
        cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
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

        //Carga de documentos
        cy.wait(10000);
        cy.get(".col-lg-9 > .container-fluid > :nth-child(1)").contains(
          "Antes de continuar, necesito que nos proporciones los siguientes datos que completarán la prueba de tus ingresos"
        );
        const CTRABAJO = "ctrabajo.pdf";
        const DRENTA = "drenta.pdf";
        const EFINANCIERO = "efinanciero.pdf";
        const CINGRESOS = "cingresos2.jpg";
        const FIRMA = "firma.jpg";
        cy.get("#file").attachFile(CTRABAJO);
        cy.get("#file").attachFile(DRENTA);
        cy.get("#file").attachFile(EFINANCIERO);
        cy.get("#file").attachFile(CINGRESOS);
        cy.get("#file2").attachFile(FIRMA);
        cy.get('[data-test="generar-contrato-btn"]')
          .should("be.visible")
          .click();
        cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
          expect(
            xhr.responseBody.OnboardingGetImagesData.serviceResponse
          ).to.eq(true);
        });

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
        cy.screenshot("BENEFICIARIOS/contracto_multitular_secundario.png");
      });
    });
  });
}
