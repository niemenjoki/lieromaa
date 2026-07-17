import classes from '@/app/(fi)/tilausehdot/Tilausehdot.module.css';
import SafeLink from '@/components/SafeLink/SafeLink';
import { formatDate } from '@/lib/i18n/formatters.mjs';
import { getCommerceMessages } from '@/lib/i18n/messages.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import {
  BUSINESS_ADDRESS_LINES,
  BUSINESS_ID,
  BUSINESS_NAME,
  CONTACT_PHONE,
  ORDER_CONTACT_EMAIL,
  ORDER_WHATSAPP_URL,
} from '@/lib/site/contact';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const PUBLISHED_AT = '2026-07-17';
const UPDATED_AT = '2026-07-17';
const EFFECTIVE_FROM = '2026-07-17';

const pageMetadata = {
  language: 'en',
  title: 'Order and delivery terms | Lieromaa',
  description:
    'Read Lieromaa’s English terms for ordering, invoicing, delivery within Finland, cancellation, returns, defects and dispute resolution.',
  canonicalUrl: '/en/order-and-delivery-terms',
};

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

export default function EnglishOrderTermsPage() {
  const shippingCopy = getCommerceMessages('en').shippingSchedule;
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'Lieromaa order and delivery terms',
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

      <div className={classes.OrderPolicyPage}>
        <header>
          <h1>Order and delivery terms</h1>
          <p>
            <em>Effective from {formatDate(EFFECTIVE_FROM, 'en')}.</em>
          </p>
        </header>

        <div>
          <h2>Delivery within Finland only</h2>
          <p>
            I deliver to addresses and Posti pickup points in Finland. I do not ship
            abroad. Local pickup is available in Järvenpää.
          </p>
        </div>

        <section>
          <h2>General</h2>
          <p>
            Lieromaa is operated by <strong>{BUSINESS_NAME}</strong> (Business ID{' '}
            {BUSINESS_ID}). Sales are exempt from value added tax under Chapter 2, section
            3 of the Finnish Value Added Tax Act because the activity is small in scale. I
            reserve the right to change prices and delivery terms. The terms applicable to
            an order are those presented when the order is placed.
          </p>

          <h2>Seller and customer service details</h2>
          <p>
            Seller: <strong>{BUSINESS_NAME}</strong>
            <br />
            Business ID: <strong>{BUSINESS_ID}</strong>
            <br />
            Address: <strong>{BUSINESS_ADDRESS_LINES.join(', ')}</strong>
            <br />
            Email: <strong>{ORDER_CONTACT_EMAIL}</strong>
            <br />
            Telephone / WhatsApp: <strong>{CONTACT_PHONE}</strong>
          </p>
          <p>
            Please send questions about orders, delivery, returns, complaints and other
            customer-service matters primarily by email to{' '}
            <strong>{ORDER_CONTACT_EMAIL}</strong>.
          </p>

          <h2>Placing an order</h2>
          <p>
            Products are ordered primarily through the order forms on the website. You may
            also place an order by email or instant message.
          </p>
          <p>
            Every order is confirmed manually, normally within 1–2 working days after
            availability has been checked. Holiday or absence notices shown separately on
            the website may postpone processing, confirmation and delivery until after
            that period. The confirmation states the order price, delivery charge and
            products ordered.
          </p>
          <p>
            The delivery methods currently available are shown during checkout. They may
            include collection from a Posti pickup point or parcel locker, Posti home
            delivery at an agreed time, and local pickup in Järvenpää. A pickup-point
            parcel is normally sent to the point selected by the customer, but Posti may
            redirect it elsewhere because of capacity or another operational reason.
          </p>

          <h2>Payment</h2>
          <p>
            Payment is made by invoice, which I send directly to the email address
            provided with the order. The payment term is 7 days.
          </p>
          <p>
            For Posti pickup-point and home-delivery orders, I send the invoice after
            handing the order to Posti. For local pickup, I send it after you have
            collected the order.
          </p>
          <p>
            A reminder may be sent for an unpaid invoice. A debt that remains unpaid may
            be transferred for collection in accordance with applicable law. Statutory
            default interest and lawful reminder and collection costs may be charged. I
            reserve the right not to accept a new order from a customer who has an open or
            overdue debt, or a debt that has been referred for collection.
          </p>

          <h2>Delivery time</h2>
          <p>
            {shippingCopy.mondayOnly} {shippingCopy.worms} {shippingCopy.compostChow} A
            worm or compost-fibre-mix order placed on Sunday or Monday is dispatched on
            Monday of the following week. {shippingCopy.preparedWormBin} A ready-to-use
            worm bin is therefore not dispatched on the next Monday or the Monday after
            that, but on the third Monday following the order date.
          </p>
          <p>The exact delivery schedule is always stated in the confirmation.</p>
          <p>
            Parcels sent to Posti pickup points normally arrive 1–2 working days after
            dispatch. For home delivery, Posti arranges the delivery time with the
            recipient. Please collect a pickup-point parcel as soon as reasonably possible
            after receiving the arrival notice.
          </p>
          <p>
            If pickup-point search is temporarily unavailable during checkout, you may
            write your preferred Posti pickup location in the message field. The pickup
            point will then be assigned manually while the order is processed. You may
            also leave the pickup point unselected, in which case the parcel is routed
            using the postcode supplied with the order.
          </p>

          <h2>Right to cancel and cancellation instructions</h2>
          <p>
            A consumer generally has a 14-day right to cancel a distance contract under
            the Finnish Consumer Protection Act. The cancellation period begins when the
            goods are received.
          </p>
          <p>
            If you wish to notify Lieromaa of a cancellation for a reason other than a
            defect, you may use the{' '}
            <SafeLink href="/en/cancel-order">Cancel order</SafeLink> form in the English
            customer-service area or email <strong>{ORDER_CONTACT_EMAIL}</strong>. An
            automatic email acknowledges receipt of a form submission. The acknowledgement
            only confirms receipt; I will respond separately about any return or payment
            arrangements, depending on the order’s status and contents.
          </p>
          <p>
            A dispatched worm order cannot be cancelled because live compost worms cannot
            be handled or resold as an ordinary product after being returned. The normal
            cancellation right still applies to other products, even when they are ordered
            together with worms.
          </p>
          <p>
            A returned product must be substantially in the same condition as when it was
            received. The customer pays the return costs unless agreed otherwise. Before
            sending a return, contact <strong>{ORDER_CONTACT_EMAIL}</strong> so that the
            return method can be agreed. If you use the cancellation form, you do not need
            to send a separate email; I will contact you after receiving the notice.
          </p>
          <p>
            The cancellation form is not the primary channel for a defect in a product or
            delivery. In that situation, email <strong>{ORDER_CONTACT_EMAIL}</strong>,
            call or WhatsApp <strong>{CONTACT_PHONE}</strong>, or contact me{' '}
            <a href={ORDER_WHATSAPP_URL} target="_blank" rel="noreferrer">
              through WhatsApp
            </a>
            . I will investigate and correct the problem separately.
          </p>
          <p>
            If you exercise the right to cancel by email, include where possible your
            name, order number or another identifier, the products ordered, the order or
            receipt date, and whether you wish to cancel all or part of the order.
          </p>

          <h2>Liability for defects</h2>
          <p>
            Products are covered by the statutory liability for defects under the Finnish
            Consumer Protection Act. If a delivered product is defective, damaged or not
            as agreed, contact <strong>{ORDER_CONTACT_EMAIL}</strong> without delay so
            that I can investigate the matter and arrange an appropriate refund,
            correction, replacement delivery or other lawful remedy.
          </p>

          <h2>Disagreements and dispute resolution</h2>
          <p>
            I aim to resolve disagreements directly with the customer first. If a dispute
            concerning a sales contract cannot be resolved through negotiation, a consumer
            may contact Finnish Consumer Advisory Services at{' '}
            <a
              href="https://www.kkv.fi/en/consumer-affairs/consumer-advisory-services/"
              target="_blank"
              rel="noreferrer"
            >
              kkv.fi/en/consumer-affairs/consumer-advisory-services
            </a>{' '}
            and, where necessary, refer the matter to the Finnish Consumer Disputes Board
            at{' '}
            <a href="https://www.kuluttajariita.fi/en/" target="_blank" rel="noreferrer">
              kuluttajariita.fi/en
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}

export { EFFECTIVE_FROM, PUBLISHED_AT, UPDATED_AT };
