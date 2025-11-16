import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Shield, Trash2, Edit, Plus, Download, Search, Filter, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";

interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changes: any;
  created_at: string;
  profiles?: {
    name: string | null;
    email: string | null;
  };
}

export const EnhancedAuditLog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ["admin-audit-log"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_audit_log")
        .select(`
          *,
          profiles!admin_audit_log_admin_id_fkey(name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
  });

  // Filter logs
  const filteredLogs = useMemo(() => {
    if (!logs) return [];

    return logs.filter(log => {
      const matchesSearch = searchQuery === "" ||
        log.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.profiles?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      const matchesEntity = entityFilter === "all" || log.entity_type === entityFilter;

      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [logs, searchQuery, actionFilter, entityFilter]);

  // Get unique entity types and actions for filters
  const entityTypes = useMemo(() => {
    if (!logs) return [];
    return Array.from(new Set(logs.map(log => log.entity_type))).sort();
  }, [logs]);

  const actions = useMemo(() => {
    if (!logs) return [];
    return Array.from(new Set(logs.map(log => log.action))).sort();
  }, [logs]);

  // Pagination
  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    hasPrevPage,
    hasNextPage
  } = usePagination({
    data: filteredLogs,
    itemsPerPage: 50
  });

  // Export to CSV
  const exportToCSV = () => {
    if (!filteredLogs || filteredLogs.length === 0) {
      toast.error("No logs to export");
      return;
    }

    const headers = ["Timestamp", "Admin", "Action", "Entity Type", "Entity ID"];
    const rows = filteredLogs.map(log => [
      format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss"),
      log.profiles?.name || log.profiles?.email || "Unknown",
      log.action,
      log.entity_type,
      log.entity_id || "N/A"
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Audit log exported successfully");
  };

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

  const clearFilters = () => {
    setSearchQuery("");
    setActionFilter("all");
    setEntityFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || actionFilter !== "all" || entityFilter !== "all";

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading audit log...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Admin Audit Log
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            disabled={!filteredLogs || filteredLogs.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {[searchQuery !== "", actionFilter !== "all", entityFilter !== "all"].filter(Boolean).length}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {actions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entity Type</label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {entityTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {startIndex}-{endIndex} of {totalItems} logs
        </span>
        {hasActiveFilters && (
          <span>
            Filtered from {logs?.length || 0} total logs
          </span>
        )}
      </div>

      {/* Logs */}
      {paginatedData.length === 0 ? (
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Logs Found</h3>
          <p className="text-muted-foreground">
            {hasActiveFilters ? "Try adjusting your filters" : "Admin actions will be logged here"}
          </p>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {paginatedData.map((log) => (
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
                          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(log.created_at), "MMM dd, yyyy")}
                    <br />
                    {format(new Date(log.created_at), "HH:mm:ss")}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!hasPrevPage}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
