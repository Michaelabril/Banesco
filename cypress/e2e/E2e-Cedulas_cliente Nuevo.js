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

    it("Cuenta Ahorro multitular secundario", () => {
      cy.fixture("index").then((index) => {
        cy.screenshot("E2E/main.png");
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        //Pantalla de loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaMultititular1);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaMultititular01);
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
              cy.Declaracion_Jurada_multititular_secundario(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "3":
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada_multititular_secundario(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada_multititular_secundario(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "4":
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada_multititular_secundario(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "5":
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada_multititular_secundario(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada_multititular_secundario(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "7":
              cy.Declaracion_Jurada_multititular_secundario(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "7.1":
              cy.Carga_documentos_multititular();
              break;
            default:
              cy.log("No se encuentra la fase");
              break;
          }
        });
      });
    });

    it("Cuenta Ahorro multitular principal", () => {
      cy.fixture("index").then((index) => {
        cy.screenshot("E2E/main.png");
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        //Pantalla de loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaMultititular0);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaMultititular00);
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
              cy.Carga_documentos_multititular();
              break;
            case "3":
              cy.Ocr_cn(e2e);
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "3.1":
              cy.Apptividad();
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "4":
              cy.Biometria();
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "5":
              cy.Direccion_cn(e2e);
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "6":
              cy.TDD();
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "7":
              cy.Declaracion_Jurada(e2e);
              cy.Carga_documentos_multititular();
              break;
            case "7.1":
              cy.Carga_documentos_multititular();
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
          .type(e2e.datosUsuario.emailfatcaPep);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codefatcaPep);
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

  });
}
