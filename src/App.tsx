import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { useEffect } from "react";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import CollapsiblePlugin from "./plugins/collapsible-plugin";
import { CollapsibleContainerNode } from "./plugins/collapsible-plugin/collapsible-contain-node";
import { CollapsibleContentNode } from "./plugins/collapsible-plugin/collapsible-content-node";
import { CollapsibleTitleNode } from "./plugins/collapsible-plugin/collapsible-title-node";
import { ImageNode } from "./nodes/images-node";
import ImagesPlugin from "./plugins/images-plugin";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

function MyOnChangePlugin(props: {
  onChange: (editorState: EditorState) => void;
}) {
  const { onChange } = props;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString: any = $generateHtmlFromNodes(editor);
        localStorage.setItem("editorContent", htmlString);
        onChange(htmlString);
      });
    });
  }, [onChange, editor]);
  return null;
}

const editorConfig = {
  namespace: "React.js Demo",
  nodes: [
    HorizontalRuleNode,
    CollapsibleContainerNode,
    CollapsibleContentNode,
    CollapsibleTitleNode,
    ImageNode,
  ],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: ExampleTheme,
};

export default function App() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MyOnChangePlugin
            onChange={(editorState: any) => {
              localStorage.setItem("editorState", editorState);
              console.log(editorState);
            }}
          />
          <HorizontalRulePlugin />
          <CollapsiblePlugin />
          <ImagesPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          {/* <TreeViewPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  );
}
