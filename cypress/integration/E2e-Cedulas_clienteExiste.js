export function FLUJOSCOMPLETOS(e2e) {
  describe("APERTURA DE CUENTAS - PORTAL CLIENTE", () => {
    //let secretCode;
    beforeEach(() => {
      cy.visit("/");
      cy.exec("npm cache clear --force");
      cy.wait(5000);
      cy.server();
      //Servicio al insertar email
      cy.route("POST", "**/wscreatesessionbyemail").as("Sessionid");
      //Servicio al insertar codigo de sesion
      cy.route("POST", "**/wsvalidatecodesession").as("ValidateSessionId");
      cy.route('POST', '**/wsconsultparameters').as('wsconsultparameters');
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
      cy.route("POST", "**/wsfiltercountriestransfer").as("paisestransferencia");
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
      // Servicio de fmostrar el contracto
      cy.route("POST", "**/wsgetfullcontract").as("mostrarContracto");
      // Servicio de aceptarcontracto
      cy.route("POST", "**/wsconfirmanswer").as("aceptarContracto");
      // Servicio de registrar pendiente de aprobacion
      cy.route("POST", "**/wsregisterpending").as("registrarpendiente");
      // Servicio de mostrar el contracto simplificada
      cy.route("POST", "**/wsgetfullcontractsimp").as("mostrarContractosimpl");
      // Servicio de aceptarcontracto
      cy.route("POST", "**/wsupdateprospectsimp").as("actualizarprospectsimpli");
    }); //Cierre del beforeEach
    

    /*it("Borrar la data", () => {
      //ws de limpieza en data por email
      cy.request("POST", Cypress.env("baseUrlBack") + "wsdatacleaner", {
        email: userCase.datosUsuario.email,
      }).then((response) => {
        cy.log(JSON.stringify(response.body));
        expect(response.body.HttpResponse.code).to.eq(200);
      }); //cierre de wsdatacleaner
    });*/
    
    
    it("Cuenta Ahorro - Cliente existe", () => {
      cy.fixture("index").then((index) => {
        cy.wait(10000);
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
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
          expect(xhr.responseBody.OnboardingEmailData.clientExist).to.eq(true);
          expect(xhr.responseBody.OnboardingEmailData.serviceResponse).to.eq(true);
        });
        cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO'); 
      });
  
      // Pantalla de plantilla
        cy.wait(10000);
        cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();

        //Pantalla de preguntas regulatorias
        cy.wait(10000);
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingFatcaData.serviceResponse).to.eq(true);
        });

        //Pantalla de captura identificacion cedula
        cy.wait(20000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });

        // Pantalla de Datos generales
        cy.wait(10000);
        cy.get(":nth-child(1) > .form-control").clear();
        cy.get(":nth-child(2) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').clear();
        cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
        cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
        cy.get(":nth-child(10) > .form-control").clear();
        cy.get(":nth-child(1) > .form-control").click();
        cy.get(":nth-child(1) > .form-control").type(
          e2e.datosUsuario.nombres
        );
        cy.get(":nth-child(2) > .form-control").type(
          e2e.datosUsuario.apellidos
        );
        cy.get('input[formcontrolname="FechaNacimiento"]').type(
          e2e.datosUsuario.fechaNacimiento
        );
        cy.get(":nth-child(4) > .form-control").select("Masculino");
        cy.get('input[formcontrolname="Fecha_expedicion"]').type(
          e2e.datosUsuario.fechaexpedicion
        );
        cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
          e2e.datosUsuario.fechaVencimiento
        );
        cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
        cy.get(":nth-child(10) > .form-control").type(
          e2e.datosUsuario.numeroRif
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
        // Pantalla de APPTIVIDAD
        cy.wait(10000);
        cy.get("[data-test=apptividad-acepto-btn]").click();
        cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
          expect(xhr.responseBody.OnboardingApptivityData.serviceResponse).to.eq(true);
        });

        // Biometria
        cy.wait(10000);
        cy.get('p[class="titleTutorialCedulaICB"]')
          .eq(1)
          .should("have.text", "T??mate una selfie, tal y como lo ves");
        cy.get("[data-test=iniciar-captura-unificado]").click({
          timeout: 6000,
        });
        cy.wait(90000);
        cy.get("[data-test=siguiente-biometria-unificado]").click();
        cy.wait("@biometria", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnBoardingBiometricData.serviceResponse
          ).to.eq(true);
        });

        //Direccion
        cy.wait(10000);
        cy.get('p[class="subtitleTuDireccion"]').should(
          "have.text",
          " Ahora necesitamos tu tel??fono celular y tus datos residenciales: "
        );
        //cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
        cy.get("[data-test=distrito-select]")
          .should("be.visible")
          .select("MIRANDA");
        cy.get("[data-test=corregimiento-select]")
          .should("be.visible")
          .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
        cy.get("[data-test=barriada-input]")
          .should("be.visible")
          .type(e2e.direccion.urbanizacion);
        cy.get("[data-test=Calle-input]")
          .should("be.visible")
          .type(e2e.direccion.calle);
        cy.get(":nth-child(1) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.edificio);
        cy.get(":nth-child(2) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.casa);
        cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoResidencial);
        cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoCelular);
       /* cy.get(".col-md-12 > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.puntoReferencia);*/ 
        cy.get("[data-test=siguiente-direccion-btn]")
          .should("be.visible")
          .click();
        cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingSaveAddressData.serviceResponse
          ).to.eq(true);
        });

        //TDD
        cy.wait(10000);
        cy.wait("@seguro", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_code
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 10,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_code
          ).to.eq("06");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 5,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
          ).to.eq(true);
        });
        cy.wait("@tdd", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_code_emi
          ).to.eq("05");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_name
          ).to.eq("DEBITO MASTERCARD STANDARD (CLASICA) INTERNACIONAL");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_code_emi
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_name
          ).to.eq("PLATINUM DEBITO BANCA INTERNACIONAL");
        
        });
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
        // Pantalla de DECLARACION JURADA
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
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
          expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
          expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
        });
        //Carga de documentos
        cy.wait(10000);
        cy.get('.col-lg-9 > .container-fluid > :nth-child(1)').contains('Antes de continuar, necesito que nos proporciones los siguientes datos que completar??n la prueba de tus ingresos')
        const CTRABAJO = "ctrabajo.pdf";
        const DRENTA = "drenta.pdf";
        const EFINANCIERO = "efinanciero.pdf";
        const CINGRESOS = "cingresos2.jpg";
        const FIRMA = 'firma.jpg';
        cy.get('#file').attachFile(CTRABAJO)
        cy.get('#file').attachFile(DRENTA)
        cy.get('#file').attachFile(EFINANCIERO)
        cy.get('#file').attachFile(CINGRESOS)
        cy.get('#file2').attachFile(FIRMA)
        cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click()
        cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
          expect(xhr.responseBody.OnboardingGetImagesData.serviceResponse).to.eq(true);
        });
        //Beneficiarios
        cy.wait(10000)
        cy.get('.pb-0').contains('Queremos resguardar tus intereses. En caso de que te ausentes, com??ntanos a qui??n dejar??as estos fondos ')
        cy.wait("@beneficiariosPaises", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProvinceMessage.code).to.eq(200);
          expect(xhr.responseBody.OnboardingProvinceMessage.message).to.eq("Ok");
        });
        cy.wait("@relacionBeneficiarios", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingFilterRelationshipData.ServiceResponse).to.eq(true);
        });
        cy.get('[data-test=PrimerNombre-input]').should("be.visible").type(e2e.beneficiariosData.Bnombres,'{enter}')
        cy.get('[data-test=PrimerApellido-input]').should("be.visible").type(e2e.beneficiariosData.Bapellidos)
        cy.get('[data-test=FechaNacimiento-input]').type(e2e.beneficiariosData.BfechaNacimiento)
        cy.get('[data-test=Nacionalidad-select]').should("be.visible").select('COLOMBIA')
        cy.get('[data-test=Parentezco-select]').should("be.visible").select('MADRE')
        //cy.get('[data-test=Porcentage-input]').should("be.visible").type('{esc}')
        cy.get('[data-test=Identificacion-input]').should("be.visible").type(e2e.beneficiariosData.Bidentificacion)
        cy.get(':nth-child(8) > .form-group > [data-test=Telefono-input]').should("be.visible").type(e2e.beneficiariosData.Btelefono)
        cy.get('[data-test=Correo-input]').should("be.visible").type(e2e.beneficiariosData.Bemail)
        cy.get('b').should("be.visible").click()
        cy.wait(3000)
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait(1000)
        cy.wait("@guardarBeneficiarios", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingBeneficiariesData.serviceResponse).to.eq(true);
        });
        cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000)
        cy.get('[data-test=acepto-contrato]').click()
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(true);
        });
        cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingRegisterPendingData.serviceResponse).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contracto.png");
       });
    });

    it("Cuenta Euros", () => {
      cy.fixture("index").then((index) => {
        //Pantalla de INICIO
        cy.wait(10000);
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
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
        });
        cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO EN EUROS'); 
      });
        //Pantalla de TEMPLATE DE PRODUCTO
        //cy.wait(10000);
        //cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();
        //Pantalla de PREGUNTAS REGULATORIAS
        cy.wait(10000);
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        });
        ///Pantalla de ocr
        cy.wait(20000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });
        /*
        //Pantalla de Datos genereales
        cy.wait(10000);
        cy.get(":nth-child(1) > .form-control").clear();
        cy.get(":nth-child(2) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').clear();
        cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
        cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
        cy.get(":nth-child(10) > .form-control").clear();
        cy.get(":nth-child(1) > .form-control").click();
        cy.get(":nth-child(1) > .form-control").type(
          e2e.datosUsuario.nombres
        );
        cy.get(":nth-child(2) > .form-control").type(
          e2e.datosUsuario.apellidos
        );
        cy.get('input[formcontrolname="FechaNacimiento"]').type(
          e2e.datosUsuario.fechaNacimiento
        );
        cy.get(":nth-child(4) > .form-control").select("Masculino");
        cy.get('input[formcontrolname="Fecha_expedicion"]').type(
          e2e.datosUsuario.fechaexpedicion
        );
        cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
          e2e.datosUsuario.fechaVencimiento
        );
        cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
        cy.get(":nth-child(10) > .form-control").type(
          e2e.datosUsuario.numeroRif
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
        */
        //Pantalla de APPTIVIDAD
        cy.wait(10000);
        cy.get("[data-test=apptividad-acepto-btn]").click();
        cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnboardingApptivityData.serviceResponse
          ).to.eq(true);
        });

        //Pantalla de BIOMETRIA
        cy.wait(10000);
        cy.get('p[class="titleTutorialCedulaICB"]')
          .eq(1)
          .should("have.text", "T??mate una selfie, tal y como lo ves");
        cy.get("[data-test=iniciar-captura-unificado]").click({
          timeout: 6000,
        });
        cy.wait(90000);
        cy.get("[data-test=siguiente-biometria-unificado]").click();
        cy.wait("@biometria", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnBoardingBiometricData.serviceResponse
          ).to.eq(true);
        });

        //Direccion
        cy.wait(10000);
        cy.get('p[class="subtitleTuDireccion"]').should(
          "have.text",
          " Ahora necesitamos tu tel??fono celular y tus datos residenciales: "
        );
        //cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
        cy.get("[data-test=distrito-select]")
          .should("be.visible")
          .select("MIRANDA");
        cy.get("[data-test=corregimiento-select]")
          .should("be.visible")
          .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
        cy.get("[data-test=barriada-input]")
          .should("be.visible")
          .type(e2e.direccion.urbanizacion);
        cy.get("[data-test=Calle-input]")
          .should("be.visible")
          .type(e2e.direccion.calle);
        cy.get(":nth-child(1) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.edificio);
        cy.get(":nth-child(2) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.casa);
        cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoResidencial);
        /*cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoCelular);*/
        cy.get(".col-md-12 > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.puntoReferencia);
        cy.get("[data-test=siguiente-direccion-btn]")
          .should("be.visible")
          .click();
        cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingSaveAddressData.serviceResponse
          ).to.eq(true);
        });

        //TDD
        cy.wait(10000);
        cy.wait("@seguro", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_code
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 10,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_code
          ).to.eq("06");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 5,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
          ).to.eq(true);
        });
        cy.wait("@tdd", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_code_emi
          ).to.eq("05");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_name
          ).to.eq("DEBITO MASTERCARD STANDARD (CLASICA) INTERNACIONAL");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_code_emi
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_name
          ).to.eq("PLATINUM DEBITO BANCA INTERNACIONAL");
        
        });
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
          //Pantalla de DECLARACION JURADA 
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
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
          expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
          expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
        });

        //Carga de documentos
        cy.wait(10000);
        cy.get('.col-lg-9 > .container-fluid > :nth-child(1)').contains('Antes de continuar, necesito que nos proporciones los siguientes datos que completar??n la prueba de tus ingresos')
        const CTRABAJO = "ctrabajo.pdf";
        const DRENTA = "drenta.pdf";
        const EFINANCIERO = "efinanciero.pdf";
        const CINGRESOS = "cingresos2.jpg";
        const FIRMA = 'firma.jpg';
        cy.get('#file').attachFile(CTRABAJO)
        cy.get('#file').attachFile(DRENTA)
        cy.get('#file').attachFile(EFINANCIERO)
        cy.get('#file').attachFile(CINGRESOS)
        cy.get('#file2').attachFile(FIRMA)
        cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click()
        cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
          expect(xhr.responseBody.OnboardingGetImagesData.serviceResponse).to.eq(true);
        });

        //Beneficiarios
        cy.wait(10000);
        cy.get('.pb-0').contains('Queremos resguardar tus intereses. En caso de que te ausentes, com??ntanos a qui??n dejar??as estos fondos ')
        cy.wait("@beneficiariosPaises", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProvinceMessage.code).to.eq(200);
          expect(xhr.responseBody.OnboardingProvinceMessage.message).to.eq("Ok");
        });
        cy.wait("@relacionBeneficiarios", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingFilterRelationshipData.ServiceResponse).to.eq(true);
        });
        cy.get('[data-test=PrimerNombre-input]').should("be.visible").type(e2e.beneficiariosData.Bnombres,'{enter}')
        cy.get('[data-test=PrimerApellido-input]').should("be.visible").type(e2e.beneficiariosData.Bapellidos)
        cy.get('[data-test=FechaNacimiento-input]').type(e2e.beneficiariosData.BfechaNacimiento)
        cy.get('[data-test=Nacionalidad-select]').should("be.visible").select('COLOMBIA')
        cy.get('[data-test=Parentezco-select]').should("be.visible").select('MADRE')
        //cy.get('[data-test=Porcentage-input]').should("be.visible").type('{esc}')
        cy.get('[data-test=Identificacion-input]').should("be.visible").type(e2e.beneficiariosData.Bidentificacion)
        cy.get(':nth-child(8) > .form-group > [data-test=Telefono-input]').should("be.visible").type(e2e.beneficiariosData.Btelefono)
        cy.get('[data-test=Correo-input]').should("be.visible").type(e2e.beneficiariosData.Bemail)
        cy.get('b').should("be.visible").click()
        cy.wait(3000)
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait(1000)
        cy.wait("@guardarBeneficiarios", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingBeneficiariesData.serviceResponse).to.eq(true);
        });
        cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000)
        cy.get('[data-test=acepto-contrato]').click()
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(true);
        });
        cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingRegisterPendingData.serviceResponse).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contracto.png");
       });
    });

    it("Cuenta Corriente", () => {
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
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
          expect(xhr.responseBody.OnboardingEmailData.clientExist).to.eq(true);
        });
        cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA CORRIENTE'); 
      });
        // Caracteristicas de producto
        cy.wait(10000);
        cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();

        //Preguntas regulatorias
        cy.wait(10000);
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        });

        //Ocr
        cy.wait(20000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });
/*
        //Datos Generales
        cy.wait(10000);
        cy.get(":nth-child(1) > .form-control").clear();
        cy.get(":nth-child(2) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').clear();
        cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
        cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
        cy.get(":nth-child(10) > .form-control").clear();
        cy.get(":nth-child(1) > .form-control").click();
        cy.get(":nth-child(1) > .form-control").type(
          e2e.datosUsuario.nombres
        );
        cy.get(":nth-child(2) > .form-control").type(
          e2e.datosUsuario.apellidos
        );
        cy.get('input[formcontrolname="FechaNacimiento"]').type(
          e2e.datosUsuario.fechaNacimiento
        );
        cy.get(":nth-child(4) > .form-control").select("Masculino");
        cy.get('input[formcontrolname="Fecha_expedicion"]').type(
          e2e.datosUsuario.fechaexpedicion
        );
        cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
          e2e.datosUsuario.fechaVencimiento
        );
        cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
        cy.get(":nth-child(10) > .form-control").type(
          e2e.datosUsuario.numeroRif
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
*/
        //APPTIVIDAD
        cy.wait(10000);
        cy.get("[data-test=apptividad-acepto-btn]").click();
        cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnboardingApptivityData.serviceResponse
          ).to.eq(true);
        });

        // Biometria
        cy.wait(10000);
        cy.get('p[class="titleTutorialCedulaICB"]')
          .eq(1)
          .should("have.text", "T??mate una selfie, tal y como lo ves");
        cy.get("[data-test=iniciar-captura-unificado]").click({
          timeout: 6000,
        });
        cy.wait(90000);
        cy.get("[data-test=siguiente-biometria-unificado]").click();
        cy.wait("@biometria", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnBoardingBiometricData.serviceResponse
          ).to.eq(true);
        });

        //Direccion
        cy.wait(10000);
        cy.get('p[class="subtitleTuDireccion"]').should(
          "have.text",
          " Ahora necesitamos tu tel??fono celular y tus datos residenciales: "
        );
        //cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
        cy.get("[data-test=distrito-select]")
          .should("be.visible")
          .select("MIRANDA");
        cy.get("[data-test=corregimiento-select]")
          .should("be.visible")
          .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
        cy.get("[data-test=barriada-input]")
          .should("be.visible")
          .type(e2e.direccion.urbanizacion);
        cy.get("[data-test=Calle-input]")
          .should("be.visible")
          .type(e2e.direccion.calle);
        cy.get(":nth-child(1) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.edificio);
        cy.get(":nth-child(2) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.casa);
        cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoResidencial);
        /*cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoCelular);*/
        cy.get(".col-md-12 > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.puntoReferencia);
        cy.get("[data-test=siguiente-direccion-btn]")
          .should("be.visible")
          .click();
        cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingSaveAddressData.serviceResponse
          ).to.eq(true);
        });

        //TDD
        cy.wait(10000);
        cy.wait("@seguro", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_code
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 10,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_code
          ).to.eq("06");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 5,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
          ).to.eq(true);
        });
        cy.wait("@tdd", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_code_emi
          ).to.eq("05");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_name
          ).to.eq("DEBITO MASTERCARD STANDARD (CLASICA) INTERNACIONAL");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_code_emi
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_name
          ).to.eq("PLATINUM DEBITO BANCA INTERNACIONAL");
        
        });
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

          //DECLARACION JURADA
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
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
          expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
          expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
        });

        //Carga de documentos
        cy.wait(10000);
        cy.get('.col-lg-9 > .container-fluid > :nth-child(1)').contains('Antes de continuar, necesito que nos proporciones los siguientes datos que completar??n la prueba de tus ingresos')
        const CTRABAJO = "ctrabajo.pdf";
        const DRENTA = "drenta.pdf";
        const EFINANCIERO = "efinanciero.pdf";
        const CINGRESOS = "cingresos2.jpg";
        const FIRMA = 'firma.jpg';
        cy.get('#file').attachFile(CTRABAJO)
        cy.get('#file').attachFile(DRENTA)
        cy.get('#file').attachFile(EFINANCIERO)
        cy.get('#file').attachFile(CINGRESOS)
        cy.get('#file2').attachFile(FIRMA)
        cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click()
        cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
          expect(xhr.responseBody.OnboardingGetImagesData.serviceResponse).to.eq(true);
        });

        //Beneficiarios
        cy.wait(10000);
        cy.get('.pb-0').contains('Queremos resguardar tus intereses. En caso de que te ausentes, com??ntanos a qui??n dejar??as estos fondos ')
        cy.wait("@beneficiariosPaises", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProvinceMessage.code).to.eq(200);
          expect(xhr.responseBody.OnboardingProvinceMessage.message).to.eq("Ok");
        });
        cy.wait("@relacionBeneficiarios", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingFilterRelationshipData.ServiceResponse).to.eq(true);
        });
        cy.get('[data-test=PrimerNombre-input]').should("be.visible").type(e2e.beneficiariosData.Bnombres,'{enter}')
        cy.get('[data-test=PrimerApellido-input]').should("be.visible").type(e2e.beneficiariosData.Bapellidos)
        cy.get('[data-test=FechaNacimiento-input]').type(e2e.beneficiariosData.BfechaNacimiento)
        cy.get('[data-test=Nacionalidad-select]').should("be.visible").select('COLOMBIA')
        cy.get('[data-test=Parentezco-select]').should("be.visible").select('MADRE')
        //cy.get('[data-test=Porcentage-input]').should("be.visible").type('{esc}')
        cy.get('[data-test=Identificacion-input]').should("be.visible").type(e2e.beneficiariosData.Bidentificacion)
        cy.get(':nth-child(8) > .form-group > [data-test=Telefono-input]').should("be.visible").type(e2e.beneficiariosData.Btelefono)
        cy.get('[data-test=Correo-input]').should("be.visible").type(e2e.beneficiariosData.Bemail)
        cy.get('b').should("be.visible").click()
        cy.wait(3000)
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait(1000)
        cy.wait("@guardarBeneficiarios", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingBeneficiariesData.serviceResponse).to.eq(true);
        });
        cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000)
        cy.get('[data-test=acepto-contrato]').click()
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(true);
        });
        cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingRegisterPendingData.serviceResponse).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contracto.png");
       });
    });

    it("Cuenta Multipanama", () => {
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
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
          expect(xhr.responseBody.OnboardingEmailData.clientExist).to.eq(true);
        });
        cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO MULTIPANAMA'); 
      });

        //  CARACTERISTICAS DE PRODUCTO
        cy.wait(10000);
        cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();
      
        // PREGUNTAS REGULATORIAS
        cy.wait(10000);
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        });

        // OCR
        cy.wait(20000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });
        /*
        // DATOS GENERALES
        cy.wait(10000);
        cy.get(":nth-child(1) > .form-control").clear();
        cy.get(":nth-child(2) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').clear();
        cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
        cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
        cy.get(":nth-child(10) > .form-control").clear();
        cy.get(":nth-child(1) > .form-control").click();
        cy.get(":nth-child(1) > .form-control").type(
          e2e.datosUsuario.nombres
        );
        cy.get(":nth-child(2) > .form-control").type(
          e2e.datosUsuario.apellidos
        );
        cy.get('input[formcontrolname="FechaNacimiento"]').type(
          e2e.datosUsuario.fechaNacimiento
        );
        cy.get(":nth-child(4) > .form-control").select("Masculino");
        cy.get('input[formcontrolname="Fecha_expedicion"]').type(
          e2e.datosUsuario.fechaexpedicion
        );
        cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
          e2e.datosUsuario.fechaVencimiento
        );
        cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
        cy.get(":nth-child(10) > .form-control").type(
          e2e.datosUsuario.numeroRif
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
        */
        // APPTIVIDAD
        cy.wait(10000);
        cy.get("[data-test=apptividad-acepto-btn]").click();
        cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnboardingApptivityData.serviceResponse
          ).to.eq(true);
        });

        // Biometria
        cy.wait(10000);
        cy.get('p[class="titleTutorialCedulaICB"]')
          .eq(1)
          .should("have.text", "T??mate una selfie, tal y como lo ves");
        cy.get("[data-test=iniciar-captura-unificado]").click({
          timeout: 6000,
        });
        cy.wait(90000);
        cy.get("[data-test=siguiente-biometria-unificado]").click();
        cy.wait("@biometria", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnBoardingBiometricData.serviceResponse
          ).to.eq(true);
        });

        //Direccion
        cy.wait(10000);
        cy.get('p[class="subtitleTuDireccion"]').should(
          "have.text",
          " Ahora necesitamos tu tel??fono celular y tus datos residenciales: "
        );
        //cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
        cy.get("[data-test=distrito-select]")
          .should("be.visible")
          .select("MIRANDA");
        cy.get("[data-test=corregimiento-select]")
          .should("be.visible")
          .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
        cy.get("[data-test=barriada-input]")
          .should("be.visible")
          .type(e2e.direccion.urbanizacion);
        cy.get("[data-test=Calle-input]")
          .should("be.visible")
          .type(e2e.direccion.calle);
        cy.get(":nth-child(1) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.edificio);
        cy.get(":nth-child(2) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.casa);
        cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoResidencial);
        /*cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoCelular);*/
        cy.get(".col-md-12 > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.puntoReferencia);
        cy.get("[data-test=siguiente-direccion-btn]")
          .should("be.visible")
          .click();
        cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingSaveAddressData.serviceResponse
          ).to.eq(true);
        });

        //TDD
        cy.wait(10000);
        cy.wait("@seguro", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_code
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 10,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_code
          ).to.eq("06");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 5,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
          ).to.eq(true);
        });
        cy.wait("@tdd", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_code_emi
          ).to.eq("05");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_name
          ).to.eq("DEBITO MASTERCARD STANDARD (CLASICA) INTERNACIONAL");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_code_emi
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_name
          ).to.eq("PLATINUM DEBITO BANCA INTERNACIONAL");
        
        });
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
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
          expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
          expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
        });

        //Carga de documentos
        cy.wait(10000);
        cy.get('.col-lg-9 > .container-fluid > :nth-child(1)').contains('Antes de continuar, necesito que nos proporciones los siguientes datos que completar??n la prueba de tus ingresos')
        const CTRABAJO = "ctrabajo.pdf";
        const DRENTA = "drenta.pdf";
        const EFINANCIERO = "efinanciero.pdf";
        const CINGRESOS = "cingresos2.jpg";
        const FIRMA = 'firma.jpg';
        cy.get('#file').attachFile(CTRABAJO)
        cy.get('#file').attachFile(DRENTA)
        cy.get('#file').attachFile(EFINANCIERO)
        cy.get('#file').attachFile(CINGRESOS)
        cy.get('#file2').attachFile(FIRMA)
        cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click()
        cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
          expect(xhr.responseBody.OnboardingGetImagesData.serviceResponse).to.eq(true);
        });

        //Beneficiarios
        cy.wait(10000);
        cy.get('.pb-0').contains('Queremos resguardar tus intereses. En caso de que te ausentes, com??ntanos a qui??n dejar??as estos fondos ')
        cy.wait("@beneficiariosPaises", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProvinceMessage.code).to.eq(200);
          expect(xhr.responseBody.OnboardingProvinceMessage.message).to.eq("Ok");
        });
        cy.wait("@relacionBeneficiarios", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingFilterRelationshipData.ServiceResponse).to.eq(true);
        });
        cy.get('[data-test=PrimerNombre-input]').should("be.visible").type(e2e.beneficiariosData.Bnombres,'{enter}')
        cy.get('[data-test=PrimerApellido-input]').should("be.visible").type(e2e.beneficiariosData.Bapellidos)
        cy.get('[data-test=FechaNacimiento-input]').type(e2e.beneficiariosData.BfechaNacimiento)
        cy.get('[data-test=Nacionalidad-select]').should("be.visible").select('COLOMBIA')
        cy.get('[data-test=Parentezco-select]').should("be.visible").select('MADRE')
        //cy.get('[data-test=Porcentage-input]').should("be.visible").type('{esc}')
        cy.get('[data-test=Identificacion-input]').should("be.visible").type(e2e.beneficiariosData.Bidentificacion)
        cy.get(':nth-child(8) > .form-group > [data-test=Telefono-input]').should("be.visible").type(e2e.beneficiariosData.Btelefono)
        cy.get('[data-test=Correo-input]').should("be.visible").type(e2e.beneficiariosData.Bemail)
        cy.get('b').should("be.visible").click()
        cy.wait(3000)
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait(1000)
        cy.wait("@guardarBeneficiarios", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingBeneficiariesData.serviceResponse).to.eq(true);
        });
        cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000)
        cy.get('[data-test=acepto-contrato]').click()
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(true);
        });
        cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingRegisterPendingData.serviceResponse).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contracto.png");
       });
    });

    it("Cuenta Multititular secundario", () => {
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
        cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO MULTI TITULAR'); 
      });

      // CARACTERISTICAS DE PRODUCTO
        cy.wait(10000);
        cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();

        // PREGUNTAS REGULATORIAS
        cy.wait(10000);
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        });

        // OCR
        cy.wait(20000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });
        /*
        // DATOS GENERALES
        cy.wait(10000);
        cy.get(":nth-child(1) > .form-control").clear();
        cy.get(":nth-child(2) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').clear();
        cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
        cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
        cy.get(":nth-child(10) > .form-control").clear();
        cy.get(":nth-child(1) > .form-control").click();
        cy.get(":nth-child(1) > .form-control").type(
          e2e.datosUsuario.nombres
        );
        cy.get(":nth-child(2) > .form-control").type(
          e2e.datosUsuario.apellidos
        );
        cy.get('input[formcontrolname="FechaNacimiento"]').type(
          e2e.datosUsuario.fechaNacimiento
        );
        cy.get(":nth-child(4) > .form-control").select("Masculino");
        cy.get('input[formcontrolname="Fecha_expedicion"]').type(
          e2e.datosUsuario.fechaexpedicion
        );
        cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
          e2e.datosUsuario.fechaVencimiento
        );
        cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
        cy.get(":nth-child(10) > .form-control").type(
          e2e.datosUsuario.numeroRif
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
        */
        // APPTIVIDAD
        cy.wait(10000);
        cy.get("[data-test=apptividad-acepto-btn]").click();
        cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnboardingApptivityData.serviceResponse
          ).to.eq(true);
        });

        // Biometria
        cy.wait(10000);
        cy.get('p[class="titleTutorialCedulaICB"]')
          .eq(1)
          .should("have.text", "T??mate una selfie, tal y como lo ves");
        cy.get("[data-test=iniciar-captura-unificado]").click({
          timeout: 6000,
        });
        cy.wait(90000);
        cy.get("[data-test=siguiente-biometria-unificado]").click();
        cy.wait("@biometria", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnBoardingBiometricData.serviceResponse
          ).to.eq(true);
        });

        //Direccion
        cy.wait(10000);
        cy.get('p[class="subtitleTuDireccion"]').should(
          "have.text",
          " Ahora necesitamos tu tel??fono celular y tus datos residenciales: "
        );
        cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
        cy.get("[data-test=distrito-select]")
          .should("be.visible")
          .select("MIRANDA");
        cy.get("[data-test=corregimiento-select]")
          .should("be.visible")
          .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
        cy.get("[data-test=barriada-input]")
          .should("be.visible")
          .type(e2e.direccion.urbanizacion);
        cy.get("[data-test=Calle-input]")
          .should("be.visible")
          .type(e2e.direccion.calle);
        cy.get(":nth-child(1) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.edificio);
        cy.get(":nth-child(2) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.casa);
        cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoResidencial);
        /*cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoCelular);*/
        cy.get(".col-md-12 > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.puntoReferencia);
        cy.get("[data-test=siguiente-direccion-btn]")
          .should("be.visible")
          .click();
        cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingSaveAddressData.serviceResponse
          ).to.eq(true);
        });

        //TDD
        cy.wait(10000);
        cy.wait("@seguro", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_code
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 10,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_code
          ).to.eq("06");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 5,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
          ).to.eq(true);
        });
        cy.wait("@tdd", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_code_emi
          ).to.eq("05");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_name
          ).to.eq("DEBITO MASTERCARD STANDARD (CLASICA) INTERNACIONAL");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_code_emi
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_name
          ).to.eq("PLATINUM DEBITO BANCA INTERNACIONAL");
        
        });
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
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
          expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
          expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
        });

        //Carga de documentos
        cy.wait(10000);
        cy.get('.col-lg-9 > .container-fluid > :nth-child(1)').contains('Antes de continuar, necesito que nos proporciones los siguientes datos que completar??n la prueba de tus ingresos')
        const CTRABAJO = "ctrabajo.pdf";
        const DRENTA = "drenta.pdf";
        const EFINANCIERO = "efinanciero.pdf";
        const CINGRESOS = "cingresos2.jpg";
        const FIRMA = 'firma.jpg';
        cy.get('#file').attachFile(CTRABAJO)
        cy.get('#file').attachFile(DRENTA)
        cy.get('#file').attachFile(EFINANCIERO)
        cy.get('#file').attachFile(CINGRESOS)
        cy.get('#file2').attachFile(FIRMA)
        cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click()
        cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
          expect(xhr.responseBody.OnboardingGetImagesData.serviceResponse).to.eq(true);
        });

        cy.wait(10000)
        cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000)
        cy.get('[data-test=acepto-contrato]').click()
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(true);
        });
        cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingRegisterPendingData.serviceResponse).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contracto.png");
       });
    });

    it("Cuenta Multititular Principal", () => {
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
        cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO MULTI TITULAR'); 
      });
        
      // CARACTERISTICAS DE PRODUCTOS
        cy.wait(10000);
        cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();

        // PREGUNTAS REGULATORIAS
        cy.wait(10000);
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        });

        // OCR
        cy.wait(20000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });
        /*
        // DATOS GENERALES
        cy.wait(10000);
        cy.get(":nth-child(1) > .form-control").clear();
        cy.get(":nth-child(2) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').clear();
        cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
        cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
        cy.get(":nth-child(10) > .form-control").clear();
        cy.get(":nth-child(1) > .form-control").click();
        cy.get(":nth-child(1) > .form-control").type(
          e2e.datosUsuario.nombres
        );
        cy.get(":nth-child(2) > .form-control").type(
          e2e.datosUsuario.apellidos
        );
        cy.get('input[formcontrolname="FechaNacimiento"]').type(
          e2e.datosUsuario.fechaNacimiento
        );
        cy.get(":nth-child(4) > .form-control").select("Masculino");
        cy.get('input[formcontrolname="Fecha_expedicion"]').type(
          e2e.datosUsuario.fechaexpedicion
        );
        cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
          e2e.datosUsuario.fechaVencimiento
        );
        cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
        cy.get(":nth-child(10) > .form-control").type(
          e2e.datosUsuario.numeroRif
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
        */
        // APPTIVIDAD
        cy.wait(10000);
        cy.get("[data-test=apptividad-acepto-btn]").click();
        cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnboardingApptivityData.serviceResponse
          ).to.eq(true);
        });

        // Biometria
        cy.wait(10000);
        cy.get('p[class="titleTutorialCedulaICB"]')
          .eq(1)
          .should("have.text", "T??mate una selfie, tal y como lo ves");
        cy.get("[data-test=iniciar-captura-unificado]").click({
          timeout: 6000,
        });
        cy.wait(90000);
        cy.get("[data-test=siguiente-biometria-unificado]").click();
        cy.wait("@biometria", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnBoardingBiometricData.serviceResponse
          ).to.eq(true);
        });

        //Direccion
        cy.wait(10000);
        cy.get('p[class="subtitleTuDireccion"]').should(
          "have.text",
          " Ahora necesitamos tu tel??fono celular y tus datos residenciales: "
        );
        //cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
        cy.get("[data-test=distrito-select]")
          .should("be.visible")
          .select("MIRANDA");
        cy.get("[data-test=corregimiento-select]")
          .should("be.visible")
          .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
        cy.get("[data-test=barriada-input]")
          .should("be.visible")
          .type(e2e.direccion.urbanizacion);
        cy.get("[data-test=Calle-input]")
          .should("be.visible")
          .type(e2e.direccion.calle);
        cy.get(":nth-child(1) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.edificio);
        cy.get(":nth-child(2) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.casa);
        cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoResidencial);
        /*cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoCelular);*/
        cy.get(".col-md-12 > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.puntoReferencia);
        cy.get("[data-test=siguiente-direccion-btn]")
          .should("be.visible")
          .click();
        cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingSaveAddressData.serviceResponse
          ).to.eq(true);
        });

        //TDD
        cy.wait(10000);
        cy.wait("@seguro", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_code
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 10,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_code
          ).to.eq("06");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 5,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
          ).to.eq(true);
        });
        cy.wait("@tdd", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_code_emi
          ).to.eq("05");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_name
          ).to.eq("DEBITO MASTERCARD STANDARD (CLASICA) INTERNACIONAL");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_code_emi
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_name
          ).to.eq("PLATINUM DEBITO BANCA INTERNACIONAL");
        
        });
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
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
          expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
          expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
        });

        //Carga de documentos
        cy.wait(10000);
        cy.get('.col-lg-9 > .container-fluid > :nth-child(1)').contains('Antes de continuar, necesito que nos proporciones los siguientes datos que completar??n la prueba de tus ingresos')
        const CTRABAJO = "ctrabajo.pdf";
        const DRENTA = "drenta.pdf";
        const EFINANCIERO = "efinanciero.pdf";
        const CINGRESOS = "cingresos2.jpg";
        const FIRMA = 'firma.jpg';
        cy.get('#file').attachFile(CTRABAJO)
        cy.get('#file').attachFile(DRENTA)
        cy.get('#file').attachFile(EFINANCIERO)
        cy.get('#file').attachFile(CINGRESOS)
        cy.get('#file2').attachFile(FIRMA)
        cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click()
        cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
          expect(xhr.responseBody.OnboardingGetImagesData.serviceResponse).to.eq(true);
        });

        //Contracto      
        cy.wait(100000)
        cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000)
        cy.get('[data-test=acepto-contrato]').click()
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(true);
        });
        cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingRegisterPendingData.serviceResponse).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contracto.png");
       });
    });

    it("Cuenta Multititular secundario", () => {
      cy.fixture("index").then((index) => {

        // inicio
        cy.wait(10000);
        cy.get("[data-test=comencemos_btn]").should("be.visible").click();

        // Loguin
        cy.wait(10000);
        cy.get("[data-test=insertar-correo]").should("be.visible").click();
        cy.get("[data-test=insertar-correo]")
          .should("be.visible")
          .type(e2e.datosUsuario.emailCtaMultititular2);
        cy.get("[data-test=insertar-ccdigo]").should("be.visible").click();
        cy.get("[data-test=insertar-ccdigo]")
          .should("be.visible")
          .type(e2e.datosUsuario.codeCtaMultititular02);
        cy.get('[data-test="enviar-correo-electronico"]').click();
        cy.get('[data-test="es-correcto-email"]').click();
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
          expect(xhr.responseBody.OnboardingEmailData.clientExist).to.eq(true);
        });
        cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO MULTI TITULAR'); 
      });

      // CARACTERISTICAS DE PRODUCTO
        cy.wait(10000);
        cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();

        // PREGUNTAS REGULATORIAS
        cy.wait(10000);
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        });

        // OCR
        cy.wait(20000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });
        /*
        // DATOS GENERALES
        cy.wait(10000);
        cy.get(":nth-child(1) > .form-control").clear();
        cy.get(":nth-child(2) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').clear();
        cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
        cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
        cy.get(":nth-child(10) > .form-control").clear();
        cy.get(":nth-child(1) > .form-control").click();
        cy.get(":nth-child(1) > .form-control").type(
          e2e.datosUsuario.nombres
        );
        cy.get(":nth-child(2) > .form-control").type(
          e2e.datosUsuario.apellidos
        );
        cy.get('input[formcontrolname="FechaNacimiento"]').type(
          e2e.datosUsuario.fechaNacimiento
        );
        cy.get(":nth-child(4) > .form-control").select("Masculino");
        cy.get('input[formcontrolname="Fecha_expedicion"]').type(
          e2e.datosUsuario.fechaexpedicion
        );
        cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
          e2e.datosUsuario.fechaVencimiento
        );
        cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
        cy.get(":nth-child(10) > .form-control").type(
          e2e.datosUsuario.numeroRif
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
        */
        // APPTIVIDAD
        cy.wait(10000);
        cy.get("[data-test=apptividad-acepto-btn]").click();
        cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnboardingApptivityData.serviceResponse
          ).to.eq(true);
        });

        // Biometria
        cy.wait(10000);
        cy.get('p[class="titleTutorialCedulaICB"]')
          .eq(1)
          .should("have.text", "T??mate una selfie, tal y como lo ves");
        cy.get("[data-test=iniciar-captura-unificado]").click({
          timeout: 6000,
        });
        cy.wait(90000);
        cy.get("[data-test=siguiente-biometria-unificado]").click();
        cy.wait("@biometria", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnBoardingBiometricData.serviceResponse
          ).to.eq(true);
        });

        //Direccion
        cy.wait(10000);
        cy.get('p[class="subtitleTuDireccion"]').should(
          "have.text",
          " Ahora necesitamos tu tel??fono celular y tus datos residenciales: "
        );
        cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
        cy.get("[data-test=distrito-select]")
          .should("be.visible")
          .select("MIRANDA");
        cy.get("[data-test=corregimiento-select]")
          .should("be.visible")
          .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
        cy.get("[data-test=barriada-input]")
          .should("be.visible")
          .type(e2e.direccion.urbanizacion);
        cy.get("[data-test=Calle-input]")
          .should("be.visible")
          .type(e2e.direccion.calle);
        cy.get(":nth-child(1) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.edificio);
        cy.get(":nth-child(2) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.casa);
        cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoResidencial);
        /*cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoCelular);*/
        cy.get(".col-md-12 > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.puntoReferencia);
        cy.get("[data-test=siguiente-direccion-btn]")
          .should("be.visible")
          .click();
        cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingSaveAddressData.serviceResponse
          ).to.eq(true);
        });

        //TDD
        cy.wait(10000);
        cy.wait("@seguro", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_code
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[0]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 10,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_code
          ).to.eq("06");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.Data[1]
              .insurance_description
          ).to.eq("PROGRAMA CONTRA ROBO/FRAUDE 5,000.00");
          expect(
            xhr.responseBody.OnboardingConsultInsuranceData.ServiceResponse
          ).to.eq(true);
        });
        cy.wait("@tdd", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_code_emi
          ).to.eq("05");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[0].card_name
          ).to.eq("DEBITO MASTERCARD STANDARD (CLASICA) INTERNACIONAL");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_code_emi
          ).to.eq("03");
          expect(
            xhr.responseBody.OnboardingConsultTddData.Data[1].card_name
          ).to.eq("PLATINUM DEBITO BANCA INTERNACIONAL");
        
        });
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
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()
        cy.wait("@actualizarprospect", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
          expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
          expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
        });

        //Carga de documentos
        cy.wait(10000);
        cy.get('.col-lg-9 > .container-fluid > :nth-child(1)').contains('Antes de continuar, necesito que nos proporciones los siguientes datos que completar??n la prueba de tus ingresos')
        const CTRABAJO = "ctrabajo.pdf";
        const DRENTA = "drenta.pdf";
        const EFINANCIERO = "efinanciero.pdf";
        const CINGRESOS = "cingresos2.jpg";
        const FIRMA = 'firma.jpg';
        cy.get('#file').attachFile(CTRABAJO)
        cy.get('#file').attachFile(DRENTA)
        cy.get('#file').attachFile(EFINANCIERO)
        cy.get('#file').attachFile(CINGRESOS)
        cy.get('#file2').attachFile(FIRMA)
        cy.get('[data-test="generar-contrato-btn"]').should("be.visible").click()
        cy.wait("@guardarimagenes", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("OK");
          expect(xhr.responseBody.OnboardingGetImagesData.serviceResponse).to.eq(true);
        });

        cy.wait(10000)
        cy.wait("@mostrarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000)
        cy.get('[data-test=acepto-contrato]').click()
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(true);
        });
        cy.wait("@registrarpendiente", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingRegisterPendingData.serviceResponse).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contracto.png");
       });
    });

    it("Cuenta simplificada", () => {
      cy.fixture("index").then((index) => {
        // INICIO
        cy.wait(10000);
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
        cy.wait("@Sessionid", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingEmailData.code).to.eq("Ok");
          //expect(xhr.responseBody.OnboardingEmailData.clientExist).to.eq(true);
        });
        cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORROS SIMPLIFICADA'); 
        });
        
        // CARACTERISTICAS DE PRODUCTO
        cy.wait(10000);
        //cy.get("[data-test=quiero-mi-cuenta-btn]").should("be.visible").click();

        // PREGUNTAS REGULATORIAS
        cy.wait(10000);
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();
        cy.wait("@FatcaPep", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        });

        // OCR
        cy.wait(20000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();
        cy.wait("@Ocr", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingOcrData.code).to.eq("OK");
        });
        
        // DATOS GENERALES
        cy.wait(10000);
        //cy.get(":nth-child(1) > .form-control").clear();
        //cy.get(":nth-child(2) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').clear();
        cy.get('input[formcontrolname="Fecha_expedicion"]').clear();
        cy.get('input[formcontrolname="Fecha_vencimiento"]').clear();
        cy.get(":nth-child(10) > .form-control").clear();
        cy.get('input[formcontrolname="FechaNacimiento"]').type(
          e2e.datosUsuario.fechaNacimiento
        );
        cy.get(":nth-child(4) > .form-control").select("Masculino");
        cy.get('input[formcontrolname="Fecha_expedicion"]').type(
          e2e.datosUsuario.fechaexpedicion
        );
        cy.get('input[formcontrolname="Fecha_vencimiento"]').type(
          e2e.datosUsuario.fechaVencimiento
        );
        cy.get("[data-test=situacion-laboral-select]").select("COLOMBIA");
        cy.get(":nth-child(10) > .form-control").type(
          e2e.datosUsuario.numeroRif
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
        
        // APPTIVIDAD
        cy.wait(10000);
        cy.get("[data-test=apptividad-acepto-btn]").click();
        cy.wait("@apptividad", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingApptivityData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnboardingApptivityData.serviceResponse
          ).to.eq(true);
        });

        // Biometria
        cy.wait(10000);
        cy.get('p[class="titleTutorialCedulaICB"]')
          .eq(1)
          .should("have.text", "T??mate una selfie, tal y como lo ves");
        cy.get("[data-test=iniciar-captura-unificado]").click({
          timeout: 6000,
        });
        cy.wait(90000);
        cy.get("[data-test=siguiente-biometria-unificado]").click();
        cy.wait("@biometria", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("Ok");
          expect(
            xhr.responseBody.OnBoardingBiometricData.serviceResponse
          ).to.eq(true);
        });

        //Direccion
        cy.wait(10000);
        cy.get('p[class="subtitleTuDireccion"]').should(
          "have.text",
          " Ahora necesitamos tu tel??fono celular y tus datos residenciales: "
        );
        cy.get("[data-test=country]").should("be.visible").select("VENEZUELA");
        cy.get("[data-test=distrito-select]")
          .should("be.visible")
          .select("MIRANDA");
        cy.get("[data-test=corregimiento-select]")
          .should("be.visible")
          .select("NUESTRA SENORA DEL ROSARIO DE BARUT");
        cy.get("[data-test=barriada-input]")
          .should("be.visible")
          .type(e2e.direccion.urbanizacion);
        cy.get("[data-test=Calle-input]")
          .should("be.visible")
          .type(e2e.direccion.calle);
        cy.get(":nth-child(1) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.edificio);
        cy.get(":nth-child(2) > [data-test=casa-apartamento]")
          .should("be.visible")
          .type(e2e.direccion.casa);
        cy.get(":nth-child(5) > :nth-child(1) > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoResidencial);
        cy.get(".col-md-6.ng-star-inserted > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.telefonoCelular);
        cy.get(".col-md-12 > [data-test=cellphone-input]")
          .should("be.visible")
          .type(e2e.direccion.puntoReferencia);
        cy.get("[data-test=siguiente-direccion-btn]")
          .should("be.visible")
          .click();
        cy.wait("@guardarDireccion", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(
            xhr.responseBody.OnboardingSaveAddressData.serviceResponse
          ).to.eq(true);
        });

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
          .type(e2e.declaracion.salario);
        cy.get("[data-test=estado-civil-select]")
          .should("be.visible")
          .select("SOLTERO(A)");
        cy.get('[data-test=generar-contrato-btn]').should("be.visible").click()

        // CONTRACTO
        cy.wait(10000)
        cy.wait("@actualizarprospectsimpli", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok");
          expect(xhr.responseBody.OnboardingProspectData.isRisk).to.eq(false);
          expect(xhr.responseBody.OnboardingProspectData.prospectSave).to.eq(true);
          expect(xhr.responseBody.OnboardingProspectData.serviceResponse).to.eq(true);
        });
        cy.get('.p-2 > #CONDICIONESDETUCUENTA').should("be.visible").click()
        cy.wait(3000)
        cy.wait("@mostrarContractosimpl", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.HttpResponse.message).to.eq("Ok.");
        });
        cy.wait(10000)
        cy.get('[data-test=acepto-contrato]').click()
        cy.wait("@aceptarContracto", { timeout: 60000 }).then((xhr) => {
          expect(xhr.status).to.eq(200);
          expect(xhr.responseBody.HttpResponse.code).to.eq(200);
          expect(xhr.responseBody.OnboardingConfirmData.serviceResponse).to.eq(true);
        });
        cy.screenshot("BENEFICIARIOS/contracto.png");
       });
    });

 
  })
}