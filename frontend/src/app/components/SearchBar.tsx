type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <label htmlFor="event-search" className="sr-only">
        Search events
      </label>
      <input
        id="event-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search events..."
        className="w-full rounded-md border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-300"
      />
    </div>
  );
}
