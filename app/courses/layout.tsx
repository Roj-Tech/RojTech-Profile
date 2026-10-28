import '../tools/tools.css';
import ToolsChrome from '@/components/tools/ToolsChrome';

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <ToolsChrome>{children}</ToolsChrome>;
}
