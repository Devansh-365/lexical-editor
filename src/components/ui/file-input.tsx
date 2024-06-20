type Props = Readonly<{
  "data-test-id"?: string;
  accept?: string;
  label: string;
  onChange: (files: FileList | null) => void;
}>;

export default function FileInput({
  accept,
  label,
  onChange,
  "data-test-id": dataTestId,
}: Props): JSX.Element {
  return (
    <div className="flex flex-row items-center mb-2.5">
      <label className="flex-1 text-gray-600">{label}</label>
      <input
        type="file"
        accept={accept}
        className="flex-2 border border-gray-600 py-1.5 px-2.5 text-base rounded min-w-0"
        onChange={(e) => onChange(e.target.files)}
        data-test-id={dataTestId}
      />
    </div>
  );
}
