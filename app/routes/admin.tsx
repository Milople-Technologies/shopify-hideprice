import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { Page, Layout, Card, TextField, Select, Button } from "@shopify/polaris";
import { authenticate } from "../utils/auth.server"; // Authentication helper

export async function loader({ request }) {
  const { session } = await authenticate(request); // Get Shopify session
  const shop = session.shop;
  const accessToken = session.accessToken;

  // Fetch metafield value
  const metafieldResponse = await fetch(
    `https://${shop}/admin/api/2024-01/metafields.json?namespace=custom_app&key=settings`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  );
  const metafieldData = await metafieldResponse.json();
  const settings = metafieldData.metafields?.[0]?.value
    ? JSON.parse(metafieldData.metafields[0].value)
    : { text: "", dropdown: "yes" };

  return json({ settings });
}

export async function action({ request }) {
  const { session } = await authenticate(request);
  const shop = session.shop;
  const accessToken = session.accessToken;
  const formData = await request.formData();

  const textValue = formData.get("text");
  const dropdownValue = formData.get("dropdown");

  // Save data in Shopify metafield
  await fetch(`https://${shop}/admin/api/2024-01/metafields.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      metafield: {
        namespace: "custom_app",
        key: "settings",
        value: JSON.stringify({ text: textValue, dropdown: dropdownValue }),
        type: "json",
      },
    }),
  });

  return redirect("/admin");
}

export default function AdminSettings() {
  const { settings } = useLoaderData();
  const [text, setText] = useState(settings.text);
  const [dropdown, setDropdown] = useState(settings.dropdown);

  return (
    <Page title="App Settings">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Form method="post">
              <TextField label="Enter Text" value={text} onChange={setText} name="text" />
              <Select
                label="Enable Feature"
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
                value={dropdown}
                onChange={setDropdown}
                name="dropdown"
              />
              <Button submit primary style={{ marginTop: "10px" }}>
                Save
              </Button>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
