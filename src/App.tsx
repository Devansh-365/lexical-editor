import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { useEffect } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import CollapsiblePlugin from "./plugins/collapsible-plugin";
import ImagesPlugin from "./plugins/images-plugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import Nodes from "./nodes";

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

        // Get JSON representation of the editor state and log it
        const jsonState = editorState.toJSON();
        localStorage.setItem("editorState", JSON.stringify(jsonState));
        console.log("Editor State in JSON format:", jsonState);
      });
    });
  }, [onChange, editor]);
  return null;
}

function LoadInitialContentPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const storedEditorState = localStorage.getItem("editorState");
    if (storedEditorState) {
      const jsonEditorState = JSON.parse(storedEditorState);
      editor.update(() => {
        const editorState = editor.parseEditorState(jsonEditorState);
        editor.setEditorState(editorState);
      });
    } else {
      const storedContent = localStorage.getItem("editorContent");
      if (storedContent) {
        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(storedContent, "text/html");
          const nodes: any = $generateNodesFromDOM(editor, dom);
          const root = editor.getRootElement();
          root?.append(nodes);
        });
      }
    }
  }, [editor]);

  return null;
}

const editorConfig = {
  namespace: "Helium Editor",
  nodes: [...Nodes],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: ExampleTheme,
};

export default function HomePage() {
  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="max-w-4xl mx-auto rounded-md relative">
          <ToolbarPlugin />
          <div className="bg-white relative text-start min-h-96">
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
            <LoadInitialContentPlugin />
            <HorizontalRulePlugin />
            <CollapsiblePlugin />
            <ImagesPlugin />
            <CheckListPlugin />
            <ListPlugin />
            <HistoryPlugin />
            <AutoFocusPlugin />
            {/* <TreeViewPlugin /> */}
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}
