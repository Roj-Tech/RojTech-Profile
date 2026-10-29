import { redirect } from 'next/navigation';

/** Old phone shortcut — send people back into the normal book flow. */
export default function JavaBookRedirectPage() {
  redirect('/courses/java-kurdish-rojtech');
}
