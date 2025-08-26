import React, {useEffect, useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useNEO} from "../contexts/NeoContext";
import {useAuth} from "../contexts/AuthContext";
import NEOCard from "../components/NeoCard";
import LoadingSpinner, {LoadingSkeleton} from "../components/LoadingSpinner";
import Filter from "../components/Filter";
import {
	Calendar,
	BarChart3,
	RefreshCw,
	AlertCircle,
	Telescope,
} from "lucide-react";

const HomePage = () => {
	const {user} = useAuth();
	const navigate = useNavigate();
	const {
		neoData,
		loading,
		error,
		selectedNEOs,
		dateRange,
		loadNEOData,
		loadMoreData,
		toggleNEOSelection,
		clearSelectedNEOs,
		getFilteredNEOs,
	} = useNEO();

	const [filters, setFilters] = useState({
		hazardousOnly: false,
		sortBy: "",
		startDate: "",
		endDate: "",
	});
	const [showStats, setShowStats] = useState(false);

	// Load initial data
	useEffect(() => {
		if (user) {
			loadNEOData(dateRange.start, dateRange.end);
		}
	}, [user, dateRange.start, dateRange.end, loadNEOData]);

	// Get filtered NEOs
	const filteredNEOs = useMemo(() => {
		return getFilteredNEOs(filters);
	}, [getFilteredNEOs, filters]);

	// Group NEOs by date for display
	const neosByDate = useMemo(() => {
		const grouped = {};
		filteredNEOs.forEach((neo) => {
			const date =
				neo.close_approach_data?.[0]?.close_approach_date || neo.approach_date;
			if (!grouped[date]) {
				grouped[date] = [];
			}
			grouped[date].push(neo);
		});
		return grouped;
	}, [filteredNEOs]);

	// Calculate statistics
	const stats = useMemo(() => {
		const total = filteredNEOs.length;
		const hazardous = filteredNEOs.filter(
			(neo) => neo.is_potentially_hazardous_asteroid
		).length;
		const safe = total - hazardous;

		const avgDiameter =
			filteredNEOs.reduce((sum, neo) => {
				const diameter = neo.estimated_diameter?.kilometers || {};
				return (
					sum +
					((diameter.estimated_diameter_min || 0) +
						(diameter.estimated_diameter_max || 0)) /
						2
				);
			}, 0) / (total || 1);

		return {
			total,
			hazardous,
			safe,
			avgDiameter: avgDiameter.toFixed(3),
		};
	}, [filteredNEOs]);

	const handleCompare = () => {
		if (selectedNEOs.length < 2) {
			alert("Please select at least 2 NEOs to compare");
			return;
		}
		navigate("/compare");
	};

	const handleRefresh = () => {
		loadNEOData(dateRange.start, dateRange.end);
	};

	const formatDateHeader = (dateString) => {
		try {
			return new Date(dateString).toLocaleDateString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return dateString;
		}
	};

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-12">
				<div className="text-center max-w-2xl mx-auto">
					<div className="mb-8">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-full mb-6">
							<Telescope className="h-10 w-10 text-white" />
						</div>
						<h1 className="text-4xl font-bold text-white mb-4">
							Welcome to Cosmic Event Tracker
						</h1>
						<p className="text-xl text-gray-300 mb-8">
							Track Near-Earth Objects and monitor cosmic events with real-time
							NASA data
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
						<div className="card p-6 text-center">
							<Calendar className="h-8 w-8 text-cosmic-gold mx-auto mb-3" />
							<h3 className="text-lg font-semibold text-white mb-2">
								Real-time Data
							</h3>
							<p className="text-gray-300 text-sm">
								Access up-to-date information about Near-Earth Objects from
								NASA's database
							</p>
						</div>

						<div className="card p-6 text-center">
							<BarChart3 className="h-8 w-8 text-cosmic-gold mx-auto mb-3" />
							<h3 className="text-lg font-semibold text-white mb-2">
								Compare & Analyze
							</h3>
							<p className="text-gray-300 text-sm">
								Select multiple NEOs to compare their characteristics and
								trajectories
							</p>
						</div>

						<div className="card p-6 text-center">
							<AlertCircle className="h-8 w-8 text-cosmic-gold mx-auto mb-3" />
							<h3 className="text-lg font-semibold text-white mb-2">
								Risk Assessment
							</h3>
							<p className="text-gray-300 text-sm">
								Identify potentially hazardous asteroids and monitor their
								approach
							</p>
						</div>
					</div>

					<p className="text-gray-400 text-lg">
						Please sign in to start exploring cosmic events
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-white mb-2">
							Near-Earth Objects
						</h1>
						<p className="text-gray-300">
							Tracking cosmic events from{" "}
							{new Date(dateRange.start).toLocaleDateString()}
							{" to "} {new Date(dateRange.end).toLocaleDateString()}
						</p>
					</div>

					<div className="flex flex-col items-start space-x-4 mr-5">
						<button
							onClick={handleCompare}
							disabled={selectedNEOs.length < 2}
							className={`btn-primary text-cosmic-gold hover:dark:bg-slate-800/[0.8] rounded-2xl p-2 ${
								selectedNEOs.length < 2 ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							<BarChart3 className="h-5 w-5 mr-2" />
							Compare ({selectedNEOs.length})
						</button>
						{selectedNEOs.length > 0 && (
							<div className="flex items-center space-x-2 mt-2">
								<button
									onClick={clearSelectedNEOs}
									className="text-md text-red-400 hover:text-red-300"
								>
									Clear
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Controls */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
					<div className="flex items-center space-x-4">
						<Filter onFiltersChange={setFilters} currentFilters={filters} />

						<button
							onClick={() => setShowStats(!showStats)}
							className="btn-secondary flex flex-row justify-center text-cosmic-gold"
						>
							<BarChart3 className="h-5 w-5 mr-2" />
							<p>Stats</p>
						</button>

						<button
							onClick={handleRefresh}
							disabled={loading}
							className="btn-secondary flex flex-row justify-center text-cosmic-gold"
						>
							<RefreshCw
								className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
							/>
							Refresh
						</button>
					</div>

					{/* Statistics Panel */}
					{showStats && (
						<div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
								<div>
									<p className="text-2xl font-bold text-white">{stats.total}</p>
									<p className="text-xs text-gray-400">Total NEOs</p>
								</div>
								<div>
									<p className="text-2xl font-bold text-red-400">
										{stats.hazardous}
									</p>
									<p className="text-xs text-gray-400">Hazardous</p>
								</div>
								<div>
									<p className="text-2xl font-bold text-green-400">
										{stats.safe}
									</p>
									<p className="text-xs text-gray-400">Safe</p>
								</div>
								<div>
									<p className="text-2xl font-bold text-blue-400">
										{stats.avgDiameter}
									</p>
									<p className="text-xs text-gray-400">Avg Diameter (km)</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Loading State */}
			{loading && Object.keys(neoData).length === 0 ? (
				<div className="py-12">
					<LoadingSpinner size="lg" text="Loading Near-Earth Objects..." />
					<div className="mt-8">
						<LoadingSkeleton count={6} />
					</div>
				</div>
			) : (
				/* Content */
				<div className="space-y-8">
					{Object.keys(neosByDate).length === 0 ? (
						<div className="text-center py-12">
							<Telescope className="h-16 w-16 text-gray-500 mx-auto mb-4" />
							<h3 className="text-xl font-medium text-white mb-2">
								No NEOs found
							</h3>
							<p className="text-gray-400">
								{filters.hazardousOnly
									? "No potentially hazardous asteroids found with current filters."
									: "Try adjusting your filters or check back later for new data."}
							</p>
						</div>
					) : (
						Object.entries(neosByDate)
							.sort(([a], [b]) => new Date(a) - new Date(b))
							.map(([date, neos]) => (
								<div key={date} className="space-y-7">
									<div className="flex items-center space-x-5">
										<Calendar className="h-5 w-5 text-cosmic-gold" />
										<h2 className="text-xl font-semibold text-white">
											{formatDateHeader(date)}
										</h2>
										<span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
											{neos.length} objects
										</span>
									</div>

									<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
										{neos.map((neo) => (
											<NEOCard
												key={neo.id}
												neo={neo}
												showCheckbox={true}
												onSelect={toggleNEOSelection}
												isSelected={selectedNEOs.some(
													(selected) => selected.id === neo.id
												)}
											/>
										))}
									</div>
								</div>
							))
					)}

					{/* Load More Button */}
					{!loading && filteredNEOs.length > 0 && (
						<div className="text-center pt-8">
							<button
								onClick={loadMoreData}
								disabled={loading}
								className="btn-secondary text-cosmic-gold"
							>
								{loading ? (
									<>
										<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
										<p className="underline">Loading more...</p>
									</>
								) : (
									<p className="text-sm font-semibold underline">Load More Days</p>
								)}
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default HomePage;
