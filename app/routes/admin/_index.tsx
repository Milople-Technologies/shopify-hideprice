import { useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import { Card, Page, TextField, Select, Button } from "@shopify/polaris";
import { json, redirect } from "@remix-run/node";
import shopify from "~/shopify.server";
import { getSession } from "~/utils/session.server";

// Loader function to fetch saved values
export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const shop = session.get("shop");

  if (!shop) return redirect("/auth/login");

  const client = new shopify.api.clients.Graphql({ session });
  const response = await client.query({
    data: `{
      shop {
        metafield(namespace: "custom", key: "settings") {
          value
        }
      }
    }`,
  });

  const savedData = response.body.data.shop.metafield
    ? JSON.parse(response.body.data.shop.metafield.value)
    : { textValue: "", dropdownValue: "" };

  return json(savedData);
};

// Action function to save settings
export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const shop = session.get("shop");

  if (!shop) return redirect("/auth/login");

  const formData = await request.formData();
  const customText = formData.get("customText");
  const customDropdown = formData.get("customDropdown");

  const client = new shopify.api.clients.Graphql({ session });
  await client.query({
    data: `mutation {
      metafieldsSet(metafields: [{
        namespace: "custom",
        key: "settings",
        type: "json",
        value: "{ \\"textValue\\": \\"${customText}\\", \\"dropdownValue\\": \\"${customDropdown}\\" }"
      }]) {
        userErrors {
          field
          message
        }
      }
    }`,
  });

  return redirect("/admin");
};

// Admin Settings Page Component
export default function AdminSettings() {
  const { textValue, dropdownValue } = useLoaderData();
  const [text, setText] = useState(textValue || "");
  const [dropdown, setDropdown] = useState(dropdownValue || "");

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  return (
    <Page title="Admin Settings">
      <Card sectioned>
        <Form method="post">
          <TextField label="Custom Text" value={text} onChange={setText} name="customText" />
          <Select label="Custom Dropdown" options={options} value={dropdown} onChange={setDropdown} name="customDropdown" />
          <Button submit primary>Save</Button>
        </Form>
      </Card>
    </Page>
  );
}
