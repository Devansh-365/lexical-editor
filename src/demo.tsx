import { useEffect, useState } from "react";

export default function DemoPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  return (
    <div className="container mx-auto mb-2">
      <div className="max-w-4xl mx-auto">
        <div
          className="block min-h-96 rounded-lg border-0 bg-white p-3 text-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </div>
  );
}
