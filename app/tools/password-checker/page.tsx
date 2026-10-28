import type { Metadata } from 'next';
import PasswordCheckerTool from '@/components/tools/PasswordCheckerTool';

export const metadata: Metadata = {
  title: 'Password Checker — RojTech',
  description:
    'Analyze password strength locally in your browser and generate strong random passwords. Nothing is sent to the server.',
};

export default function PasswordCheckerPage() {
  return <PasswordCheckerTool />;
}
