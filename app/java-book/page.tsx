import { redirect } from 'next/navigation';

/** Short phone-friendly entry: /java-book → image reader */
export default function JavaBookRedirectPage() {
  redirect('/book-viewer.html?id=java-kurdish-rojtech');
}
