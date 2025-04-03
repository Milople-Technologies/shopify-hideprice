import { useState } from "react";
import { Page, Layout, Card, FormLayout, TextField, Select, Button, Frame, AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";

export default function AdminSettings() {
  const [textValue, setTextValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("option1");

  const handleSubmit = async () => {
    console.log("Saving Data:", { textValue, dropdownValue });
    alert("Settings Saved!");
  };

  return (
    <AppProvider>
      <Frame>
        <Page title="Hide Price Settings">
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <FormLayout>
                  <TextField label="Custom Text" value={textValue} onChange={setTextValue} />
                  <Select
                    label="Select Option"
                    options={[
                      { label: "Option 1", value: "option1" },
                      { label: "Option 2", value: "option2" },
                    ]}
                    value={dropdownValue}
                    onChange={setDropdownValue}
                  />
                  <Button primary onClick={handleSubmit}>
                    Save Settings
                  </Button>
                </FormLayout>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    </AppProvider>
  );
}
