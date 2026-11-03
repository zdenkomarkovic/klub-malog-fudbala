export default function LoadingPage() {
  return (
    <div role="status" aria-label="Učitavanje..." className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-50 border-t-brand-600" />
    </div>
  );
}
