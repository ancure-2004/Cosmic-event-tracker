import React from "react";
import {
	AlertTriangle,
	Shield,
	Calendar,
	Ruler,
	Zap,
	Target,
	ExternalLink,
} from "lucide-react";
import {useNEO} from "../contexts/NeoContext";
import {
	formatDistance,
	formatVelocity,
	formatDiameter,
} from "../services/nasaAPI";

const NEOCard = ({neo, showCheckbox = false, onSelect, isSelected = false}) => {
	const {openNEODetails} = useNEO();

	const closeApproach = neo.close_approach_data?.[0] || {};
	const diameter = neo.estimated_diameter?.kilometers || {};
	const avgDiameter =
		((diameter.estimated_diameter_min || 0) +
			(diameter.estimated_diameter_max || 0)) /
		2;

	const handleCardClick = (e) => {
		if (e.target.type === "checkbox") return;
		openNEODetails(neo);
	};

	const handleCheckboxChange = (e) => {
		e.stopPropagation();
		onSelect?.(neo);
	};

	const formatDate = (dateString) => {
		if (!dateString) return "Unknown";
		try {
			return new Date(dateString).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch {
			return dateString;
		}
	};

	return (
		<div
			className={`card cursor-pointer rounded-xl backdrop-blur-lg bg-slate-800/[0.8] transition-all duration-300 hover:scale-[1.02] ${
				isSelected ? "ring-2 ring-cosmic-purple border-cosmic-purple" : ""
			}`}
			onClick={handleCardClick}
		>
			<div className="p-6">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-start space-x-3 w-full">
						{showCheckbox && (
							<input
								type="checkbox"
								checked={isSelected}
								onChange={handleCheckboxChange}
								className="mt-1 h-4 w-4 text-cosmic-purple bg-white/10 border-white/30"
							/>
						)}
						<div className="flex justify-between items-center w-full">
							<div>
								<div className="flex items-center gap-1">
									<h3 className="text-xl font-semibold text-white mb-1 leading-tight">
										{neo.name?.replace(/[()]/g, "") || "Unknown NEO"}
									</h3>
									{neo.nasa_jpl_url && (
										<a
											href={neo.nasa_jpl_url}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
											title="View on NASA JPL"
										>
											<ExternalLink className="h-4 w-4" />
										</a>
									)}
								</div>
								<div className="flex items-center space-x-2">
									<span className="text-xs text-gray-400">ID: {neo.id}</span>
								</div>
							</div>
						</div>
						{neo.is_potentially_hazardous_asteroid ? (
							<span className="flex items-center bg-red-400 rounded-full p-1 hazardous-badge">
								<AlertTriangle className="h-5 w-5" />
								<p className="text-lg">Hazardous</p>
							</span>
						) : (
							<span className="flex items-center bg-green-400 rounded-full p-1 safe-badge">
								<Shield className="h-5 w-5" />
								<p className="text-lg">Safe</p>
							</span>
						)}
					</div>
				</div>

				{/* Main Info Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
					<div className="space-y-5">
						<div className="flex items-center space-x-2 text-sm">
							<Calendar className="h-4 w-4 text-cosmic-gold flex-shrink-0" />
							<div>
								<p className="text-gray-300">Closest Approach</p>
								<p className="text-white font-medium">
									{formatDate(closeApproach.close_approach_date)}
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-2 text-sm">
							<Ruler className="h-4 w-4 text-cosmic-gold flex-shrink-0" />
							<div>
								<p className="text-gray-300">Est. Diameter</p>
								<p className="text-white font-medium">
									{formatDiameter(avgDiameter)}
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center space-x-2 text-sm">
							<Target className="h-4 w-4 text-cosmic-gold flex-shrink-0" />
							<div>
								<p className="text-gray-300">Miss Distance</p>
								<p className="text-white font-medium">
									{formatDistance(closeApproach.miss_distance?.kilometers || 0)}
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-2 text-sm">
							<Zap className="h-4 w-4 text-cosmic-gold flex-shrink-0" />
							<div>
								<p className="text-gray-300">Velocity</p>
								<p className="text-white font-medium">
									{formatVelocity(
										closeApproach.relative_velocity?.kilometers_per_hour || 0
									)}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Additional Info */}
				<div className="pt-4 border-t border-white/10">
					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-400">
							Orbiting: {closeApproach.orbiting_body || "Earth"}
						</span>
						<span className="text-gray-400">
							{closeApproach.miss_distance?.lunar
								? `${parseFloat(closeApproach.miss_distance.lunar).toFixed(
										1
								  )} LD`
								: ""}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NEOCard;
