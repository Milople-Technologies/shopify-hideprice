// app/routes/admin.metafields.jsx
import { json } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { Card, TextField, Checkbox, Button } from "@shopify/polaris";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  return json({ success: true });
}

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const productId = formData.get("productId");

  const metafields = [
    {
      namespace: "custom",
      key: "hide_price_button_text",
      value: formData.get("hidePriceButtonText") || "Contact for Price",
      type: "single_line_text_field",
      ownerId: productId,
    },
    {
      namespace: "custom",
      key: "hide_price_enabled",
      value: formData.get("hidePriceEnabled") === "true" ? "true" : "false",
      type: "boolean",
      ownerId: productId,
    },
  ];

  await admin.graphql(`
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: { metafields },
  });

  return json({ success: true });
}

export default function MetafieldsPage() {
  const { success } = useLoaderData();
  const actionData = useActionData();

  return (
    <Card sectioned>
      <Form method="post">
        <TextField
          label="Product ID"
          name="productId"
          placeholder="gid://shopify/Product/123456789"
        />
        <TextField
          label="Hide Price Button Text"
          name="hidePriceButtonText"
          placeholder="Contact for Price"
        />
        <Checkbox
          label="Enable Hide Price"
          name="hidePriceEnabled"
          value="true"
        />
        <Button submit primary>Save Metafields</Button>
      </Form>
      {actionData?.success && <p>Metafields saved successfully!</p>}
    </Card>
  );
}