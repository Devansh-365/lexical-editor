import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown";
import ReactGPicker from "react-gcolor-picker";

interface ColorPickerProps {
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string | JSX.Element;
  color?: string;
  onChange: (color: string) => void;
  title?: string;
  type: "bg" | "text";
}

export default function ColorPickerDropdown({
  color,
  onChange,
  type,
}: Readonly<ColorPickerProps>): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="mx-1">
          {type === "bg" ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" fill="white" fillOpacity="0.01" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M37 37C39.2091 37 41 35.2091 41 33C41 31.5272 39.6667 29.5272 37 27C34.3333 29.5272 33 31.5272 33 33C33 35.2091 34.7909 37 37 37Z"
                fill="#777"
              />
              <path
                d="M20.8535 5.50439L24.389 9.03993"
                stroke="#777"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M23.6818 8.33281L8.12549 23.8892L19.4392 35.2029L34.9955 19.6465L23.6818 8.33281Z"
                stroke="#777"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M12 20.0732L28.961 25.6496"
                stroke="#777"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M4 43H44"
                stroke="#777"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="14"
              height="14"
              viewBox="0 0 512 512"
            >
              <path
                fill="#777"
                d="M221.631 109L109.92 392h58.055l24.079-61h127.892l24.079 61h58.055L290.369 109Zm-8.261 168L256 169l42.63 108Z"
              ></path>
            </svg>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2">
        <ReactGPicker
          colorBoardHeight={120}
          debounce
          debounceMS={300}
          format="rgb"
          gradient
          onChange={(val) => {
            console.log("VALUE: ", val);
            onChange(val);
          }}
          popupWidth={267}
          showAlpha
          solid
          value={color as string}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
