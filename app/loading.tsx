export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#E7E5E4] border-t-accent rounded-full animate-spin" />
      <p className="mt-4 text-sm text-[#78716C]">Loading...</p>
    </div>
  );
}
