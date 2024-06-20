import { $patchStyleText } from "@lexical/selection";
import { $getSelection, LexicalEditor } from "lexical";
import { Minus, Plus } from "lucide-react";
import * as React from "react";

const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 15;

// eslint-disable-next-line no-shadow
enum updateFontSizeType {
  increment = 1,
  decrement,
}

export default function FontSize({
  selectionFontSize,
  disabled,
  editor,
}: {
  selectionFontSize: string;
  disabled: boolean;
  editor: LexicalEditor;
}) {
  const [inputValue, setInputValue] = React.useState<string>(selectionFontSize);
  const [inputChangeFlag, setInputChangeFlag] = React.useState<boolean>(false);

  /**
   * Calculates the new font size based on the update type.
   * @param currentFontSize - The current font size
   * @param updateType - The type of change, either increment or decrement
   * @returns the next font size
   */
  const calculateNextFontSize = (
    currentFontSize: number,
    updateType: updateFontSizeType | null,
  ) => {
    if (!updateType) {
      return currentFontSize;
    }

    let updatedFontSize: number = currentFontSize;
    switch (updateType) {
      case updateFontSizeType.decrement:
        if (currentFontSize > MAX_ALLOWED_FONT_SIZE) {
          updatedFontSize = MAX_ALLOWED_FONT_SIZE;
        } else if (currentFontSize >= 48) {
          updatedFontSize -= 12;
        } else if (currentFontSize >= 24) {
          updatedFontSize -= 4;
        } else if (currentFontSize >= 14) {
          updatedFontSize -= 2;
        } else if (currentFontSize > MIN_ALLOWED_FONT_SIZE) {
          updatedFontSize -= 1;
        } else {
          updatedFontSize = MIN_ALLOWED_FONT_SIZE;
        }
        break;

      case updateFontSizeType.increment:
        if (currentFontSize < MIN_ALLOWED_FONT_SIZE) {
          updatedFontSize = MIN_ALLOWED_FONT_SIZE;
        } else if (currentFontSize < 12) {
          updatedFontSize += 1;
        } else if (currentFontSize < 20) {
          updatedFontSize += 2;
        } else if (currentFontSize < 36) {
          updatedFontSize += 4;
        } else if (currentFontSize < MAX_ALLOWED_FONT_SIZE) {
          updatedFontSize += 12;
        } else {
          updatedFontSize = MAX_ALLOWED_FONT_SIZE;
        }
        break;

      default:
        break;
    }
    return updatedFontSize;
  };

  /**
   * Patches the selection with the updated font size.
   */

  const updateFontSizeInSelection = React.useCallback(
    (newFontSize: string | null, updateType: updateFontSizeType | null) => {
      const getNextFontSize = (prevFontSize: string | null): string => {
        if (!prevFontSize) {
          prevFontSize = `${DEFAULT_FONT_SIZE}px`;
        }
        prevFontSize = prevFontSize.slice(0, -2);
        const nextFontSize = calculateNextFontSize(
          Number(prevFontSize),
          updateType,
        );
        return `${nextFontSize}px`;
      };

      editor.update(() => {
        if (editor.isEditable()) {
          const selection = $getSelection();
          if (selection !== null) {
            const nextFontSize =
              newFontSize || getNextFontSize(selectionFontSize);
            setInputValue(nextFontSize.slice(0, -2)); // Update the input value
            $patchStyleText(selection, {
              "font-size": nextFontSize,
            });
          }
        }
      });
    },
    [editor, selectionFontSize],
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValueNumber = Number(inputValue);

    if (["e", "E", "+", "-"].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault();
      setInputValue("");
      return;
    }
    setInputChangeFlag(true);
    if (e.key === "Enter" || e.key === "Tab" || e.key === "Escape") {
      e.preventDefault();

      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleInputBlur = () => {
    if (inputValue !== "" && inputChangeFlag) {
      const inputValueNumber = Number(inputValue);
      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleButtonClick = (updateType: updateFontSizeType) => {
    if (inputValue !== "") {
      const nextFontSize = calculateNextFontSize(
        Number(inputValue),
        updateType,
      );
      console.log("FONT SIZE: ", String(nextFontSize) + "px");
      updateFontSizeInSelection(String(nextFontSize) + "px", null);
    } else {
      updateFontSizeInSelection(null, updateType);
    }
  };

  const updateFontSizeByInputValue = (inputValueNumber: number) => {
    let updatedFontSize = inputValueNumber;
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE;
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE;
    }

    setInputValue(String(updatedFontSize));
    updateFontSizeInSelection(String(updatedFontSize) + "px", null);
    setInputChangeFlag(false);
  };

  React.useEffect(() => {
    setInputValue(selectionFontSize);
  }, [selectionFontSize]);

  return (
    <>
      <button
        type="button"
        disabled={
          disabled ||
          (selectionFontSize !== "" &&
            Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)
        }
        onClick={() => handleButtonClick(updateFontSizeType.decrement)}
        className="toolbar-item mr-1 p-0"
      >
        <Minus className="size-4" />
      </button>

      <input
        type="number"
        value={inputValue}
        disabled={disabled}
        className="toolbar-item text-center"
        min={MIN_ALLOWED_FONT_SIZE}
        max={MAX_ALLOWED_FONT_SIZE}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        onBlur={handleInputBlur}
      />

      <button
        type="button"
        disabled={
          disabled ||
          (selectionFontSize !== "" &&
            Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)
        }
        onClick={() => handleButtonClick(updateFontSizeType.increment)}
        className="toolbar-item ml-1 p-0"
      >
        <Plus className="size-4" />
      </button>
    </>
  );
}
