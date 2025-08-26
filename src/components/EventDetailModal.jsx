import React from "react";
import {
	X,
	AlertTriangle,
	Shield,
	Calendar,
	Ruler,
	Zap,
	Target,
	ExternalLink,
	Globe,
	Clock,
	Orbit,
} from "lucide-react";
import {useNEO} from "../contexts/NeoContext";
import {
	formatDistance,
	formatVelocity,
	formatDiameter,
} from "../services/nasaAPI";

const EventDetailModal = () => {
	const {selectedNEODetails, modalOpen, closeNEODetails} = useNEO();

	if (!modalOpen || !selectedNEODetails) return null;

	const neo = selectedNEODetails;
	const closeApproach = neo.close_approach_data?.[0] || {};
	const diameter = neo.estimated_diameter?.kilometers || {};

	const formatDateTime = (dateString) => {
		if (!dateString) return "Unknown";
		try {
			return new Date(dateString).toLocaleString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				timeZone: "UTC",
				timeZoneName: "short",
			});
		} catch {
			return dateString;
		}
	};

	const InfoItem = ({icon: Icon, label, value, className = ""}) => (
		<div className={`flex items-start space-x-3 ${className}`}>
			<div className="flex-shrink-0 p-2 bg-cosmic-blue/20 rounded-lg">
				<Icon className="h-5 w-5 text-cosmic-gold" />
			</div>
			<div className="flex-1">
				<p className="text-sm text-gray-300 mb-1">{label}</p>
				<p className="text-white font-medium">{value}</p>
			</div>
		</div>
	);

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
				<div
					className="fixed inset-0 transition-opacity bg-black/70 backdrop-blur-sm"
					onClick={closeNEODetails}
				/>

				<div className="inline-block align-bottom bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-white/20">
					{/* Header */}
					<div className="px-6 pt-6 pb-4 border-b border-white/10">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<div
									className={`p-3 rounded-lg ${
										neo.is_potentially_hazardous_asteroid
											? "bg-red-500/20 text-red-300"
											: "bg-green-500/20 text-green-300"
									}`}
								>
									{neo.is_potentially_hazardous_asteroid ? (
										<AlertTriangle className="h-6 w-6" />
									) : (
										<Shield className="h-6 w-6" />
									)}
								</div>
								<div>
									<h2 className="text-2xl font-bold text-white leading-tight">
										{neo.name?.replace(/[()]/g, "") || "Unknown NEO"}
									</h2>
									<div className="flex items-center space-x-4 mt-2">
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${
												neo.is_potentially_hazardous_asteroid
													? "bg-red-500/20 text-red-300 border border-red-500/30"
													: "bg-green-500/20 text-green-300 border border-green-500/30"
											}`}
										>
											{neo.is_potentially_hazardous_asteroid
												? "Potentially Hazardous"
												: "Safe"}
										</span>
										<span className="text-sm text-gray-400">
											NEO ID: {neo.id}
										</span>
									</div>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<button
									onClick={closeNEODetails}
									className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
								>
									<X className="h-6 w-6" />
								</button>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="px-6 py-6 max-h-96 overflow-y-auto">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Left Column - Basic Info */}
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-semibold text-white mb-4">
										Close Approach Details
									</h3>
									<div className="space-y-4">
										<InfoItem
											icon={Calendar}
											label="Close Approach Date"
											value={formatDateTime(
												closeApproach.close_approach_date_full ||
													closeApproach.close_approach_date
											)}
										/>

										<InfoItem
											icon={Target}
											label="Miss Distance"
											value={
												<div className="space-y-1">
													<div>
														{formatDistance(
															closeApproach.miss_distance?.kilometers || 0
														)}
													</div>
													{closeApproach.miss_distance?.astronomical && (
														<div className="text-sm text-gray-400">
															{parseFloat(
																closeApproach.miss_distance.astronomical
															).toFixed(4)}{" "}
															AU
														</div>
													)}
													{closeApproach.miss_distance?.lunar && (
														<div className="text-sm text-gray-400">
															{parseFloat(
																closeApproach.miss_distance.lunar
															).toFixed(1)}{" "}
															Lunar Distances
														</div>
													)}
												</div>
											}
										/>

										<InfoItem
											icon={Zap}
											label="Relative Velocity"
											value={
												<div className="space-y-1">
													<div>
														{formatVelocity(
															closeApproach.relative_velocity
																?.kilometers_per_hour || 0
														)}
													</div>
													{closeApproach.relative_velocity
														?.kilometers_per_second && (
														<div className="text-sm text-gray-400">
															{parseFloat(
																closeApproach.relative_velocity
																	.kilometers_per_second
															).toFixed(2)}{" "}
															km/s
														</div>
													)}
												</div>
											}
										/>

										<InfoItem
											icon={Globe}
											label="Orbiting Body"
											value={closeApproach.orbiting_body || "Earth"}
										/>
									</div>
								</div>
							</div>

							{/* Right Column - Physical Characteristics */}
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-semibold text-white mb-4">
										Physical Characteristics
									</h3>
									<div className="space-y-4">
										<InfoItem
											icon={Ruler}
											label="Estimated Diameter"
											value={
												<div className="space-y-1">
													<div>
														{formatDiameter(
															diameter.estimated_diameter_min || 0
														)}{" "}
														-{" "}
														{formatDiameter(
															diameter.estimated_diameter_max || 0
														)}
													</div>
													<div className="text-sm text-gray-400">
														Average:{" "}
														{formatDiameter(
															((diameter.estimated_diameter_min || 0) +
																(diameter.estimated_diameter_max || 0)) /
																2
														)}
													</div>
												</div>
											}
										/>

										{neo.orbital_data && (
											<>
												<InfoItem
													icon={Orbit}
													label="Orbit ID"
													value={neo.orbital_data.orbit_id || "Unknown"}
												/>
											</>
										)}

										<InfoItem
											icon={Clock}
											label="Reference ID"
											value={neo.neo_reference_id || "Unknown"}
										/>
									</div>
								</div>

								{/* Additional Data */}
								{Object.keys(neo.estimated_diameter || {}).length > 1 && (
									<div>
										<h3 className="text-lg font-semibold text-white mb-4">
											Size Estimates
										</h3>
										<div className="space-y-3">
											{Object.entries(neo.estimated_diameter || {}).map(
												([unit, data]) => (
													<div key={unit} className="bg-white/5 rounded-lg p-3">
														<div className="flex justify-between items-center mb-2">
															<span className="text-sm font-medium text-gray-300 capitalize">
																{unit === "kilometers"
																	? "Kilometers"
																	: unit === "meters"
																	? "Meters"
																	: unit === "miles"
																	? "Miles"
																	: unit === "feet"
																	? "Feet"
																	: unit}
															</span>
														</div>
														<div className="flex justify-between text-sm">
															<span className="text-gray-400">Min:</span>
															<span className="text-white">
																{parseFloat(
																	data.estimated_diameter_min || 0
																).toFixed(
																	unit === "kilometers"
																		? 3
																		: unit === "meters"
																		? 1
																		: 2
																)}{" "}
																{unit === "kilometers"
																	? "km"
																	: unit === "meters"
																	? "m"
																	: unit === "miles"
																	? "mi"
																	: "ft"}
															</span>
														</div>
														<div className="flex justify-between text-sm">
															<span className="text-gray-400">Max:</span>
															<span className="text-white">
																{parseFloat(
																	data.estimated_diameter_max || 0
																).toFixed(
																	unit === "kilometers"
																		? 3
																		: unit === "meters"
																		? 1
																		: 2
																)}{" "}
																{unit === "kilometers"
																	? "km"
																	: unit === "meters"
																	? "m"
																	: unit === "miles"
																	? "mi"
																	: "ft"}
															</span>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Risk Assessment */}
						<div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
							<h3 className="text-lg font-semibold text-white mb-3">
								Risk Assessment
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="text-center">
									<div
										className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
											neo.is_potentially_hazardous_asteroid
												? "bg-red-500/20 text-red-300"
												: "bg-green-500/20 text-green-300"
										}`}
									>
										{neo.is_potentially_hazardous_asteroid ? (
											<AlertTriangle className="h-8 w-8" />
										) : (
											<Shield className="h-8 w-8" />
										)}
									</div>
									<p className="text-sm text-gray-300">Hazard Level</p>
									<p
										className={`font-medium ${
											neo.is_potentially_hazardous_asteroid
												? "text-red-300"
												: "text-green-300"
										}`}
									>
										{neo.is_potentially_hazardous_asteroid
											? "Potentially Hazardous"
											: "Safe"}
									</p>
								</div>

								<div className="text-center">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-300 mb-2">
										<Target className="h-8 w-8" />
									</div>
									<p className="text-sm text-gray-300">Distance Category</p>
									<p className="font-medium text-blue-300">
										{closeApproach.miss_distance?.lunar &&
										parseFloat(closeApproach.miss_distance.lunar) < 10
											? "Very Close"
											: closeApproach.miss_distance?.lunar &&
											  parseFloat(closeApproach.miss_distance.lunar) < 50
											? "Close"
											: "Distant"}
									</p>
								</div>

								<div className="text-center">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 text-purple-300 mb-2">
										<Ruler className="h-8 w-8" />
									</div>
									<p className="text-sm text-gray-300">Size Category</p>
									<p className="font-medium text-purple-300">
										{((diameter.estimated_diameter_min || 0) +
											(diameter.estimated_diameter_max || 0)) /
											2 >=
										1
											? "Large"
											: ((diameter.estimated_diameter_min || 0) +
													(diameter.estimated_diameter_max || 0)) /
													2 >=
											  0.1
											? "Medium"
											: "Small"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="px-6 py-4 bg-white/5 border-t border-white/10">
						<div className="flex items-center justify-between">
							<p className="text-sm text-gray-400">
								Data provided by NASA Near Earth Object Web Service
							</p>
							<div className="flex space-x-3">
								{neo.nasa_jpl_url && (
									<a
										href={neo.nasa_jpl_url}
										target="_blank"
										rel="noopener noreferrer"
										className="p-2 flex gap-2 bg-cosmic-blue/20 hover:bg-cosmic-blue/30 rounded-lg transition-colors text-cosmic-gold hover:text-white"
										title="View on NASA JPL"
									>
										<ExternalLink className="h-5 w-5" />
                    NASA JPL Data
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventDetailModal;
