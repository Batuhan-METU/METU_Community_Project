export default function CategoryTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  // Re-mounted per category navigation for subtle transition feel.
  return <div className="animate-fade-in-up">{children}</div>;
}
