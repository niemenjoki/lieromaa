import classes from '@/app/(fi)/tietosuoja/Tietosuoja.module.css';
import SafeLink from '@/components/SafeLink/SafeLink';
import { formatDate } from '@/lib/i18n/formatters.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import {
  BUSINESS_ADDRESS_LINES,
  BUSINESS_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from '@/lib/site/contact';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const PUBLISHED_AT = '2026-07-17';
const UPDATED_AT = '2026-07-17';

const pageMetadata = {
  language: 'en',
  title: 'Privacy notice | Lieromaa',
  description:
    'Read how Lieromaa collects, uses, stores and shares personal data for orders, customer service, reviews, analytics, advertising and data requests.',
  canonicalUrl: '/en/privacy',
};

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

export default function EnglishPrivacyPage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'Lieromaa privacy notice',
    datePublished: PUBLISHED_AT,
    dateModified: UPDATED_AT,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className={classes.PrivacyPage}>
        <header>
          <h1>Privacy notice</h1>
          <p>
            <em>Updated: {formatDate(UPDATED_AT, 'en')}</em>
          </p>
          <p>
            The Lieromaa website is operated by Joonas Niemenjoki, the data controller.
            This privacy notice explains how personal data is collected, used, stored and
            disclosed to third parties in connection with the website in accordance with
            the General Data Protection Regulation (EU 2016/679). You can browse the site
            without placing an order, but ordering requires certain personal data. The
            site does not use automated decision-making or profiling that produces legal
            effects.
          </p>
        </header>

        <section>
          <h2>Contact details of the data controller</h2>
          <p>
            Data controller: <strong>{BUSINESS_NAME}</strong>
            <br />
            Address: <strong>{BUSINESS_ADDRESS_LINES.join(', ')}</strong>
            <br />
            Email: <strong>{CONTACT_EMAIL}</strong>
            <br />
            Telephone / WhatsApp: <strong>{CONTACT_PHONE}</strong>
          </p>

          <h2>Data collected</h2>
          <p>The following categories of data may be processed on this site:</p>
          <ul>
            <li>
              Order data: name, email address, telephone number, delivery address,
              postcode, town or city, ordered product, delivery method, contents of the
              message field and any information connected with a discount code.
            </li>
            <li>
              Cancellation-notice data: name, email address, optional telephone number,
              preferred contact method, order identifier, scope of the notice, products or
              order details described in the notice, and submission time.
            </li>
            <li>
              Question and topic-suggestion data: a message sent through a guide-page
              form, its type (question or topic suggestion), an optional email address,
              the current page URL and the referring page.
            </li>
            <li>
              Review data: review-link identifier, product, star rating, written review,
              optional private feedback, optional display name and the products in the
              order to which the review relates.
            </li>
            <li>
              Data-request information: the order number and email address entered on the
              data-request form are processed to send a download link corresponding to an
              order. To limit abuse, technical identifiers created with a secret key may
              be stored for up to 24 hours; the original order number, email address or
              network address cannot be read directly from those identifiers.
            </li>
            <li>
              Technical usage data and analytics measurements: Lieromaa’s first-party
              analytics collects only pseudonymous usage measurements, such as a
              browser-specific identifier, session identifier, page paths, timestamps, the
              previous internal page, the hostname of an external referrer, possible UTM
              campaign parameters, estimated engagement time, scroll depth, order-CTA
              clicks, cart and order-form events, and performance measurements. It does
              not include names, email addresses, telephone numbers, delivery addresses,
              order numbers, IP addresses, detailed device data or URL parameters other
              than UTM campaign parameters.
            </li>
            <li>
              User settings: the light or dark theme selection stored in the browser’s
              localStorage.
            </li>
            <li>
              Cart data: product identifiers, quantities and the cart’s last-modified
              time. The cart is stored only in your browser and is not sent to Lieromaa
              until you submit the order form.
            </li>
          </ul>

          <h2>Collection and sources of data</h2>
          <p>
            Data is collected primarily from you when you submit an order, cancellation
            notice, review, data request, or a message through a question and
            topic-suggestion form on a guide page. Third-party services, including Google
            AdSense and Speed Insights, may also collect technical information about use
            of the site. With consent, Lieromaa uses first-party analytics that stores
            only measurements relevant to use of the site on Lieromaa’s own server. Vercel
            and a Cloudflare Tunnel connection are used to transmit order, cancellation
            and review forms. The site can also be used with ad blockers or other
            tracking-prevention tools.
          </p>

          <h2>Purposes and legal bases for processing</h2>
          <p>Personal data is processed for the following purposes:</p>
          <ul>
            <li>
              Receiving and processing orders, arranging delivery and communicating with
              customers: performance of a contract or steps taken before entering into a
              contract (GDPR Article 6(1)(b)).
            </li>
            <li>
              Receiving, acknowledging and processing cancellation notices: performance of
              a contract, steps taken before entering into a contract or compliance with a
              legal obligation (Articles 6(1)(b) and 6(1)(c)).
            </li>
            <li>
              Receiving and answering questions and developing new guide topics from
              messages: legitimate interests (Article 6(1)(f)).
            </li>
            <li>
              Receiving, moderating and publishing reviews: consent (Article 6(1)(a)) and,
              for prevention of abuse, legitimate interests (Article 6(1)(f)).
            </li>
            <li>
              Fulfilling a data subject’s data request and delivering a download link:
              compliance with a legal obligation (Article 6(1)(c)). Limiting abuse of the
              request process is based on legitimate interests (Article 6(1)(f)).
            </li>
            <li>
              Accounting and statutory obligations: compliance with a legal obligation
              (Article 6(1)(c)).
            </li>
            <li>
              Preventing spam, abuse and security risks: legitimate interests (Article
              6(1)(f)).
            </li>
            <li>
              Displaying and targeting advertising through Google AdSense: consent
              (Article 6(1)(a)).
            </li>
            <li>
              Analysing use and performance through Lieromaa’s first-party analytics and
              Speed Insights: consent for first-party analytics (Article 6(1)(a)) and
              legitimate interests in improving the site for Speed Insights (Article
              6(1)(f)).
            </li>
            <li>
              Saving user settings and the cart in browser storage: legitimate interests
              in improving the usability of the site and ordering process (Article
              6(1)(f)).
            </li>
          </ul>

          <h2>Order forms</h2>
          <p>
            Order-form submissions are received first by Lieromaa’s public website on
            Vercel and forwarded to Lieromaa’s own order-management service. The
            connection between the public site and order management on a home server
            passes through Cloudflare Tunnel. Order data is stored in a local SQLite
            database managed by Lieromaa on the home server. Order-related email is sent
            through Zoho Mail’s SMTP service. Technical request context, such as the
            browser user agent, origin and referrer information and an IP address supplied
            by an intermediary service, may also be forwarded with an order so that misuse
            can be investigated and the service protected.
          </p>

          <h2>Cancellation form</h2>
          <p>
            Cancellation-form data is received first by Lieromaa’s public website on
            Vercel and forwarded through Cloudflare Tunnel to Lieromaa’s order-management
            service. The information supplied by the customer, submission time and
            technical request context are stored. The customer receives an automatic email
            acknowledging the notice, and Lieromaa’s operator receives an email so the
            matter can be handled manually.
          </p>

          <h2>Review form</h2>
          <p>
            The review form uses a personal review link associated with an earlier order.
            Processing covers the review-link identifier, product, star rating, written
            review, optional private feedback, optional display name and the products in
            the order to which the review relates. A review is stored for moderation first
            and is not published until it has been approved manually. Private feedback is
            not published as a customer review.
          </p>

          <h2>Guide-page question and topic-suggestion form</h2>
          <p>
            Messages from question and topic-suggestion forms on the Finnish guide pages
            are received first by Lieromaa’s public website on Vercel and forwarded
            through Cloudflare Tunnel to Lieromaa’s order-management service. Along with
            the message, the transmission may include its type, an optional email address,
            page URL, page title and referrer where available. Zoho Mail’s SMTP service
            sends Lieromaa’s operator an email notification of a new message.
          </p>

          <h2>Data-request form and downloading data</h2>
          <p>
            The order number and email address supplied through the data-request form are
            compared with an order in the order-management service. The form always
            displays the same general confirmation, whether or not a matching order is
            found. This prevents an outsider from learning whether a particular email
            address or order number is in the system. If the details match, a download
            link is sent through Zoho Mail’s SMTP service to the email address stored on
            the order.
          </p>
          <p>
            The download link contains a random, single-use token valid for 24 hours. Only
            a hash of the token is stored on the server, and the token is excluded from
            site analytics. Lieromaa analytics and Speed Insights are not used on the
            download page. The downloadable JSON file contains data connected with the
            order that remains stored in Lieromaa’s order-management system. It does not
            contain internal administrator identifiers, email-service message identifiers
            or secrets.
          </p>

          <h2>Delivery through Posti</h2>
          <p>
            When you choose delivery through Posti, the information needed for delivery,
            such as your name, address, postcode, town or city, telephone number and/or
            email address, is entered into Posti’s system. Posti processes the data under
            its own privacy practices.
          </p>

          <h2>Invoicing, payments and accounting</h2>
          <p>
            Lieromaa processes the personal data needed to send and administer invoices
            and to record transactions for accounting. Necessary invoice and accounting
            data may be made available to Lieromaa’s accounting service provider. This
            typically includes the customer’s name, email address, order and invoice
            details, payment status and other information required by law. The service
            provider processes data under its own legal and contractual obligations.
          </p>

          <h2>Google AdSense</h2>
          <p>
            The site uses Google AdSense to display advertising. Google may collect data
            including IP address, browser type, device information, browsing behaviour and
            other identifiers. Google may process data as an independent controller and
            may transfer it outside the EU or EEA. Transfers are protected in accordance
            with the GDPR, including through standard contractual clauses. Google Consent
            Mode is used to request consent before non-essential cookies are stored or
            used.
          </p>
          <p>
            With consent, Google may use data for profiling to show targeted advertising.
            Data is kept in server logs and is partially anonymised after 9 months for IP
            addresses and 18 months for cookies, in accordance with Google’s retention
            practices.
          </p>
          <p>
            More information is available in Google’s documentation:{' '}
            <a
              href="https://support.google.com/adsense/topic/13821022?hl=en"
              target="_blank"
              rel="noreferrer"
            >
              Google AdSense privacy and security
            </a>{' '}
            and{' '}
            <a
              href="https://policies.google.com/technologies/retention?hl=en"
              target="_blank"
              rel="noreferrer"
            >
              Google data retention
            </a>
            .
          </p>

          <h2>First-party analytics and Speed Insights</h2>
          <p>
            Lieromaa uses lightweight first-party analytics and Vercel Speed Insights to
            understand use and performance. First-party analytics begins only after you
            accept analytics and advertising-related device storage in the consent
            management tool. It then stores on Lieromaa’s server a pseudonymous
            browser-specific identifier, session identifier, page path, timestamp,
            previous internal page, hostname of an external referrer, possible UTM
            parameters (utm_source, utm_medium, utm_campaign, utm_content and utm_term),
            estimated engagement time, scroll depth and order-CTA clicks. It may also
            record pseudonymous events such as adding an item to the cart, continuing from
            the delivery-method stage, attempting to submit an order form and successfully
            submitting one. This data is used only to understand navigation and changes in
            interest in products, the cart and ordering over time.
          </p>
          <p>
            First-party analytics does not store IP addresses, precise browser or device
            identifiers or geographic location, and it does not use fingerprinting or
            similar identification. Analytics events are not connected with individual
            order data such as a name, email address, telephone number, delivery address
            or order number. Raw analytics data is pseudonymous. Reporting is performed at
            session and page-group level so that general order-session paths can be
            understood without connecting an individual customer’s browsing history to an
            order. Of URL parameters, analytics stores only UTM campaign parameters. The
            pseudonymous visitor identifier is stored in localStorage after consent, and
            session information in sessionStorage. Withdrawing analytics consent removes
            these identifiers from browser storage. Speed Insights collects performance
            measurements under the provider’s practices.
          </p>
          <p>
            First-party analytics data is stored in a SQLite database managed by Lieromaa
            on the home server. More information on Speed Insights is available from the
            provider:{' '}
            <a
              href="https://vercel.com/docs/speed-insights/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              Speed Insights privacy
            </a>
            .
          </p>

          <h2>Local storage</h2>
          <p>
            When you change between light and dark mode, the site stores your selection in
            localStorage. The cart is also stored there so that you can continue later in
            the same browser. The cart is removed automatically if it has not been
            modified for 7 days. Its contents remain in your browser and are not sent to
            Lieromaa until you submit an order. After consent, a pseudonymous visitor
            identifier is also stored in localStorage and session information in
            sessionStorage for first-party analytics. These identifiers do not directly
            reveal your identity, but they are treated as personal data because the same
            browser can be recognised across visits while consent remains valid.
          </p>

          <h2>Cookies</h2>
          <p>
            The site does not itself use analytics cookies. After consent, first-party
            analytics uses localStorage and sessionStorage rather than cookies. Google
            AdSense and other third-party services may nevertheless use cookies for
            advertising, targeting and statistics. You can block cookies or request a
            notice when cookies are sent through your browser settings. You can withdraw
            consent at any time through the consent-management controls available in the
            site footer or through your browser settings.
          </p>

          <h2>Transfers outside the EU or EEA</h2>
          <p>
            Some services used by the site, including Google, Cloudflare, Vercel and
            potentially Zoho Mail depending on the server region used, may process data
            outside the EU or EEA. Transfers are then implemented with safeguards required
            by the GDPR, such as standard contractual clauses.
          </p>
          <p>
            You can ask the data controller for more information about the transfer
            grounds and safeguards used.
          </p>

          <h2>Recipients of data</h2>
          <p>
            Personal data is disclosed to third parties only as described above, which may
            include Cloudflare, Zoho Mail, Posti, Lieromaa’s accounting service provider,
            Google and Vercel. Messages and reviews from the relevant forms are
            transmitted to Lieromaa’s own order-management service through Vercel.
            First-party analytics data remains under Lieromaa’s control. Personal data is
            not sold or disclosed for other purposes without a lawful basis.
          </p>

          <h2>Retention periods</h2>
          <ul>
            <li>
              Order requests that are not confirmed are kept for no more than 12 months,
              unless a longer period is necessary, for example to investigate misuse.
            </li>
            <li>
              Contact and delivery data connected with confirmed orders is kept for as
              long as needed to deliver the order, provide customer service and handle
              possible complaints. Personal data connected with dispatched and cancelled
              orders is generally anonymised in the order system 12 months after dispatch
              or cancellation. Contact and address data, messages, technical request
              context, tracking number, and order, invoice and message identifiers that
              enable connections with external systems are then removed. Only non-personal
              information needed for order-history monitoring remains, such as products,
              quantities, prices, delivery method, statuses and event times.
            </li>
            <li>
              Invoice and accounting data is kept for the period required by Finnish
              accounting law. An accounting service provider may keep accounting data for
              longer where required by its own statutory obligations.
            </li>
            <li>
              Messages submitted through question and topic-suggestion forms are kept as
              long as needed to answer, process topic suggestions or develop site content,
              but no longer than 24 months without a separate basis.
            </li>
            <li>
              Reviews are kept for as long as needed to display customer reviews and
              maintain their reliability, unless a deletion request or another ground
              requires removal. When the associated order is anonymised, private feedback,
              technical request context, order linkage and moderation data are removed.
              Only published data remains from an approved review: product, star rating,
              written review, optional display name and submission time. A display name or
              other identifiable content may be removed on request.
            </li>
            <li>
              Data connected with complaints, returns and other later customer-service
              matters is kept for as long as reasonably required to handle the matter.
            </li>
            <li>
              Cancellation-notice data is kept for as long as reasonably required for
              processing, return and payment arrangements, and demonstrating compliance
              with legal obligations. Personal data in a notice linked to an order by its
              identifier is removed no later than when that order is anonymised.
            </li>
            <li>
              A data-download link is valid for no more than 24 hours and one download.
              Expired, used and revoked requests are removed. Technical identifiers used
              to limit abuse are removed within 24 hours. Anonymising an order invalidates
              any open download requests connected with it.
            </li>
            <li>
              First-party analytics data remains in Lieromaa’s SQLite database for as long
              as needed for usage monitoring and monthly reporting. Speed Insights data is
              retained under the provider’s practices.
            </li>
            <li>
              The theme selection, cart and pseudonymous visitor identifier in
              localStorage and session information in sessionStorage remain in the browser
              until you remove them, withdraw analytics consent or the browser removes
              them under its own retention practices. The site removes the cart after 7
              days of inactivity.
            </li>
          </ul>

          <h2>Information required for an order</h2>
          <p>
            Required fields on an order form are necessary to process and deliver the
            order. An order cannot be processed if that information is not supplied.
          </p>

          <h2>Your rights</h2>
          <p>You have the following rights under the GDPR:</p>
          <ul>
            <li>Right of access to your personal data (Article 15).</li>
            <li>Right to rectification (Article 16).</li>
            <li>Right to erasure, or the right to be forgotten (Article 17).</li>
            <li>Right to restriction of processing (Article 18).</li>
            <li>
              Right to object to processing (Article 21), including processing based on
              legitimate interests.
            </li>
            <li>Right to data portability (Article 20).</li>
            <li>
              Right to withdraw consent at any time (Article 7(3)), without affecting the
              lawfulness of processing carried out before withdrawal.
            </li>
          </ul>
          <p>
            You can request a downloadable copy of data connected with your order on the{' '}
            <SafeLink href="/en/data-request">Download your data</SafeLink> page. Send
            other rights requests or reports of a problem to {CONTACT_EMAIL}. Requests are
            answered within one month.
          </p>

          <h2>Right to lodge a complaint</h2>
          <p>
            If you believe that the processing of your personal data infringes the GDPR,
            you have the right to lodge a complaint with a supervisory authority such as
            the Office of the Data Protection Ombudsman in Finland at{' '}
            <a href="https://tietosuoja.fi/en/home" target="_blank" rel="noreferrer">
              tietosuoja.fi
            </a>
            .
          </p>

          <h2>Contact</h2>
          <p>If you have questions about this privacy notice, contact {CONTACT_EMAIL}.</p>
        </section>
      </div>
    </>
  );
}

export { PUBLISHED_AT, UPDATED_AT };
