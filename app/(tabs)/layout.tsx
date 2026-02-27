import { TabBar } from '@/components/ui/TabBar';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen max-w-[640px] mx-auto">
        {children}
      </main>
      <TabBar />
    </>
  );
}
