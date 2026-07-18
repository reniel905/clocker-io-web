export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-1 items-center justify-center bg-surface-container-low px-4 py-12">
      {children}
    </div>
  );
}
