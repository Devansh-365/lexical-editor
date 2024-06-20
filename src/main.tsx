import "./styles.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import DemoPage from "./demo.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="text-center">
      <h1 className="text-4xl mt-20 mb-12 text-red-500 underline">
        Helium Editor
      </h1>
      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="demo">Demo</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <App />
        </TabsContent>
        <TabsContent value="demo">
          <DemoPage />
        </TabsContent>
      </Tabs>
    </div>
  </React.StrictMode>,
);
