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
	Sparkles,
	Zap,
	Globe,
	ArrowRight,
	Star,
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
			<div className="min-h-screen bg-gradient-to-b from-cosmic-black via-indigo-950/30 to-cosmic-black relative overflow-hidden">
				{/* Animated Background Elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-60"></div>
					<div className="absolute top-40 right-20 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-40"></div>
					<div className="absolute bottom-60 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-50"></div>
					<div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-30"></div>
					<div className="absolute bottom-40 right-16 w-2 h-2 bg-pink-300 rounded-full animate-pulse opacity-40"></div>

					{/* Gradient Orbs */}
					<div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
					<div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
				</div>

				<div className="container mx-auto px-4 py-16 relative z-10">
					<div className="text-center max-w-4xl mx-auto">
						{/* Enhanced Header Section */}
						<div className="mb-16">
							<div className="relative inline-block mb-8">
								<div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
								<div className="relative inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full shadow-2xl shadow-purple-500/50 animate-pulse">
									<Telescope className="h-14 w-14 text-white animate-bounce" />
								</div>
							</div>

							<div className="space-y-6">
								<h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight leading-tight">
									Cosmic Event Tracker
								</h1>
								<div className="flex items-center justify-center gap-2 text-yellow-300 mb-4">
									<Sparkles className="h-5 w-5 animate-pulse" />
									<span className="text-sm font-semibold uppercase tracking-wider">
										Live NASA Data
									</span>
									<Sparkles className="h-5 w-5 animate-pulse" />
								</div>
								<p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
									Monitor Near-Earth Objects and explore the cosmos with{" "}
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 font-bold">
										cutting-edge space technology
									</span>
								</p>
							</div>
						</div>

						{/* Enhanced Features Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
							{/* Real-time Data Card */}
							<div className="group relative">
								<div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
								<div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:border-blue-400/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 shadow-2xl">
									<div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl mx-auto mb-6 shadow-lg shadow-blue-500/30">
										<Calendar className="h-8 w-8 text-white" />
									</div>
									<h3 className="text-xl font-bold text-white mb-4">
										Real-time Data
									</h3>
									<p className="text-gray-300 leading-relaxed">
										Access live Near-Earth Object data directly from NASA’s
										database with instant updates.{" "}
									</p>
									<div className="mt-6 flex items-center justify-center text-blue-400 group-hover:text-blue-300">
										<Zap className="h-4 w-4 mr-2 animate-pulse" />
										<span className="text-sm font-semibold">Live Updates</span>
									</div>
								</div>
							</div>

							{/* Compare & Analyze Card */}
							<div className="group relative">
								<div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
								<div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:border-purple-400/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 shadow-2xl">
									<div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mx-auto mb-6 shadow-lg shadow-purple-500/30">
										<BarChart3 className="h-8 w-8 text-white" />
									</div>
									<h3 className="text-xl font-bold text-white mb-4">
										Compare & Analyze
									</h3>
									<p className="text-gray-300 leading-relaxed">
										Select multiple NEOs to analyze their characteristics,
										trajectories, and orbital patterns side by side.
									</p>
									<div className="mt-6 flex items-center justify-center text-purple-400 group-hover:text-purple-300">
										<Globe className="h-4 w-4 mr-2 animate-spin" />
										<span className="text-sm font-semibold">
											Advanced Analytics
										</span>
									</div>
								</div>
							</div>

							{/* Risk Assessment Card */}
							<div className="group relative">
								<div className="absolute -inset-1 bg-gradient-to-r from-orange-500/50 to-red-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
								<div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:border-orange-400/50 transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 shadow-2xl">
									<div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl mx-auto mb-6 shadow-lg shadow-orange-500/30">
										<AlertCircle className="h-8 w-8 text-white" />
									</div>
									<h3 className="text-xl font-bold text-white mb-4">
										Risk Assessment
									</h3>
									<p className="text-gray-300 leading-relaxed">
										Identify potentially hazardous asteroids and monitor their
										approach trajectories with precision alerts.
									</p>
									<div className="mt-6 flex items-center justify-center text-orange-400 group-hover:text-orange-300">
										<AlertCircle className="h-4 w-4 mr-2 animate-pulse" />
										<span className="text-sm font-semibold">Smart Alerts</span>
									</div>
								</div>
							</div>
						</div>

						{/* Stats Section */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
							<div className="text-center p-6 rounded-xl bg-slate-900/50 border border-slate-700/30 backdrop-blur-sm">
								<div className="text-3xl font-bold text-blue-400 mb-1">
									30,000+
								</div>
								<div className="text-sm text-gray-400">NEOs Tracked</div>
							</div>
							<div className="text-center p-6 rounded-xl bg-slate-900/50 border border-slate-700/30 backdrop-blur-sm">
								<div className="text-3xl font-bold text-purple-400 mb-1">
									24/7
								</div>
								<div className="text-sm text-gray-400">Monitoring</div>
							</div>
							<div className="text-center p-6 rounded-xl bg-slate-900/50 border border-slate-700/30 backdrop-blur-sm">
								<div className="text-3xl font-bold text-yellow-400 mb-1">
									2,000+
								</div>
								<div className="text-sm text-gray-400">PHAs Identified</div>
							</div>
							<div className="text-center p-6 rounded-xl bg-slate-900/50 border border-slate-700/30 backdrop-blur-sm">
								<div className="text-3xl font-bold text-green-400 mb-1">
									99.9%
								</div>
								<div className="text-sm text-gray-400">Accuracy</div>
							</div>
						</div>

						{/* Enhanced CTA Section */}
						<div className="relative">
							<div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl"></div>
							<div className="relative bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12">
								<div className="flex items-center justify-center mb-6">
									<Star className="h-6 w-6 text-yellow-300 animate-pulse mr-2" />
									<h2 className="text-2xl font-bold text-white">
										Ready to Explore the Cosmos?
									</h2>
									<Star className="h-6 w-6 text-yellow-300 animate-pulse ml-2" />
								</div>
								<p className="text-xl text-gray-300 mb-8">
									Join thousands of space enthusiasts tracking cosmic events in
									real-time
								</p>
							</div>
						</div>

						{/* Footer Note */}
						<div className="mt-16 text-center">
							<p className="text-gray-500 text-sm flex items-center justify-center gap-2">
								<span>Powered by NASA's Near Earth Object Web Service</span>
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
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
							className={`btn-primary flex text-cosmic-gold hover:dark:bg-slate-800/[0.8] rounded-2xl p-2 ${
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
									<p className="text-sm font-semibold underline">
										Load More Days
									</p>
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
