export default function Button({
  width = 'auto',
  height = 'auto',
  children,
}: {
  width?: string;
  height?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`bg-[rgb(193,56,44)] text-white font-bold py-2 px-4 rounded`}
      style={{ width, height }}
    >
      {children}
    </button>
  );
}
