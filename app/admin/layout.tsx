import '../tools/tools.css';
import ToolsChrome from '@/components/tools/ToolsChrome';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ToolsChrome>{children}</ToolsChrome>;
}
