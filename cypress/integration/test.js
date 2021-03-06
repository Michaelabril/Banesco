/// <reference types="Cypress" />
export function OCR(ocr) {
  describe("BI - Validaciondes OCR", () => {
    beforeEach(() => {
      cy.visit("./");
      cy.server();
      cy.route("POST", "**/wsgetsessionidbi").as("code");
    });

    it("Obtener codigo", () => {
      cy.request("POST", Cypress.env("baseUrlBack") + "wsdatacleanerbi", {
        Email: pasd.mail,
      }).then((response) => {
        cy.log(JSON.stringify(response.body));
        expect(response.body.HttpResponse.code).to.eq(200);
      }); // fin del servicio de borrado
      cy.request("POST", Cypress.env("baseUrlBack") + "wsgetsessionidbi", {
        Email: pasd.mail,
      }).then((response) => {
        cy.log(JSON.stringify(response.body));
        expect(response.body.HttpResponse.code).to.eq(200);
        const secretCode = response.body.OnboardingSessionData.sessionId;
        cy.wait(30000);
        cy.get("[data-test=comencemos_btn]").click().wait(20000);
        cy.get("[data-test=insertar-correo]").type(pasd.mail);
        cy.get("[data-test=insertar-ccdigo]").type(secretCode);
        cy.get("[data-test=enviar-correo-electronico]").click();
        cy.get("[data-test=es-correcto-email]").click();
        cy.wait(5000);

        cy.get("[data-test=quiero-mi-cuenta-btn]").click(); //CARACTERISTICAS DE LA CUENTA

        //fatca
        cy.get("[data-test=no-fatca-btn]").click();
        cy.get("[data-test=no-fis]").click();
        cy.get("[data-test=no-pep]").click();
        cy.get("[data-test=no-fampep]").click();
        cy.get("[data-test=fatcapep-btn-siguiente]").click();

        //OCR
        cy.wait(45000);
        cy.get("[data-test=ocr-unificado-siguiente]").click();

        //VERIFICACION DE DATOS
        cy.wait(4000);
        cy.get(":nth-child(1) > .form-control").clear().type("MARIANA SORAIDA");
        cy.get(":nth-child(2) > .form-control").clear().type("SANJUR PEREZ");
        cy.get(":nth-child(4) > .form-control").select("F");
        cy.get(":nth-child(10) > .form-control").type("V-39399393-3");
        cy.get("[data-test=generar-contrato-btn]").click();
        cy.get("[data-test=es-correcto-email]").click();

        //APPTIVIDAD
        cy.get("[data-test=apptividad-acepto-btn]").click();

        //TRIVIA APPTIVIDAD
        cy.get("[data-test=no-me-quejo-btn]").click().wait(30000);

        //BIOMETRIA
        cy.get("[data-test=iniciar-captura-unificado]").click().wait(35000);
        cy.get("[data-test=siguiente-biometria-unificado]").click().wait(25000);

        //DIRECCION
        cy.get("[data-test=distrito-select]").select("AMAZONAS");
        cy.get("[data-test=corregimiento-select]").select("MARA");
        cy.get("[data-test=barriada-input]").type("SAN TOMAS");
        cy.get("[data-test=Calle-input]").type("CALLE PRINCIPAL");
        cy.get(":nth-child(1) > [data-test=casa-apartamento]").type(
          "RESIDENCIAL LOS PINOS"
        );
        cy.get(":nth-child(2) > [data-test=casa-apartamento]").type("CASA 23A");
        cy.get(":nth-child(2) > [data-test=cellphone-input]").type(
          "4246363637"
        );
        cy.get(".col-md-12 > [data-test=cellphone-input]").type(
          "A 200 METROS DE LA FARMACIA"
        );
        cy.get("[data-test=siguiente-direccion-btn]").click();

        //TDD
        cy.get(".customNextButton").click(); //platinum
        // cy.get('mat-select.form-control#seguros').click().select('USD 3.50 mensuales').click()
        //cy.get('mat-option').contains('USD 3.50 mensuales').click()
        cy.get("[data-test=btn-quiero-tarjeta]").click();

        //TUS INGRESOS
        cy.get("[data-test=situacion-laboral-select]").select("ASALARIADO");
        cy.get("[data-test=tipo-negocio-select]").select("ADMINISTRACION");
        cy.get("[data-test=ocupacion-select]").select("ADMINISTRADOR");
        cy.get("[data-test=salario-input]").type("2200");
        cy.get("[data-test=text-otros-ingresos]").type("PENSION");
        cy.get("[data-test=monto-otros-ingresos]").type("200");
        cy.get("[data-test=monto_apertura-input]").type("3000");
        cy.get("[data-test=origen_fondos-select]").select("FONDOS PROPIOS");
        cy.get("[data-test=estado-civil-select]").select("SOLTERO(A)");
        cy.get("[data-test=perfil_transaccional-select]").select(
          "PREFIERO HACER MOVIMIENTOS LOCALES E INTERNACIONALES"
        );
        cy.get(".mt-2 > :nth-child(1) > .ng-untouched").click();
        cy.get(".ng-select-container").click();
        cy.get(".ng-dropdown-header > .ng-star-inserted").type(
          "ARGENTINA{enter}"
        );
        cy.get("[data-test=generar-contrato-btn]").click().wait(8000);

        //EVIDENCIAS DE OTROS INGRESOS
        // cy.get('button[id="buttonAttached"]').click()
        const cartadetrabajo = "Carta.png";
        const firma = "firma.jpeg";
        cy.get(":nth-child(2) > .buttonAttached").attachFile(
          cartadetrabajo,
          "{enter}"
        );
        cy.get(".mt-4 > .buttonAttached").attachFile(firma, "{enter}");
        cy.get("[data-test=generar-contrato-btn]").click;
        /*cy.fixture(cartadetrabajo).then(fileContent => {
        cy.get(':nth-child(2) > .buttonAttached').attachFile({ fileContent, fileName, mineType: 'application/png' })
        cy.get('.mt-4 > .buttonAttached').attachFile({fileContent, fileName, mineType: 'application/png' })
        })
        cy.fixture('images/Carta.png').as('trabajo')
        cy.get(':nth-child(2) > .buttonAttached').then(function ($input) {
        //convert the logo base64 string to a blob
        const blob = Cypress.Blob.base64StringToBlob(this.trabajo, 'image/png')
        $input.fileupload('add', { files: blob })
        })

        onclick=("document.getElementById('file'").click();

        const Firma = 'firma';
        cy.fixture(Firma).then (fileContent => {
        cy.get('.mt-4 > .buttonAttached').attachFile({fileContent, fileName, mineType: 'application/jpeg' })
        })*/
      });
    });
  });
}
