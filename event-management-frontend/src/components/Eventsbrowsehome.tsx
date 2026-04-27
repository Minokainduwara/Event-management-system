import { Search, MapPin, Users, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import HomeHeader from "./HomeHeader";

type Event = {
  id: number;
  eventTitle: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  registered: number;
  maxParticipants: number;
  category?: { id: number; categoryName: string };
};

type CategoryCount = {
  category: string;
  count: number;
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  default:  { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
  academic: { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400"   },
  sports:   { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400"  },
  cultural: { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400"  },
  social:   { bg: "bg-pink-50",   text: "text-pink-700",   dot: "bg-pink-400"   },
  workshop: { bg: "bg-teal-50",   text: "text-teal-700",   dot: "bg-teal-400"   },
  tech:     { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
};

function getCategoryStyle(name: string) {
  const key = name?.toLowerCase().split(" ")[0] ?? "default";
  return CATEGORY_COLORS[key] ?? CATEGORY_COLORS.default;
}

function AvailabilityBar({ registered, max }: { registered: number; max: number }) {
  const pct = Math.min((registered / max) * 100, 100);
  const color      = pct >= 90 ? "bg-red-400"    : pct >= 65 ? "bg-amber-400"   : "bg-emerald-400";
  const label      = pct >= 90 ? "Almost full"   : pct >= 65 ? "Filling up"     : "Open";
  const labelColor = pct >= 90 ? "text-red-600"  : pct >= 65 ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          {registered} / {max}
        </span>
        <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const catName = event.category?.categoryName ?? "General";
  const style = getCategoryStyle(catName);
  const date  = new Date(event.eventDate);
  const day   = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all duration-300 flex flex-col overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-4 px-5 pt-5 pb-4 border-b border-gray-50">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 leading-none">{month}</span>
          <span className="text-lg font-bold text-gray-800 leading-tight">{day}</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-violet-700 transition-colors">
            {event.eventTitle}
          </h3>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {event.eventTime}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col flex-1 gap-3">
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {catName}
          </span>
        </div>

        <AvailabilityBar registered={event.registered} max={event.maxParticipants} />
      </div>

      <div className="px-5 pb-4">
        <Link
          to={`/events/${event.id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-violet-600 text-gray-600 hover:text-white text-sm font-medium transition-all duration-200 group/btn border border-transparent hover:border-violet-600"
        >
          View details
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

// ── Change these to match your actual backend endpoints ──────────────────────
const API = {
    all: "http://localhost:8080/events/allEvents",
  
    categoryCounts:
      "http://localhost:8080/events/category-counts",
  
    search: (kw: string) =>
      `http://localhost:8080/events/searchEvent?keyword=${encodeURIComponent(kw)}`,
  
    filter: (id: string) =>
      `http://localhost:8080/events/filter?categoryId=${id}`,
  };
// ─────────────────────────────────────────────────────────────────────────────

export default function EventsBrowseHome() {
  const [searchQuery, setSearchQuery]       = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [events, setEvents]                 = useState<Event[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading]               = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    fetch(API.all)
      .then((r) => r.json())
      .then((d) => setEvents(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAll();
    fetch(API.categoryCounts)
      .then((r) => r.json())
      .then((d) => {
        const safe = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
        setCategoryCounts(safe);
      })
      .catch(() => setCategoryCounts([]));
  }, [fetchAll]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery === "") {
      if (categoryFilter === "") fetchAll();
      return;
    }
    setCategoryFilter("");
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      fetch(API.search(searchQuery))
        .then((r) => r.json())
        .then((d) => setEvents(Array.isArray(d) ? d : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 400);
  }, [searchQuery]);

  // Category filter
  useEffect(() => {
    if (categoryFilter === "") {
      if (searchQuery === "") fetchAll();
      return;
    }
    setSearchQuery("");
    setLoading(true);
    fetch(API.filter(categoryFilter))
      .then((r) => r.json())
      .then((d) => setEvents(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryFilter]);

  const categoryOptions = Array.from(
    new Map(
      events
        .filter((e) => e.category?.id && e.category?.categoryName)
        .map((e) => [e.category!.id, e.category!.categoryName])
    ).entries()
  );

  const totalEvents = categoryCounts.reduce((sum, cat) => sum + cat.count, 0);
  const isFiltered  = searchQuery !== "" || categoryFilter !== "";

  return (
    <>
      <HomeHeader />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {totalEvents} events available
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            What's happening<br />
            <span className="text-violet-600">on campus?</span>
          </h1>
          <p className="mt-3 text-gray-500 text-lg max-w-xl">
            Browse, filter, and register for upcoming university events in one place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, or description…"
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder-gray-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          

          {isFiltered && (
            <button
              onClick={() => { setSearchQuery(""); setCategoryFilter(""); }}
              className="px-4 py-3 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>

        {!isFiltered && categoryCounts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryCounts.map((cat) => {
              const style = getCategoryStyle(cat.category);
              return (
                <button
                  key={cat.category}
                  onClick={() => {
                    const match = categoryOptions.find(
                      ([, name]) => name.toLowerCase() === cat.category.toLowerCase()
                    );
                    if (match) setCategoryFilter(String(match[0]));
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-transparent hover:border-current transition-all cursor-pointer ${style.bg} ${style.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  {cat.category}
                  <span className="opacity-60">{cat.count}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {loading ? "Loading…" : (
              <>
                <span className="font-semibold text-gray-800">{events.length}</span>{" "}
                {isFiltered ? "results" : "events"}
              </>
            )}
          </p>
          {isFiltered && <span className="text-xs text-violet-600 font-medium">Filtered view</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-64" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No events found matching your criteria.</p>
            {isFiltered && (
              <button
                onClick={() => { setSearchQuery(""); setCategoryFilter(""); }}
                className="mt-3 text-violet-600 text-sm underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}