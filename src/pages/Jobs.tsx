import { useState, useMemo } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
//import { jobs } from "@/data/jobs";
import { useJobs} from "@/hooks/use-jobs";


const JOBS_PER_PAGE = 6;

const JobsPage = () => {
  const { jobs, loading, error } = useJobs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allLocations = [...new Set(jobs.map((j) => j.location))];
  const allTypes = [...new Set(jobs.map((j) => j.type))]

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = !selectedLocation || job.location === selectedLocation;
      const matchesType = !selectedType || job.type === selectedType;
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, searchQuery, selectedLocation, selectedType]);

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            Browse Jobs
          </h1>
          <p className="text-primary-foreground/70">
            {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "position" : "positions"} available`}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Filters */}
        <div className="bg-card rounded-xl border border-border shadow-card p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or keyword..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 appearance-none"
              >
                <option value="">All Locations</option>
                {allLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 appearance-none"
              >
                <option value="">All Types</option>
                {allTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive font-medium">Failed to load jobs</p>
            <p className="text-muted-foreground text-sm mt-1">{error}</p>
          </div>
        ) : paginated.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((job, i) => (
                <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JobsPage;
