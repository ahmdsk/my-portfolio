import ProjectForm from "@/components/admin/project-form";
import ProjectTable from "@/components/admin/project-table";
import AnimatedSection from "@/components/animated-section";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <AnimatedSection>
        <h1 className="text-2xl font-semibold mb-2">Dashboard Admin</h1>
        <p className="text-sm text-neutral-400">Kelola project dan saran dari pengunjung.</p>
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
