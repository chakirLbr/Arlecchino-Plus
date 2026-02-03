import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung von Arlecchino Plus gemäß DSGVO.',
};

export default function DatenschutzPage() {
  return (
    <div className="pt-20">
      <div className="container-narrow py-16">
        <h1 className="font-heading text-4xl font-bold mb-8">
          Datenschutzerklärung
        </h1>

        <div className="prose prose-gray max-w-none">
          <h2>1. Datenschutz auf einen Blick</h2>

          <h3>Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was
            mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
            besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
            persönlich identifiziert werden können.
          </p>

          <h3>Datenerfassung auf dieser Website</h3>
          <p>
            <strong>
              Wer ist verantwortlich für die Datenerfassung auf dieser Website?
            </strong>
            <br />
            Die Datenverarbeitung auf dieser Website erfolgt durch den
            Websitebetreiber. Dessen Kontaktdaten können Sie dem{' '}
            <a href="/impressum" className="text-brand-red-600 hover:underline">
              Impressum
            </a>{' '}
            dieser Website entnehmen.
          </p>

          <h3>Wie erfassen wir Ihre Daten?</h3>
          <p>
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
            mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in
            ein Kontaktformular eingeben, bei einer Bestellung angeben oder bei
            einer Tischreservierung übermitteln.
          </p>
          <p>
            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
            Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor
            allem technische Daten (z.B. Internetbrowser, Betriebssystem oder
            Uhrzeit des Seitenaufrufs).
          </p>

          <h3>Wofür nutzen wir Ihre Daten?</h3>
          <p>
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung
            der Website zu gewährleisten. Andere Daten können zur Analyse Ihres
            Nutzerverhaltens verwendet werden. Wenn Sie bei uns bestellen oder
            reservieren, verwenden wir Ihre Daten zur Abwicklung Ihrer
            Bestellung bzw. Reservierung.
          </p>

          <h3>Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
          <p>
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
            Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu
            erhalten. Sie haben außerdem ein Recht, die Berichtigung oder
            Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur
            Datenverarbeitung erteilt haben, können Sie diese Einwilligung
            jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht,
            unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer
            personenbezogenen Daten zu verlangen.
          </p>

          <h2>2. Hosting</h2>
          <p>
            Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
          </p>
          <p>
            {/* TODO: Add actual hosting provider */}
            [Hosting-Anbieter einfügen]
          </p>

          <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>

          <h3>Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
            Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
            vertraulich und entsprechend den gesetzlichen
            Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>

          <h3>Hinweis zur verantwortlichen Stelle</h3>
          <p>
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser
            Website ist:
          </p>
          <p>
            Arlecchino Plus
            <br />
            Kölner Str. 1
            <br />
            42781 Haan
            <br />
            <br />
            Telefon: 02129 6663
            <br />
            E-Mail: info@arlecchino-plus.de
          </p>

          <h3>Speicherdauer</h3>
          <p>
            Soweit innerhalb dieser Datenschutzerklärung keine speziellere
            Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten
            bei uns, bis der Zweck für die Datenverarbeitung entfällt.
          </p>

          <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
          <p>
            Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen
            Einwilligung möglich. Sie können eine bereits erteilte Einwilligung
            jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf
            erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
          </p>

          <h3>Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
          <p>
            Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein
            Beschwerderecht bei einer Aufsichtsbehörde zu. Die für uns
            zuständige Aufsichtsbehörde ist:
          </p>
          <p>
            {/* TODO: Add actual supervisory authority */}
            Landesbeauftragte für Datenschutz und Informationsfreiheit
            Nordrhein-Westfalen
            <br />
            Kavalleriestraße 2-4
            <br />
            40213 Düsseldorf
          </p>

          <h2>4. Datenerfassung auf dieser Website</h2>

          <h3>Cookies</h3>
          <p>
            Unsere Internetseiten verwenden so genannte "Cookies". Cookies sind
            kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an.
            Sie werden entweder vorübergehend für die Dauer einer Sitzung
            (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem
            Endgerät gespeichert.
          </p>
          <p>
            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von
            Cookies informiert werden und Cookies nur im Einzelfall erlauben,
            die Annahme von Cookies für bestimmte Fälle oder generell
            ausschließen sowie das automatische Löschen der Cookies beim
            Schließen des Browsers aktivieren.
          </p>

          <h3>Kontaktformular</h3>
          <p>
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden
            Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort
            angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den
            Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir
            nicht ohne Ihre Einwilligung weiter.
          </p>

          <h3>Online-Bestellungen</h3>
          <p>
            Bei Online-Bestellungen erfassen wir folgende Daten:
          </p>
          <ul>
            <li>Name und Anschrift</li>
            <li>E-Mail-Adresse</li>
            <li>Telefonnummer</li>
            <li>Bestelldetails</li>
            <li>Zahlungsinformationen (werden direkt an den Zahlungsdienstleister übermittelt)</li>
          </ul>
          <p>
            Diese Daten werden zur Abwicklung Ihrer Bestellung und zur Erfüllung
            unserer vertraglichen Pflichten verarbeitet. Rechtsgrundlage ist
            Art. 6 Abs. 1 lit. b DSGVO.
          </p>

          <h3>Tischreservierungen</h3>
          <p>
            Bei Tischreservierungen erfassen wir:
          </p>
          <ul>
            <li>Name</li>
            <li>E-Mail-Adresse</li>
            <li>Telefonnummer</li>
            <li>Datum, Uhrzeit und Personenanzahl der Reservierung</li>
            <li>Besondere Wünsche (falls angegeben)</li>
          </ul>
          <p>
            Diese Daten werden ausschließlich zur Abwicklung Ihrer Reservierung
            verwendet.
          </p>

          <h2>5. Zahlungsdienstleister</h2>

          <h3>Stripe</h3>
          <p>
            Für die Abwicklung von Kartenzahlungen nutzen wir den
            Zahlungsdienstleister Stripe. Anbieter ist die Stripe Payments
            Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin,
            Irland.
          </p>
          <p>
            Weitere Informationen finden Sie in der Datenschutzerklärung von
            Stripe:{' '}
            <a
              href="https://stripe.com/de/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red-600 hover:underline"
            >
              https://stripe.com/de/privacy
            </a>
          </p>

          <h3>PayPal</h3>
          <p>
            Wir bieten auch Zahlung via PayPal an. Anbieter dieses
            Zahlungsdienstes ist die PayPal (Europe) S.à.r.l. et Cie, S.C.A., 22-24
            Boulevard Royal, L-2449 Luxembourg.
          </p>
          <p>
            Weitere Informationen finden Sie in der Datenschutzerklärung von
            PayPal:{' '}
            <a
              href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red-600 hover:underline"
            >
              https://www.paypal.com/de/webapps/mpp/ua/privacy-full
            </a>
          </p>

          <h2>6. Newsletter</h2>
          <p>
            Wenn Sie den auf der Website angebotenen Newsletter beziehen
            möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie
            Informationen, welche uns die Überprüfung gestatten, dass Sie der
            Inhaber der angegebenen E-Mail-Adresse sind.
          </p>
          <p>
            Die von Ihnen zum Zwecke des Newsletter-Bezugs bei uns hinterlegten
            Daten werden von uns bis zu Ihrer Austragung aus dem Newsletter
            gespeichert und nach der Abbestellung des Newsletters gelöscht.
          </p>

          <hr className="my-8" />

          <p className="text-sm text-muted-foreground">
            <em>
              Hinweis: Diese Datenschutzerklärung ist ein Muster und muss vom
              Seitenbetreiber überprüft und an die tatsächlichen
              Datenverarbeitungsvorgänge angepasst werden. Es wird empfohlen,
              einen Datenschutzbeauftragten oder Rechtsanwalt hinzuzuziehen.
            </em>
          </p>

          <p className="text-sm text-muted-foreground">
            Stand: Februar 2025
          </p>
        </div>
      </div>
    </div>
  );
}
