import { Link } from "@remix-run/react";
import { Page, Layout, Card } from "@shopify/polaris";

export default function Index() {
  return (
    <Page title="Hide Price App">
      <Layout>
        <Layout.Section>
          <Card title="Go to Admin Page" sectioned>
            <Link to="/admin">Click Here to Configure</Link>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
