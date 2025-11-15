import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Shield, Trash2, Edit, Plus } from "lucide-react";

interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changes: any;
  created_at: string;
  admin_name?: string;
}

export const AdminAuditLog = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["admin-audit-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_audit_log")
        .select(`
          *,
          profiles!admin_audit_log_admin_id_fkey(name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as any[];
    },
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "INSERT":
        return <Plus className="h-4 w-4" />;
      case "UPDATE":
        return <Edit className="h-4 w-4" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "INSERT":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "UPDATE":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "DELETE":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading audit log...</div>;
  }

  if (!logs || logs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Audit Logs</h3>
        <p className="text-muted-foreground">Admin actions will be logged here</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Shield className="h-6 w-6" />
        Admin Audit Log
      </h2>

      <ScrollArea className="h-[600px]">
        <div className="space-y-2">
          {logs.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Badge className={getActionColor(log.action)}>
                    <span className="flex items-center gap-1">
                      {getActionIcon(log.action)}
                      {log.action}
                    </span>
                  </Badge>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.entity_type}</span>
                      {log.entity_id && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {log.entity_id.slice(0, 8)}...
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      By: {log.profiles?.name || log.profiles?.email || "Unknown"}
                    </div>

                    {log.changes && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          View changes
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.changes, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-right whitespace-nowrap">
                  {format(new Date(log.created_at), "MMM d, yyyy")}
                  <br />
                  {format(new Date(log.created_at), "HH:mm:ss")}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
