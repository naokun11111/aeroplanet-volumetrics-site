export interface Feature {
	title: string;
	description: string;
}

export interface Screenshot {
	src: string;
	altitude: string;
	caption: string;
	alt: string;
}

// Captured in-engine on UE5.5, 2026-09-22, after the vertical-line rendering fix. No
// post-production beyond a resize/re-encode to WebP. Same planet, same weather field, four
// altitudes on the way down.
export const screenshots: Screenshot[] = [
	{
		src: '/images/welkin-globe.webp',
		altitude: '20,000 km — full disc',
		caption:
			'The whole weather field at once: wide bands of cloud with channels of open ocean between them.',
		alt: 'An Earth-like planet seen from 20,000 km, most of the disc covered by swirling white cloud bands over deep blue ocean, captured in Unreal Engine 5.5.',
	},
	{
		src: '/images/welkin-mid-400km.webp',
		altitude: '400 km — orbital',
		caption:
			"The atmosphere's blue limb against space, with scattered cumulus clearing enough to show open ocean below.",
		alt: 'The curved limb of a planet with a blue atmospheric glow against black space, scattered clouds over ocean below, captured in Unreal Engine 5.5.',
	},
	{
		src: '/images/welkin-low-60km.webp',
		altitude: '60 km — descending',
		caption: 'The same weather field, resolved down to the frayed, fibrous edge of each cloud mass.',
		alt: 'A closer view of cloud cover from 60 km altitude, showing detailed frayed edges of cloud masses over blue ocean, captured in Unreal Engine 5.5.',
	},
	{
		src: '/images/welkin-ground.webp',
		altitude: 'Ground level',
		caption: 'Looking toward the sun through the lower atmosphere, low on the horizon.',
		alt: 'A ground-level view looking toward a bright, hazy sun low in the sky, captured in Unreal Engine 5.5.',
	},
];

// Every claim here is checked against the plugin's own source (WelkinCloudComponent.h /
// WelkinAtmosphereTypes.h / WelkinStarActor.h / Welkin.uplugin). Nothing is listed that the
// code doesn't actually do — no rings, no eclipse shadows, no multiplayer claim.
export const features: Feature[] = [
	{
		title: 'Volumetric clouds with real structure',
		description:
			'Four layer types — a flat stratus deck, fair-weather cumulus, deep rain-bearing nimbostratus, and towering cumulonimbus with anvils — all grown from one shared convection field rather than four separate systems. Storms carry their own lightning, lit from inside the cloud.',
	},
	{
		title: 'Atmosphere derived from physics, not a tint',
		description:
			"Rayleigh scattering, Mie haze, an ozone-shaped layered absorber and a uniform gas absorber, each per kilometre. Fourteen presets — Earth-like, Mars, Venus, Titan, the four ice/gas giants, ocean, desert and ice worlds, a thin trace atmosphere, and vacuum — plus full manual override of every coefficient.",
	},
	{
		title: "Weather that isn't a uniform haze",
		description:
			'Coverage is driven by one weather field with cyclones, frontal bands and latitude banding for gas giants, so clear sky and solid overcast both actually occur. Paint coverage by hand on a 2,048×1,024 equirectangular map, or pin a thunderstorm exactly where you want one.',
	},
	{
		title: 'One height field, sphere or plane',
		description:
			"The same signed height field answers \"how far above the ground, which way is up\" for a planet's surface and for a flat map. Orbit and ground level read the same terrain, so nothing changes shape when you fly down to it.",
	},
	{
		title: 'A star with a real black-body colour',
		description:
			"Place a Welkin Star, pick a spectral type from O to M (or set temperature, radius and mass directly), and its colour comes out of the temperature — nothing is tinted by hand. Illuminance is physical: about 128,000 lux at one astronomical unit for a Sun-like star, falling off by the inverse square.",
	},
	{
		title: 'Orbits with a real period, not a slider',
		description:
			"Any actor can orbit a star or another planet — moons around planets, stations around moons. Periods come from Kepler's third law and the star's mass, not a typed-in number, and position is a closed-form function of time: no integrator, no drift, and scrubbing time backwards works.",
	},
	{
		title: 'The camera rides along near a planet',
		description:
			"A body on a short orbit can move tens of thousands of kilometres a second. Close to a planet's surface the camera — and, optionally, nearby ships and stations — take the same step the planet just took, so the ground holds still under your feet instead of sliding out from under the world.",
	},
	{
		title: 'Self-contained, and plays fair with others',
		description:
			"Doesn't use the engine's Volumetric Cloud or Sky Atmosphere, and doesn't write to project-wide CVars. Drop it into an empty UE5.5 project and it works; drop it beside a terrain or another atmosphere plugin and it still reads scene depth correctly rather than fighting for the sky.",
	},
];

export interface ComparisonRow {
	topic: string;
	welkin: string;
	typical: string;
}

export const comparisonRows: ComparisonRow[] = [
	{
		topic: 'Ground shape',
		welkin: 'Sphere or plane from the same height field — fly from orbit to the ground without the terrain changing shape.',
		typical: 'Built for a flat level; a planet usually needs a second, separate system.',
	},
	{
		topic: 'How it draws',
		welkin: 'A scene component. The raymarch runs right after the base pass, when scene depth is already correct.',
		typical: 'A full-screen post-process pass painted over the finished frame.',
	},
	{
		topic: 'Multiple skies in one scene',
		welkin: 'As many cloud and atmosphere components as the scene needs, sorted nearest-first.',
		typical: 'Usually one sky per scene — a second planet means a second scene or a workaround.',
	},
	{
		topic: 'Units',
		welkin: 'Lux, cd/m² and per-kilometre scattering coefficients throughout, end to end.',
		typical: 'An arbitrary "brightness" or "density" slider with no physical anchor.',
	},
	{
		topic: 'Day/night and orbits',
		welkin: 'A placeable star actor drives illumination, orbital periods and rotation from real quantities.',
		typical: 'Usually out of scope — needs a separate time-of-day or orbit plugin.',
	},
	{
		topic: 'Footprint in your project',
		welkin: "Doesn't touch project CVars or engine sky systems; coexists with other terrain/atmosphere plugins.",
		typical: 'Often configures engine-wide settings that other plugins then have to work around.',
	},
];
