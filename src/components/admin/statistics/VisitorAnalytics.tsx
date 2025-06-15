
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Users, Eye } from "lucide-react";

interface VisitorAnalyticsProps {
  visitorStats?: any;
}

const VisitorAnalytics: React.FC<VisitorAnalyticsProps> = ({ visitorStats }) => {
  if (!visitorStats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin mr-3 text-gray-500" />
        <span className="text-gray-600">Loading visitor statistics...</span>
      </div>
    );
  }
  
  if (!visitorStats.success) {
    return (
      <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg">
        Error loading visitor statistics. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitorStats.uniqueVisitorCount}</div>
            <p className="text-xs text-muted-foreground">Total unique visitors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitorStats.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">Total pages visited across the site</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitorStats.pageViewsByPage} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="page" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" name="Views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visits (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitorStats.dailyVisitsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" name="Visits" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Visitor ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="hidden md:table-cell">User Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitorStats.recentVisits.map((visit: any) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-medium">{visit.page}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs" title={visit.visitor_id}>
                      {visit.visitor_id.substring(0, 8)}...
                    </span>
                  </TableCell>
                  <TableCell>{new Date(visit.created_at).toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm truncate">{visit.user_agent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default VisitorAnalytics;
