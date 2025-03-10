'use client'

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import AdminCategoryConfig from "@/components/adminPanel/admin-category-config";
import AdminUserConfig from "@/components/adminPanel/admin-user-config";
import { ProtectedRoute } from "@/components/protected-route";
import { toast } from "@/hooks/use-toast";
import AdminRoleConfig from "@/components/adminPanel/admin-role-config";
import AdminStatusConfig from "@/components/adminPanel/admin-status-config";

import { isAuthenticatedUserAdmin } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  
  const [activeTab, setActiveTab] = useState("users");
  const [categories, setCategories] = useState<CommitmentCategory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchParam, setSearchParam] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  
  const router = useRouter();
  
  useEffect(() => {
    const checkAdmin = async () => {
      const isAdmin = await isAuthenticatedUserAdmin();

      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Permissão negada",
          description: "Você não tem acesso a esta página.",
        });

        router.push("/");
      router.refresh();
      } 
    };

    checkAdmin();
  }, [router]);

  useEffect(() => {
    if (activeTab === "categories") {
      api.getCategories()
        .then((data) => setCategories(data))
        .catch(() => toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar categorias",
        }))
    } else if (activeTab === "users") {
      api.getUsers( page, size, searchParam )
        .then((response) => setUsers(response.content))
        .catch(() => toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar usuários",
        }))
    } else if (activeTab === "roles") {
      api.getRoles(page, size)
        .then((response) => setRoles(response.content))
        .catch(() => toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar papéis",
        }))
    } else if (activeTab === "status") {
      api.getStatuses()
        .then((data) => setStatuses(data))
        .catch(() => toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar status",
        }))
    }
  }, [activeTab, page, size, searchParam]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground p-8">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4">
        <h2 className="text-xl font-bold">Configurações</h2>
        <nav className="mt-6 space-y-2">
          <button className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "users" ? "bg-slate-500 text-white" : ""}`} onClick={() => setActiveTab("users")}>Usuários</button>
          <button className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "categories" ? "bg-slate-500 text-white" : ""}`} onClick={() => setActiveTab("categories")}>Categorias</button>
          <button className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "roles" ? "bg-slate-500 text-white" : ""}`} onClick={() => setActiveTab("roles")}>Papéis</button>
          <button className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "status" ? "bg-slate-500 text-white" : ""}`} onClick={() => setActiveTab("status")}>Status</button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === "users" && (
          <AdminUserConfig 
            users={users} 
            setUsers={setUsers} 
            page={page} 
            setPage={setPage} 
            size={size} 
            setSize={setSize} 
            searchParam={searchParam} 
            setSearchParam={setSearchParam} 
          />
        )}
        {activeTab === "categories" && (
          <AdminCategoryConfig categories={categories} setCategories={setCategories} />
        )}
        {activeTab === "status" && (
          <AdminStatusConfig statuses={statuses} setStatuses={setStatuses}/>
        )}
        {activeTab === "roles" && (
          <AdminRoleConfig 
            roles={roles} 
            setRoles={setRoles}
            page={page} 
            setPage={setPage} 
            size={size} 
            setSize={setSize} 
          />
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
