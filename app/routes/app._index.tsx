// app/routes/app._index.jsx
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  const productId = "gid://shopify/Product/123456789"; // Replace with dynamic ID logic

  const response = await admin.graphql(`
    query {
      product(id: "${productId}") {
        id
        title
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        metafield(namespace: "custom", key: "hide_price_button_text") {
          value
        }
        metafield(namespace: "custom", key: "hide_price_enabled") {
          value
        }
      }
    }
  `);

  const { data } = await response.json();
  return json({ product: data.product });
}

export default function Index() {
  const { product } = useLoaderData();

  const hidePriceEnabled = product.metafield?.[1]?.value === "true";
  const hidePriceButtonText = product.metafield?.[0]?.value || "Contact for Price";

  return (
    <div>
      <h1>{product.title}</h1>
      {hidePriceEnabled ? (
        <p>{hidePriceButtonText}</p>
      ) : (
        <p>
          Price: {product.priceRangeV2.minVariantPrice.amount}{" "}
          {product.priceRangeV2.minVariantPrice.currencyCode}
        </p>
      )}
    </div>
  );
}