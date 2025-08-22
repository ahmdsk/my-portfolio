import AnimatedSection from "@/components/animated-section";
import ProjectForm from "@/components/admin/project-form";
import ProjectTable from "@/components/admin/project-table";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <AnimatedSection>
        <h1 className="text-2xl font-semibold mb-1">Dashboard Admin</h1>
        <p className="text-sm text-muted-foreground">
          Kelola project dan saran dari pengunjung.
        </p>
      </AnimatedSection>

      <AnimatedSection>
        <h2 className="text-xl font-semibold mb-3">Tambah Project</h2>
        <ProjectForm />
      </AnimatedSection>

      <AnimatedSection>
        <h2 className="text-xl font-semibold mb-3">Daftar Project</h2>
        <ProjectTable />
      </AnimatedSection>
    </div>
  );
}
