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
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search events..."
        className="w-full rounded-xl border border-white/[0.06] bg-surface px-4 py-2.5 text-sm text-white shadow-sm outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}
