/// <reference types="Cypress" />

export function DATOSGENERALES(datosGenerales) {
    describe('BI - Validaciondes OCR', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.wait(5000);
            cy.server();
            //Servicio al insertar email
            cy.route('POST', '**/wscreatesessionbyemail').as('Sessionid');
            //Servicio al insertar codigo de sesion 
            cy.route('POST', '**/wsvalidatecodesession').as('ValidateSessionId')
            //Servicio FATCA y PEP 
            cy.route('POST', '**/wsfatca').as('FatcaPep')
            // Servicio de OCR
            cy.route('POST', '**/wsocr').as('Ocr')
        })//Cierre del beforeEach
      
        it('Inicio',()=>{
            cy.contains('¡Hola! Soy Dana.')
            })

        it('Ocr',()=>{
            cy.visit('/');
            cy.fixture('index').then((index)=>{
            cy.get('[data-test=comencemos_btn]').click()
            cy.wait(7000);
            cy.get('[data-test=insertar-correo]').click();
            cy.get('[data-test=insertar-correo]').type(datosGenerales.datosUsuario.email)
            cy.get('[data-test=insertar-ccdigo]').click()
            cy.get('[data-test=insertar-ccdigo]').type(datosGenerales.datosUsuario.code)
            cy.get('[data-test="enviar-correo-electronico"]').click()
            cy.get('[data-test="es-correcto-email"]').click()
            cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok'); 
            });
            cy.wait(5000);
            cy.get('[data-test=quiero-mi-cuenta-btn]').click()
            cy.get('[data-test=no-fatca-btn]').click()
            cy.get('[data-test=no-fis]').click()
            cy.get('[data-test=no-pep]').click()
            cy.get('[data-test=no-fampep]').click()
            cy.get('[data-test=fatcapep-btn-siguiente]').click()
            cy.wait('@FatcaPep', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              });
            cy.wait(30000);
            cy.get('[data-test=ocr-unificado-siguiente]').click()
            cy.wait('@Ocr', { timeout: 60000 }).then(xhr => {
              expect(xhr.status).to.eq(200);
              expect(xhr.responseBody.HttpResponse.code).to.eq(200);
              expect(xhr.responseBody.OnBoardingOcrData.code).to.eq('OK'); 
            });
            })
          })     
})
}