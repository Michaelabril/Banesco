/// <reference types="Cypress" />

export function IntentosBiometria (userCase) {

    describe('Onboarding KO por Intentos de biometria', () => {

        let secretCode 
        beforeEach(() => {
            cy.visit('./inicio', { timeout: 30000 });
            cy.server();
            //Servicio al insertar email
            cy.route('POST', '**/wscreatesessionbyemail').as('Sessionid');
            //Servicio al insertar codigo de sesion 
            cy.route('POST', '**/wsvalidatecodesession').as('ValidateSessionId')
            //Servicio FATCA y PEP 
            cy.route('POST', '**/wsfatca').as('FatcaPep')
             //Servicio OCR
            cy.route('POST', '**/wsocr').as('ocr')
           //Servicio Apptividad
            cy.route('POST', '**/wsvalidateapptivity').as('apptividad')
            //Servicio de biometria 
            cy.route('POST', '**/wsbiometric').as('biometria')

        })

        it('borrado', ()  => {  //Este servicio borra la data antes de iniciar el flujo

            
            cy.request(
                "POST",
                Cypress.env("baseUrlBack") + "wsdatacleaner", 
                {email: userCase.datosUsuario.email})
                .then(response => {
                    cy.log(JSON.stringify(response.body));
                    expect(response.body.HttpResponse.code).to.eq(200);
                    //expect(response.body.OnboardingCleanerData.serviceResponse).to.eq(true);
                })//cierre de wsdatacleaner
        }),  //cierre de it borrado

        it('caso - primer intento en biometria sin borrar', ()  => {   //Finalidad del caso generar el KO por dos intentos seguidos de biometria 
        
        //inicio de la página 
        cy.get('[data-test=comencemos_btn]' , { timeout: 60000 }).click()
        
        //cy.get('[data-test=no-soy-cliente-btn]').click({force:true}).end()
    
      
        cy.get('[data-test=quiero-mi-cuenta-btn]' , { timeout: 60000 }).click()
        
        //Insertar el email 
        cy.get('[data-test=insertar-correo]' , { timeout: 60000 }).type(userCase.datosUsuario.email)
        
        cy.get('[data-test="enviar-correo-electronico"]').click()
        cy.get('[data-test="es-correcto-email"]').click()


        //Para que no falle el flujo es importante escuchar ete servicio primero si no falla el codigo porque tra el codigo viejo 
        cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        expect(xhr.responseBody.OnboardingEmailData.emailsend).to.eq(true);
        expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok');
        });
    
    //Este servicio trae el codigo y lo inserta en el front
        cy.request(
            "POST",
            Cypress.env("baseUrlBack") + "wsgetsessionid", 
            {Email: userCase.datosUsuario.email}
            ).then(xhr => {
            cy.log(JSON.stringify(xhr.body));
        
            secretCode = (xhr.body.OnboardingSessionData.sessionId);
            cy.get('[data-test="codeAuth-input"]').type(secretCode)
            cy.get('[data-test="siguiente-codigo"]').click()
        
        })//cierre wsgetssessionid

        //Este servicio verifica que el codigo enviado sea el correcto         
        cy.wait('@ValidateSessionId', { timeout: 60000 }).then(xhr => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        })// Cierre ValidateSessionId
        
        //Pantalla FATCAPEP 
        cy.get('[data-test="no-fatca-btn"]', { timeout: 60000 }).click()
        expect('[data-test="no-fatca-btn"]').to.exist 
        expect('[data-test="si-fatca-btn"]').to.exist 
        cy.get('[data-test="no-pep"]', { timeout: 60000 }).click()
        expect('[data-test="no-pep"]').to.exist 
        expect('[data-test="si-pep"]').to.exist       
        cy.screenshot('BiometriaKOSES3FA/EVIDENCIA1', { timeout: 60000 })
        expect('[data-test="fatcapep-btn-siguiente"]').to.exist 
        cy.get('[data-test="fatcapep-btn-siguiente"]', { timeout: 60000 }).click()
        
        
        //Servicio FATCA y PEP 
        cy.wait('@FatcaPep', { timeout: 60000 }).then(xhr => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        })

        //Gif de OCR se utiliza el separado por que no se ha configurado la pantalla
        expect('[data-test="siguiente-ocr-gif"]').to.exist
        cy.get('[data-test="siguiente-ocr-gif"]', { timeout: 60000 }).click()
        //Boton de siguiente que se habilita en la vista de dispositivos. comentar esta linea cuando sale la pantalla desktop 
            
        
        cy.wait(25000)
        expect('[data-test="ocr-separado-siguiente"]').to.exist
        cy.get('[data-test="ocr-separado-siguiente"]', { timeout: 90000 }).click({force:true}) //pantallas separadas
        
        
        //Me gusta de la pantalla unificada de OCR cy.get('[data-test="ocr-unificado-siguiente"]')
        
        cy.wait('@ocr', { timeout: 100000 }).then(xhr => {  //Revisar porque en OCR no esta 
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        expect(xhr.responseBody.OnBoardingOcrData.serviceResponse).to.eq(true);
        expect(xhr.responseBody.OnBoardingOcrData.code).to.eq('Ok')
        }) 

        cy.get('[data-test="apptividad-acepto-btn"]', { timeout: 60000 }).click()

        cy.wait('@apptividad', { timeout: 100000 }).then(xhr => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        expect(xhr.responseBody.OnboardingApptivityData.serviceResponse).to.eq(true);
        expect(xhr.responseBody.OnboardingApptivityData.description).to.eq('Ok')   
        expect ('[data-test="siguiente-selfie-gif"]').to.exist
        });

        cy.get('[data-test="siguiente-selfie-gif"]', { timeout: 60000 }).click()
        
        expect ('[data-test="iniciar-captura-separado"]').to.exist
        cy.get('[data-test="iniciar-captura-separado"]', { timeout: 60000 }).click()
        cy.wait(30000)
        expect('[data-test="siguiente-biometria"]').to.exist
        cy.get('[data-test="siguiente-biometria"]', { timeout: 60000 }).click()
        

        cy.get('a[class=navbar-brand]').click({timeout: 6000}) //Opcion de reintento con clic en el logo de inicio 
        cy.screenshot('BiometriaKOSES3FA/EVIDENCIA2', { timeout: 60000 })
        })

        it('caso - segundo intento en biometria sin borrar', ()  => {

        //Aqui se repite nuevamente el flujo para hacer los dos intentos 
        cy.get('[data-test=comencemos_btn]', {timeout: 600000}).click({force:true})
        cy.get('[data-test=no-soy-cliente-btn]').click({force:true}).end()
        cy.wait(100)
        cy.get('[data-test=quiero-mi-cuenta-btn]').click()
        
        cy.get('[data-test=insertar-correo]').type(userCase.datosUsuario.email)
        
        
        cy.get('[data-test="enviar-correo-electronico"]').click()
        cy.screenshot('BiometriaKOSES3FA/EVIDENCIA3', { timeout: 60000 })
        cy.get('[data-test="es-correcto-email"]').click()

  
        cy.wait('@Sessionid', { timeout: 60000 }).then(xhr => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        expect(xhr.responseBody.OnboardingEmailData.emailsend).to.eq(true);
        expect(xhr.responseBody.OnboardingEmailData.code).to.eq('Ok');
        });
    
          cy.request(
            "POST",
            Cypress.env("baseUrlBack") + "wsgetsessionid", 
            {Email: userCase.datosUsuario.email}
            ).then(xhr => {
                cy.log(JSON.stringify(xhr.body));
    
                secretCode = (xhr.body.OnboardingSessionData.sessionId);
                cy.get('[data-test="codeAuth-input"]').type(secretCode)
                cy.get('[data-test="siguiente-codigo"]').click()
    
            })//cierre wsgetssessionid
            
            cy.wait('@ValidateSessionId', { timeout: 60000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
        
    
            })// Cierre ValidateSessionId
    
            
            cy.get('[data-test="no-fatca-btn"]', { timeout: 60000 }).click()
            expect('[data-test="no-fatca-btn"]').to.exist 
            expect('[data-test="si-fatca-btn"]').to.exist 
            cy.get('[data-test="no-pep"]', { timeout: 60000 }).click()
            expect('[data-test="no-pep"]').to.exist 
            expect('[data-test="si-pep"]').to.exist 
           
            cy.screenshot('BiometriaKOSES3FA/EVIDENCIA3', { timeout: 60000 })
            expect('[data-test="fatcapep-btn-siguiente"]').to.exist
            
            
            cy.get('[data-test="fatcapep-btn-siguiente"]', { timeout: 60000 }).click()
            
            
            cy.wait('@FatcaPep', { timeout: 60000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
            })
            //Gif de OCR 
            expect('[data-test="siguiente-ocr-gif"]').to.exist
            cy.get('[data-test="siguiente-ocr-gif"]', { timeout: 60000 }).click()
            //Boton de siguiente que se habilita en la vista de dispositivos. comentar esta linea cuando sale la pantalla desktop 
                
            cy.screenshot('BiometriaKOSES3FA/EVIDENCIA4', { timeout: 60000 })
            cy.wait(25000)
            expect('[data-test="ocr-separado-siguiente"]').to.exist
            cy.get('[data-test="ocr-separado-siguiente"]', { timeout: 90000 }).click({force:true}) //pantallas separadas
            
            
            //Me gusta de la pantalla unificada de OCR 
            // cy.get('[data-test="ocr-unificado-siguiente"]')
    
            cy.wait('@ocr', { timeout: 100000 }).then(xhr => {  //Revisar porque en OCR no esta 
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
                expect(xhr.responseBody.OnBoardingOcrData.serviceResponse).to.eq(true);
                expect(xhr.responseBody.OnBoardingOcrData.code).to.eq('Ok')
                
            }) 
            cy.get('[data-test="apptividad-acepto-btn"]', { timeout: 60000 }).click()
            cy.wait('@apptividad', { timeout: 100000 }).then(xhr => {
                expect(xhr.status).to.eq(200);
                expect(xhr.responseBody.HttpResponse.code).to.eq(200);
                expect(xhr.responseBody.OnboardingApptivityData.serviceResponse).to.eq(true);
                expect(xhr.responseBody.OnboardingApptivityData.description).to.eq('Ok')   
                expect ('[data-test="siguiente-selfie-gif"]').to.exist
            });
            cy.get('[data-test="siguiente-selfie-gif"]', { timeout: 60000 }).click()
            expect ('[data-test="iniciar-captura-separado"]').to.exist
            cy.get('[data-test="iniciar-captura-separado"]', { timeout: 60000 }).click()
            cy.wait(30000)
            expect('[data-test="siguiente-biometria"]').to.exist
            cy.get('[data-test="siguiente-biometria"]', { timeout: 60000 }).click()
            cy.screenshot('BiometriaKOSES3FA/EVIDENCIA5', { timeout: 60000 })
            cy.wait('@biometria', { timeout: 100000 }).then(xhr => {
                expect(xhr.status).to.eq(401);
                expect(xhr.responseBody.HttpResponse.code).to.eq(401);
                expect(xhr.responseBody.HttpResponse.message).to.eq("El servicio fue utilizado de manera maliciosa");
                expect(xhr.responseBody.OnBoardingBiometricData.code).to.eq("SES3FA"); 
                expect(xhr.responseBody.OnBoardingBiometricData.diagnosticMessage).to.eq(null); 
                expect(xhr.responseBody.OnBoardingBiometricData.serviceResponse).to.eq(false); 
            })
            cy.get('[id="SES3FA"]').contains('ENTENDIDO', { timeout: 60000 }).click()
        })
    })
}