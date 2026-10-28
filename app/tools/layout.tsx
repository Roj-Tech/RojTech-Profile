import './tools.css';
import ToolsChrome from '@/components/tools/ToolsChrome';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <ToolsChrome>{children}</ToolsChrome>;
}
