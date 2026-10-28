import type { Metadata } from 'next';
import PhishingDetectorTool from '@/components/tools/PhishingDetectorTool';

export const metadata: Metadata = {
  title: 'Phishing Detector — RojTech',
  description:
    'Analyze suspicious URLs for deceptive patterns. Links are never opened or fetched automatically.',
};

export default function PhishingDetectorPage() {
  return <PhishingDetectorTool />;
}
