import { useState, useEffect } from "react";
import { Check, X, Shield, Users, Eye, Package, ShoppingCart, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminUser {
  id: string;
  user_id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  is_super_admin: boolean;
  can_manage_products: boolean;
  can_process_orders: boolean;
  can_access_clients: boolean;
  can_view_statistics: boolean;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

const AdminManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isSuperAdmin } = useAdminAuth();

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching admin users:", error);
        toast({
          title: "Error loading admin users",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Type assertion to ensure proper typing
      const typedAdminUsers = (data || []).map(user => ({
        ...user,
        status: user.status as 'pending' | 'approved' | 'rejected'
      })) as AdminUser[];

      setAdminUsers(typedAdminUsers);
    } catch (error) {
      console.error("Error in fetchAdminUsers:", error);
      toast({
        title: "Error loading admin users",
        description: "Failed to load admin users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const handleApproveAdmin = async (
    adminId: string, 
    privileges: {
      canManageProducts: boolean;
      canProcessOrders: boolean;
      canAccessClients: boolean;
      canViewStatistics: boolean;
    }
  ) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to approve admin users.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.rpc('approve_admin_user', {
        admin_id_to_approve: adminId,
        approver_user_id: currentUser.user.id,
        grant_manage_products: privileges.canManageProducts,
        grant_process_orders: privileges.canProcessOrders,
        grant_access_clients: privileges.canAccessClients,
        grant_view_statistics: privileges.canViewStatistics,
      });

      if (error) {
        console.error("Error approving admin:", error);
        toast({
          title: "Error approving admin",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Admin approved",
        description: "The admin user has been approved successfully.",
        variant: "default",
      });

      // Refresh the list
      fetchAdminUsers();
    } catch (error) {
      console.error("Error in handleApproveAdmin:", error);
      toast({
        title: "Error approving admin",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectAdmin = async (adminId: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ status: 'rejected' })
        .eq('id', adminId);

      if (error) {
        console.error("Error rejecting admin:", error);
        toast({
          title: "Error rejecting admin",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Admin rejected",
        description: "The admin user has been rejected.",
        variant: "default",
      });

      // Refresh the list
      fetchAdminUsers();
    } catch (error) {
      console.error("Error in handleRejectAdmin:", error);
      toast({
        title: "Error rejecting admin",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isSuperAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Only super admins can access the admin management panel.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading admin users...</div>;
  }

  const pendingAdmins = adminUsers.filter(admin => admin.status === 'pending');
  const approvedAdmins = adminUsers.filter(admin => admin.status === 'approved');
  const rejectedAdmins = adminUsers.filter(admin => admin.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Admin Management</h2>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Pending Approvals ({pendingAdmins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingAdmins.length === 0 ? (
            <p className="text-gray-500">No pending admin approvals.</p>
          ) : (
            <div className="space-y-4">
              {pendingAdmins.map((admin) => (
                <PendingAdminCard 
                  key={admin.id} 
                  admin={admin} 
                  onApprove={handleApproveAdmin}
                  onReject={handleRejectAdmin}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Admins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Approved Admins ({approvedAdmins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedAdmins.length === 0 ? (
            <p className="text-gray-500">No approved admins.</p>
          ) : (
            <div className="space-y-2">
              {approvedAdmins.map((admin) => (
                <AdminCard key={admin.id} admin={admin} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejected Admins */}
      {rejectedAdmins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              Rejected Admins ({rejectedAdmins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rejectedAdmins.map((admin) => (
                <AdminCard key={admin.id} admin={admin} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const PendingAdminCard = ({ 
  admin, 
  onApprove, 
  onReject 
}: { 
  admin: AdminUser; 
  onApprove: (id: string, privileges: any) => void;
  onReject: (id: string) => void;
}) => {
  const [privileges, setPrivileges] = useState({
    canManageProducts: false,
    canProcessOrders: false,
    canAccessClients: false,
    canViewStatistics: false,
  });

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{admin.name}</h3>
          <p className="text-sm text-gray-500">
            Requested: {new Date(admin.created_at).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="outline">Pending</Badge>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Grant Privileges:</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`products-${admin.id}`}
              checked={privileges.canManageProducts}
              onCheckedChange={(checked) => 
                setPrivileges(prev => ({ ...prev, canManageProducts: !!checked }))
              }
            />
            <Label htmlFor={`products-${admin.id}`} className="text-sm flex items-center gap-1">
              <Package className="h-3 w-3" />
              Manage Products
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`orders-${admin.id}`}
              checked={privileges.canProcessOrders}
              onCheckedChange={(checked) => 
                setPrivileges(prev => ({ ...prev, canProcessOrders: !!checked }))
              }
            />
            <Label htmlFor={`orders-${admin.id}`} className="text-sm flex items-center gap-1">
              <ShoppingCart className="h-3 w-3" />
              Process Orders
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`clients-${admin.id}`}
              checked={privileges.canAccessClients}
              onCheckedChange={(checked) => 
                setPrivileges(prev => ({ ...prev, canAccessClients: !!checked }))
              }
            />
            <Label htmlFor={`clients-${admin.id}`} className="text-sm flex items-center gap-1">
              <Users className="h-3 w-3" />
              Access Clients
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`stats-${admin.id}`}
              checked={privileges.canViewStatistics}
              onCheckedChange={(checked) => 
                setPrivileges(prev => ({ ...prev, canViewStatistics: !!checked }))
              }
            />
            <Label htmlFor={`stats-${admin.id}`} className="text-sm flex items-center gap-1">
              <BarChart className="h-3 w-3" />
              View Statistics
            </Label>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          size="sm" 
          onClick={() => onApprove(admin.id, privileges)}
          className="flex-1"
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={() => onReject(admin.id)}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  );
};

const AdminCard = ({ admin }: { admin: AdminUser }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            {admin.name}
            {admin.is_super_admin && <Shield className="h-4 w-4 text-red-500" />}
          </h3>
          <div className="flex gap-2 mt-1 flex-wrap">
            {admin.can_manage_products && (
              <Badge variant="outline" className="text-xs">
                <Package className="h-3 w-3 mr-1" />
                Products
              </Badge>
            )}
            {admin.can_process_orders && (
              <Badge variant="outline" className="text-xs">
                <ShoppingCart className="h-3 w-3 mr-1" />
                Orders
              </Badge>
            )}
            {admin.can_access_clients && (
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                Clients
              </Badge>
            )}
            {admin.can_view_statistics && (
              <Badge variant="outline" className="text-xs">
                <BarChart className="h-3 w-3 mr-1" />
                Stats
              </Badge>
            )}
          </div>
        </div>
        <Badge className={getStatusColor(admin.status)}>
          {admin.status}
        </Badge>
      </div>
    </div>
  );
};

export default AdminManagement;
