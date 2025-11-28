import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface WidgetItem {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: string;
  visible?: boolean;
  description?: string;
}

interface DashboardWidgetsProps {
  widgets: WidgetItem[];
  className?: string;
}

export function DashboardWidgets({ widgets, className = "" }: DashboardWidgetsProps) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {widgets
        .filter(widget => widget.visible !== false)
        .map((widget) => (
          <Card key={widget.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {widget.title}
              </CardTitle>
              {widget.icon && <div className={`h-4 w-4 ${widget.color || 'text-muted-foreground'}`}>
                {widget.icon}
              </div>}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widget.value}</div>
              {widget.change && (
                <p className={`text-xs ${widget.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {widget.change} from last month
                </p>
              )}
              {widget.description && (
                <p className="text-xs text-muted-foreground">
                  {widget.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default DashboardWidgets;
