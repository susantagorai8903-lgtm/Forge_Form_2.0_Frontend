export function ContentNotice({ message, error = false }: { message: string; error?: boolean }) {
  return <p className="empty-state" role={error ? "alert" : "status"}>{message}</p>;
}
