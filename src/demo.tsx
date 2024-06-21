import { useEffect, useState } from "react";
import { createEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import Nodes from "./nodes";

export default function DemoPage() {
  const [content, setContent] = useState("");
  const editor = createEditor({
    nodes: [...Nodes],
  });

  useEffect(() => {
    const savedEditorState = localStorage.getItem("editorState");
    if (savedEditorState) {
      const jsonEditorState = JSON.parse(savedEditorState);

      editor.update(() => {
        const editorState = editor.parseEditorState(jsonEditorState);
        const htmlString = editorState.read(() =>
          $generateHtmlFromNodes(editor)
        );
        setContent(htmlString);
      });
    }
  }, [editor]);

  return (
    <div className="container mx-auto mb-2">
      <div className="max-w-4xl mx-auto">
        <div
          className="block min-h-96 rounded-lg border-0 bg-white p-3 text-gray-800 text-start"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </div>
  );
}
