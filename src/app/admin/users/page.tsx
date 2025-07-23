
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ManageUsersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Users"
        description="This feature is under development."
      />
      <Card className="flex flex-col items-center justify-center text-center border-dashed min-h-[400px]">
        <CardContent className="p-10">
            <div className="p-4 bg-muted rounded-full inline-block mb-4">
                <Users className="w-16 h-16 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold font-headline">User Management Coming Soon</h3>
            <p className="text-muted-foreground mt-2">
                Soon you will be able to view, edit, and manage user accounts and permissions from this page.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
