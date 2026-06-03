import { createBrowserRouter } from "react-router";
import { Root } from "./components/root";
import { LandingPage } from "./pages/landing-page";
import { UploadPage } from "./pages/upload-page";
import { VerifyPage } from "./pages/verify-page";
import { ProvenanceGraphPage } from "./pages/provenance-graph-page";
import { MediaDetailPage } from "./pages/media-detail-page";
import { ExtensionPage } from "./pages/extension-page";
import { ApiPage } from "./pages/api-page";
import { ExplorerPage } from "./pages/explorer-page";
import { ZkLoginCallbackPage } from "./pages/zklogin-callback-page";
import { OrgPage } from "./pages/org-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,              Component: LandingPage },
      { path: "upload",           Component: UploadPage },
      { path: "verify",           Component: VerifyPage },
      { path: "graph/:id",        Component: ProvenanceGraphPage },
      { path: "graph",            Component: ProvenanceGraphPage },
      { path: "media/:id",        Component: MediaDetailPage },
      { path: "extension",        Component: ExtensionPage },
      { path: "api",              Component: ApiPage },
      { path: "explorer",         Component: ExplorerPage },
      { path: "org",              Component: OrgPage },
      { path: "zklogin/callback", Component: ZkLoginCallbackPage },
    ],
  },
]);