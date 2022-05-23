export function KOFATCA(userCase) {

describe('Onboarding KO FATCA', () => {
    let secretCode 

    beforeEach(() => {
        cy.visit('https://pa-prod-webapp-onboarding-front-t24-qa.azurewebsites.net/inicio', { timeout: 30000 });
        cy.server();
        //Servicio al insertar email
        cy.route('POST', '**/wscreatesessionbyemail').as('Sessionid');
        //Servicio al insertar codigo de sesion 
        cy.route('POST', '**/wsvalidatecodesession').as('ValidateSessionId')
        //Servicio FATCA y PEP 
        cy.route('POST', '**/wsfatca').as('FatcaPep')

    }) //Cierre del beforeEach

  /it('Borrar la data', ()  => {
        //ws de limpieza en data por email
       cy.request(
            "POST",
            Cypress.env("baseUrlBack") + "wsdatacleaner", 
            {email: userCase.datosUsuario.email})
            .then(response => {
                cy.log(JSON.stringify(response.body));
                expect(response.body.HttpResponse.code).to.eq(200);
            })//cierre de wsdatacleaner
    })

    it('caso 1 - FATCA SI ', ()  => {

    cy.get('[data-test=comencemos_btn]').click()

    //cy.get('[data-test=soy-cliente-btn]').click({force:true}).end() 
    cy.get('[data-test=quiero-mi-cuenta-btn]').click()

    cy.get('[data-test=insertar-correo]').type(userCase.datosUsuario.email)
    cy.screenshot('KOFATCA/EVIDENCIA1', { timeout: 60000 })
    
    cy.get('[data-test="enviar-correo-electronico"]').click()
    cy.get('[data-test="es-correcto-email"]').click()

    cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        expect(xhr.responseBody.OnboardingEmailData.emailsend).to.eq(true);
        expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok');
        });

    //Este servicio nos da el codigo de sesion del email utilizado
    cy.request(
        "POST",
        Cypress.env("baseUrlBack") + "wsgetsessionid", 
        {Email: userCase.datosUsuario.email}
        ).then(xhr => {
            cy.wait(600)
            cy.log(JSON.stringify(xhr.body));
            cy.wait(500)

            secretCode = (xhr.body.OnboardingSessionData.sessionId);
            cy.get('[data-test="codeAuth-input"]').type(secretCode)
            cy.get('[data-test="siguiente-codigo"]').click()
        })//cierre wsgetssessionid
        
        cy.wait('@ValidateSessionId', { timeout: 60000 }).then(xhr => {
            expect(xhr.status).to.eq(200);
            expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        })//cierre de validatesessionid

            cy.get('[data-test="si-fatca-btn"]', { timeout: 60000 }).click()
            expect('[data-test="no-fatca-btn"]').to.exist 
            expect('[data-test="si-fatca-btn"]').to.exist 
            cy.get('[data-test="no-pep"]', { timeout: 60000 }).click()
            expect('[data-test="no-pep"]').to.exist 
            expect('[data-test="si-pep"]').to.exist 
            cy.screenshot('KOFATCA/EVIDENCIA2', { timeout: 60000 })
            cy.get('[data-test="fatcapep-btn-siguiente"]').click()
            cy.get('.container-fluid > .p-4').contains('En estos momentos no se cumplen todas las condiciones para continuar con la solicitud de la cuenta en línea.', {timeout:10000})
            cy.screenshot('KOFATCA/EVIDENCIA3', { timeout: 60000 })

            cy.wait('@FatcaPep', { timeout: 60000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
                expect(xhr.responseBody.HttpResponse.message).to.eq('El prospecto ha caido en un knockout: CFAT');
                expect(xhr.responseBody.OnboardingFatcaData.code).to.eq('CFAT');
                expect(xhr.responseBody.OnboardingFatcaData.token).to.be.empty



            })//cierre de FatcaPep
    })
            
            it('caso 2 - Usar un correo que ya tenga el KO  ', ()  => {

                cy.get('[data-test=comencemos_btn]').click()
        
                cy.get('[data-test=soy-cliente-btn]').click({force:true}).end()
        
                cy.wait(100) //agregar un esperar al elemento siguiente 
                cy.get('[data-test=quiero-mi-cuenta-btn]').click()
        
                cy.get('[data-test=insertar-correo]').type(userCase.datosUsuario.email)
                cy.screenshot('KOFATCA/EVIDENCIA4', { timeout: 60000 })
                
                cy.get('[data-test="enviar-correo-electronico"]').click()
                cy.get('[data-test="es-correcto-email"]').click()
                cy.get('.container-fluid > .p-4').contains('En estos momentos no se cumplen todas las condiciones para continuar con la solicitud de la cuenta en línea.', {timeout:10000})
                cy.screenshot('KOFATCA/EVIDENCIA5', { timeout: 60000 })

        })

        })}