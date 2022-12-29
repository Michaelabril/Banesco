/// <reference types="Cypress" />

export function PROD_TEMPLATES(Tem_Productos) {
    describe('Onboarding Templates', () => {
        beforeEach(() => {
            cy.visit('/',{ timeout: 30000 });
            cy.wait(5000);
            cy.server();
            //Servicio al insertar email
            cy.route('POST', '**/wscreatesessionbyemail').as('Sessionid');
            //Servicio al insertar codigo de sesion 
            cy.route('POST', '**/wsvalidatecodesession').as('ValidateSessionId')
            cy.route('POST', '**/wsconsultparameters').as('wsconsultparameters')
        }) //Cierre del beforeEach

        /*it('Borrar la data', ()  => {
            //ws de limpieza en data por email
           cy.request(
                "POST",
                Cypress.env("baseUrlBack") + "wsdatacleaner", 
                {email: userCase.datosUsuario.email})
                .then(response => {
                    cy.log(JSON.stringify(response.body));
                    expect(response.body.HttpResponse.code).to.eq(200);
                    //expect(response.body.OnboardingCleanerData.serviceResponse).to.eq(true);
                })//cierre de wsdatacleaner


        })*/

        it('Validacion de Template Cuenta ahorro simplificada',()=>{
            cy.get('[data-test=comencemos_btn]').click()
            cy.wait(7000);
            cy.get('[data-test=insertar-correo]').click();
            cy.get('[data-test=insertar-correo]').type(Tem_Productos.datosUsuario.emailSimplificada)
            cy.get('[data-test=insertar-ccdigo]').click()
            cy.get('[data-test=insertar-ccdigo]').type(Tem_Productos.datosUsuario.codesimplificada)
            cy.get('[data-test="enviar-correo-electronico"]').click()
            cy.get('[data-test="es-correcto-email"]').click()
            cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok'); 
            });
            cy.wait(7000);
            cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
                expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORROS SIMPLIFICADA'); 
            });
            cy.get('.col-md-7 > .list-group > :nth-child(1) > .fmb-0').should('have.text','Abre tu CUENTA DE AHORROS SIMPLIFICADA en minutos. Más tiempo te tomará preparar el café de la mañana.')
            cy.wait(7000);
            cy.screenshot("Templates/tsimplificada", { timeout: 60000 });
        })
        it('Validacion de Template Cuenta ahorro',()=>{
            cy.get('[data-test=comencemos_btn]').click()
            cy.wait(7000);
            cy.get('[data-test=insertar-correo]').click();
            cy.get('[data-test=insertar-correo]').type(Tem_Productos.datosUsuario.emailAhorro)
            cy.get('[data-test=insertar-ccdigo]').click()
            cy.get('[data-test=insertar-ccdigo]').type(Tem_Productos.datosUsuario.codeAhorro)
            cy.get('[data-test="enviar-correo-electronico"]').click()
            cy.get('[data-test="es-correcto-email"]').click()
            cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok'); 
            });
            cy.wait(7000);
            cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
                expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO'); 
            });
            cy.get('.col-md-7 > .list-group > :nth-child(1) > .fmb-0').should('have.text','Abre tu CUENTA DE AHORRO en minutos. Más tiempo te tomará preparar el café de la mañana.')
            cy.wait(7000);
            cy.screenshot("Templates/tahorro", { timeout: 60000 });
        })
        it('Validacion de Template Cuenta ahorro Euros',()=>{
            cy.get('[data-test=comencemos_btn]').click()
            cy.wait(7000);
            cy.get('[data-test=insertar-correo]').click();
            cy.get('[data-test=insertar-correo]').type(Tem_Productos.datosUsuario.emailEuros)
            cy.get('[data-test=insertar-ccdigo]').click()
            cy.get('[data-test=insertar-ccdigo]').type(Tem_Productos.datosUsuario.codeEuros)
            cy.get('[data-test="enviar-correo-electronico"]').click()
            cy.get('[data-test="es-correcto-email"]').click()
            cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok'); 
            });
            cy.wait(7000);
            cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
                expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO EN EUROS'); 
            });
            cy.get('.col-md-7 > .list-group > :nth-child(1) > .fmb-0').should('have.text','Abre tu CUENTA DE AHORRO EN EUROS en minutos. Más tiempo te tomará preparar el café de la mañana.')
            cy.wait(7000);
            cy.screenshot("Templates/teuros", { timeout: 60000 });
        })
        it('Validacion de Template Cuenta ahorro Corriente',()=>{
            cy.get('[data-test=comencemos_btn]').click()
            cy.wait(7000);
            cy.get('[data-test=insertar-correo]').click();
            cy.get('[data-test=insertar-correo]').type(Tem_Productos.datosUsuario.emailCorriente)
            cy.get('[data-test=insertar-ccdigo]').click()
            cy.get('[data-test=insertar-ccdigo]').type(Tem_Productos.datosUsuario.codeCorriente)
            cy.get('[data-test="enviar-correo-electronico"]').click()
            cy.get('[data-test="es-correcto-email"]').click()
            cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok'); 
            });
            cy.wait(7000);
            cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
                expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA CORRIENTE'); 
            });
            cy.get('.col-md-7 > .list-group > :nth-child(1) > .fmb-0').should('have.text','Abre tu CUENTA CORRIENTE en minutos. Más tiempo te tomará preparar el café de la mañana.')
            cy.wait(7000);
            cy.screenshot("Templates/tcorriente", { timeout: 60000 });
        })
        it('Validacion de Template Cuenta ahorro Multipanama',()=>{
            cy.get('[data-test=comencemos_btn]').click()
            cy.wait(7000);
            cy.get('[data-test=insertar-correo]').click();
            cy.get('[data-test=insertar-correo]').type(Tem_Productos.datosUsuario.emailmultipanama)
            cy.get('[data-test=insertar-ccdigo]').click()
            cy.get('[data-test=insertar-ccdigo]').type(Tem_Productos.datosUsuario.codemultipanama)
            cy.get('[data-test="enviar-correo-electronico"]').click()
            cy.get('[data-test="es-correcto-email"]').click()
            cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok'); 
            });
            cy.wait(7000);
            cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
                expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO MULTIPANAMA'); 
            });
            cy.get('.col-md-7 > .list-group > :nth-child(1) > .fmb-0').should('have.text','Abre tu CUENTA DE AHORRO MULTIPANAMA en minutos. Más tiempo te tomará preparar el café de la mañana.')
            cy.wait(7000);
            cy.screenshot("Templates/tmultipanama", { timeout: 60000 });
        })
        it('Validacion de Template Cuenta ahorro Multititular',()=>{
            cy.get('[data-test=comencemos_btn]').click()
            cy.wait(7000);
            cy.get('[data-test=insertar-correo]').click();
            cy.get('[data-test=insertar-correo]').type(Tem_Productos.datosUsuario.emailmultitular)
            cy.get('[data-test=insertar-ccdigo]').click()
            cy.get('[data-test=insertar-ccdigo]').type(Tem_Productos.datosUsuario.codeMultititular)
            cy.get('[data-test="enviar-correo-electronico"]').click()
            cy.get('[data-test="es-correcto-email"]').click()
            cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok'); 
            });
            cy.wait(7000);
            cy.wait('@wsconsultparameters', { timeout: 60000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
                expect(xhr.responseBody.OnboardingParametersData.data.documenttyped).to.eq('CUENTA DE AHORRO MULTI TITULAR'); 
            });
            cy.get('.col-md-7 > .list-group > :nth-child(1) > .fmb-0').should('have.text','Abre tu CUENTA DE AHORRO MULTI TITULAR en minutos. Más tiempo te tomará preparar el café de la mañana.')
            cy.wait(7000);
            cy.screenshot("Templates/tmultititular", { timeout: 60000 });
        }) 
 })
}
