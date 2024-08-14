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
      className={`rounded-lg bg-[rgb(193,56,44)] px-11 py-2 font-bold text-white`}
      style={{
        width,
        height,
      }}
    >
      {children}
    </button>
  );
}
