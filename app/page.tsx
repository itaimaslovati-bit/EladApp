import { redirect } from 'next/navigation';
import { TRIP_START, TRIP_END } from '@/lib/utils';

export default function Home() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(TRIP_START.getFullYear(), TRIP_START.getMonth(), TRIP_START.getDate());
  const end = new Date(TRIP_END.getFullYear(), TRIP_END.getMonth(), TRIP_END.getDate());
  if (today >= start && today <= end) {
    redirect('/today');
  }
  redirect('/overview');
}
