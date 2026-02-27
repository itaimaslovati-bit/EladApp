'use client';

import { LargeTitle } from '@/components/ui/LargeTitle';
import { MoreSheet } from '@/components/ui/MoreSheet';
import { PageTransition } from '@/components/ui/PageTransition';

export default function MorePage() {
  return (
    <PageTransition className="pb-6 overflow-touch">
      <LargeTitle title="More" subtitle="Guides & tools" />
      <div className="px-4 pt-4">
        <MoreSheet />
      </div>
    </PageTransition>
  );
}
