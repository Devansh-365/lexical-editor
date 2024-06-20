import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $isRootOrShadowRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  NodeKey,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import FontSize from "./fontSize";
import {
  Heading1,
  Heading2,
  Heading3,
  Image,
  PlusCircle,
  Rows2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown";
import { Button } from "../components/ui/button";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_COLLAPSIBLE_COMMAND } from "./collapsible-plugin";
import { InsertImageDialog } from "./images-plugin";
import useModal from "../hooks/useModal";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $isListNode,
  ListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createCodeNode, $isCodeNode, CODE_LANGUAGE_MAP } from "@lexical/code";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import ColorPickerDropdown from "../components/ui/color-picker";

const LowPriority = 1;

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

const rootTypeToRootName = {
  root: "Root",
  table: "Table",
};

function Divider() {
  return <div className="divider" />;
}

function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        let selection: any = $getSelection();

        if ($isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="mx-1">
          {blockTypeToBlockName[blockType]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            // className={"item " + dropDownActiveClass(blockType === "paragraph")}
            onClick={formatParagraph}
          >
            <i className="icon paragraph" />
            <span className="text">Normal</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // className={"item " + dropDownActiveClass(blockType === "h1")}
            onClick={() => formatHeading("h1")}
          >
            <Heading1 className="mr-2 size-5" />
            <span className="text">Heading 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // className={"item " + dropDownActiveClass(blockType === "h2")}
            onClick={() => formatHeading("h2")}
          >
            <Heading2 className="mr-2 size-5" />
            <span className="text">Heading 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // className={"item " + dropDownActiveClass(blockType === "h3")}
            onClick={() => formatHeading("h3")}
          >
            <Heading3 className="mr-2 size-5" />
            <span className="text">Heading 3</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // className={"item " + dropDownActiveClass(blockType === "bullet")}
            onClick={formatBulletList}
          >
            <i className="icon bullet-list" />
            <span className="text">Bullet List</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // className={"item " + dropDownActiveClass(blockType === "number")}
            onClick={formatNumberedList}
          >
            <i className="icon numbered-list" />
            <span className="text">Numbered List</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // className={"item " + dropDownActiveClass(blockType === "check")}
            onClick={formatCheckList}
          >
            <i className="icon check-list" />
            <span className="text">Check List</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // className={"item " + dropDownActiveClass(blockType === "quote")}
            onClick={formatQuote}
          >
            <i className="icon quote" />
            <span className="text">Quote</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // className={"item " + dropDownActiveClass(blockType === "code")}
            onClick={formatCode}
          >
            <i className="icon code" />
            <span className="text">Code Block</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [activeEditor, setActiveEditor] = useState(editor);
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>("root");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [fontSize, setFontSize] = useState<string>("15px");
  const [modal, showModal] = useModal();
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [fontColor, setFontColor] = useState<string>("#000");
  const [bgColor, setBgColor] = useState<string>("#fff");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000"),
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff",
        ),
      );

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            // setCodeLanguage(
            //   language ? CODE_LANGUAGE_MAP[language] || language : "",
            // );
            return;
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor],
  );

  const isGradient = (value: string) => {
    const gradientPattern = /(linear|radial)-gradient\((.+)\)/;
    return gradientPattern.test(value);
  };

  const onFontColorSelect = useCallback(
    (value: string) => {
      if (isGradient(value)) {
        applyStyleText({
          background: value,
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        });
      } else {
        applyStyleText({
          color: value,
          background: "none",
          "-webkit-background-clip": "initial",
          "-webkit-text-fill-color": "initial",
        });
      }
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      if (isGradient(value)) {
        applyStyleText({ "background-image": value });
      } else {
        applyStyleText({ "background-color": value });
      }
    },
    [applyStyleText],
  );

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      <BlockFormatDropDown
        disabled={!isEditable}
        blockType={blockType}
        rootType={rootType}
        editor={editor}
      />
      <Divider />
      <FontSize
        selectionFontSize={fontSize.slice(0, -2)}
        editor={activeEditor}
        disabled={false}
      />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        <i className="format bold" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        <i className="format underline" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <i className="format left-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <i className="format center-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <i className="format right-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
      </button>{" "}
      <Divider />
      <ColorPickerDropdown
        buttonClassName="toolbar-item color-picker"
        buttonAriaLabel="Formatting text color"
        buttonIconClassName="icon font-color"
        color={fontColor}
        onChange={onFontColorSelect}
        title="text color"
        type="text"
      />
      <ColorPickerDropdown
        buttonClassName="toolbar-item color-picker"
        buttonAriaLabel="Formatting background color"
        buttonIconClassName="icon bg-color"
        color={bgColor}
        onChange={onBgColorSelect}
        title="bg color"
        type="bg"
      />
      <Divider />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <PlusCircle className="size-4 mr-2" /> Insert
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                showModal("Insert Image", (onClose) => (
                  <InsertImageDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ));
              }}
            >
              <Image className="size-4 mr-2" />
              <span>Image</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined,
                );
              }}
            >
              <Rows2 className="size-4 mr-2" />
              <span>Horizontal Rule</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
              }}
            >
              <Image className="size-4 mr-2" />
              <span>Collapsible container</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {modal}
    </div>
  );
}
