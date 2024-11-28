interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className="grid items-start gap-8 m-3" {...props}>
      {children}
    </div>
  );
}
