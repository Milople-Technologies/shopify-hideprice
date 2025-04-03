import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import createApp from "@shopify/app-bridge";
import { getSession } from "./session.server"; // This should handle Shopify session data
import { authenticatedFetch } from "@shopify/app-bridge/utilities";
import { Redirect } from "@shopify/app-bridge/actions";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return { shop: session.shop, apiKey: process.env.SHOPIFY_API_KEY };
}

export default function App() {
  const { shop, apiKey } = useLoaderData();

  const config = {
    apiKey,
    shopOrigin: shop,
    forceRedirect: true,
  };

  return (
    <Provider config={config}>
      <AppProvider>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </AppProvider>
    </Provider>
  );
}
