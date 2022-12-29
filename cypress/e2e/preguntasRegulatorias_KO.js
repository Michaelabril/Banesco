describe('Onoboarding Internacional',function () {
  beforeEach(() => {
    cy.visit('inicio', { timeout: 30000 });
    cy.server();
    //Servicio al insertar email
    cy.route('POST', '**/wscreatesessionbyemail').as('Sessionid');    
    //Servicio FATCA y PEP 
    cy.route('POST', '**/wsfatca').as('FatcaPep')
  })//Cierre del beforeEach

  it('OCR',()=>{
    cy.fixture('index').then((index)=>{
    cy.get('[data-test=comencemos_btn]').click()
    cy.wait(5000);
    cy.get('[data-test=insertar-correo]').click();
    cy.get('[data-test=insertar-correo]').type("prueba07@yopmail.com")
    cy.get('[data-test=insertar-ccdigo]').click()
    cy.get('[data-test=insertar-ccdigo]').type("437989")
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
    cy.wait(5000);
    })
  })
  
})