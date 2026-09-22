// Every entry here is transcribed from the plugin's own source comments
// (WelkinStarActor.h / WelkinCloudComponent.h / WelkinAtmosphereTypes.h / WelkinTypes.h),
// not written from memory. Where a comment is condensed, the meaning is kept — nothing here
// describes a feature (rings, eclipse shadows, replication) that isn't actually in the code.

export interface PropertyDoc {
	name: string;
	type: string;
	default: string;
	description: string;
}

export interface ReferenceSection {
	id: string;
	title: string;
	subtitle: string;
	intro: string;
	properties: PropertyDoc[];
}

export const starActor: ReferenceSection = {
	id: 'star-actor',
	title: 'AWelkinStarActor — Welkin Star',
	subtitle: 'Place it, give it planets, and they orbit it and are lit by it.',
	intro:
		"Built as its own actor rather than reused from the in-house Helios plugin, on purpose: it doesn't need a photosphere with granulation and limb darkening, it needs a star that lights things correctly and that planets orbit. What it needs, that a generic sun doesn't give it, is that light arrives as Welkin's own sun direction — per cloud deck, per planet — which is what makes two stars in one scene possible at all.",
	properties: [
		{
			name: 'Spectral Type',
			type: 'enum (O · B · A · F · G · K · M)',
			default: 'G (5,800 K — the Sun)',
			description:
				'Sets a temperature, radius and mass unless the overrides below are non-zero. O is 30,000 K blue, M is a 3,200 K red dwarf.',
		},
		{
			name: 'Temperature K / Radius Solar / Mass Solar',
			type: 'double, double, double',
			default: '0 / 0 / 0 (take the spectral type\'s value)',
			description:
				"Override the spectral type's numbers individually. Mass is what sets every orbital period in the system — changing the star changes all of them, which is correct, and is why periods aren't typed in by hand.",
		},
		{
			name: 'Illuminance At 1AU (lux)',
			type: 'double',
			default: '0 (derived by Stefan–Boltzmann)',
			description:
				"Zero derives it from temperature and radius; for a Sun-like star that comes to about 128,000 lux, the measured value at the top of Earth's atmosphere.",
		},
		{
			name: 'Planets',
			type: 'array of FWelkinOrbiter',
			default: 'empty',
			description:
				'The bodies going round this star — see the orbiter table below. Any actor can be added: a Welkin planet, a moon, a station.',
		},
		{
			name: 'Time Scale',
			type: 'double',
			default: '1.0',
			description: 'Seconds of simulated time per second of real time.',
		},
		{
			name: 'Advance Time',
			type: 'bool',
			default: 'true',
			description:
				'Moves the bodies, on in the editor as well — so a system can be watched turning without pressing Play, and dragging a planet is visibly overridden rather than silently ignored.',
		},
		{
			name: 'Drive Welkin Lighting',
			type: 'bool',
			default: 'true',
			description:
				"Points every orbiting Welkin planet's sun direction at this star, and hands it this star's colour and illuminance at that planet's actual distance.",
		},
		{
			name: 'Drive Directional Light',
			type: 'bool',
			default: 'true',
			description:
				"Lights the rest of the scene, not only Welkin's own sky — an ordinary mesh in the level is lit by whatever directional light the star drives (direction, colour and lux). The light must be Movable; a Static one is baked and ignores this. With two stars, only the one with this switched on drives it.",
		},
		{
			name: 'Corona Strength',
			type: 'double',
			default: '120',
			description:
				"Multiple of the physically-real corona (1 is physical, and physical means invisible — the corona is about a millionth of the photosphere). The shape (two power laws plus radial streamers) stays honest at any value; this only lifts how visible it is.",
		},
		{
			name: 'Carry Nearby Camera',
			type: 'bool',
			default: 'true',
			description:
				"A body on a short orbit can travel tens of thousands of kilometres a second. Rather than holding it still or shifting the whole world, the camera is given the same displacement the body just took, weighted by proximity — full weight within a planet radius of the surface, none past ten radii, smooth in between.",
		},
		{
			name: 'Carry Nearby Actors',
			type: 'bool',
			default: 'true',
			description:
				'Moves ordinary movable actors near a planet the same way — ships, stations, anything on the ground or in orbit — so nothing is left behind at orbital speed. Skips the star, the bodies in Planets, lights, and anything already attached to something else.',
		},
	],
};

export const orbiter: ReferenceSection = {
	id: 'orbiter',
	title: 'FWelkinOrbiter — one entry in Planets',
	subtitle: 'One body going round the star (or, by the same mechanism, around another planet).',
	intro:
		"Orbits are a function of time, not an integrator: given a second, position follows in closed form. That means time can be scrubbed backwards, the same second always gives the same frame, and nothing drifts however long it runs. The period comes from Kepler's third law and the star's mass — it isn't a separate number someone types in.",
	properties: [
		{
			name: 'Body',
			type: 'soft actor reference',
			default: '—',
			description: 'The actor that orbits. Anything: a Welkin planet, a moon, a station.',
		},
		{
			name: 'Keep In Place',
			type: 'bool',
			default: 'false',
			description:
				"On: the actor stays exactly where you placed it, and the orbit drives only the light — one astronomical unit is 1.5×10¹³ Unreal units, so simply adding a body to the list would otherwise teleport it 150 million km away. With this on, the star still works out where the body would be and aims sunlight and its strength accordingly. Off: the transform really moves, for a system with several bodies you want to watch travel.",
		},
		{
			name: 'Orbit Radius (km)',
			type: 'double',
			default: '1,500,000 km',
			description:
				"The orbit the body actually travels, in kilometres. Deliberately separate from Semi-Major Axis (AU): at the real distance a star and a planet can never be framed by the same camera, so this is the distance you set to something you can look at, while the AU value keeps the light physically correct.",
		},
		{
			name: 'Orbit Period (seconds) / Spin Period (seconds)',
			type: 'double, double',
			default: '120 s / 20 s',
			description:
				"How long one lap, and one day, take in real seconds — deliberately fast so the motion is visible in an editor session (the physical period at 1 AU is a year, effectively invisible). Set Physical Periods to use the real numbers instead.",
		},
		{
			name: 'Physical Periods',
			type: 'bool',
			default: 'false',
			description:
				"Uses Kepler's third law from the semi-major axis and the star's mass for the orbit, and Day Length Hours for the spin, both stretched by the star's Time Scale.",
		},
		{
			name: 'Semi-Major Axis (AU)',
			type: 'double',
			default: '1.0',
			description:
				'How far out it circles, in astronomical units — this is what the light is computed from even with Keep In Place on. Earth is 1.0, Mars 1.52, Jupiter 5.20.',
		},
		{
			name: 'Eccentricity / Inclination (°) / Phase (°)',
			type: 'double, double, double',
			default: '0 / 0 / 0',
			description:
				'Shape and tilt of the orbit, and the starting point around it. Above about 0.8 eccentricity the solver starts from a different initial guess, because Newton\'s method from the mean anomaly stops converging there.',
		},
		{
			name: 'Day Length (hours) / Axial Tilt (°)',
			type: 'double, double',
			default: '24 h / 23.44°',
			description:
				'Length of one day, and the tilt of the spin axis from the orbit normal — this is what gives seasons. Zero day length stops the body spinning.',
		},
		{
			name: 'Tidally Locked',
			type: 'bool',
			default: 'false',
			description:
				"Keeps one face always toward the star, using the orbital period itself rather than a day length typed to match it — matched numbers drift apart the first time the orbit changes.",
		},
	],
};

export const cloudActor: ReferenceSection = {
	id: 'cloud-actor',
	title: 'AWelkinCloudActor — a planet\'s clouds and air in one actor',
	subtitle: 'A convenience actor that owns four cloud decks and keeps them in agreement.',
	intro:
		'Four UWelkinCloudComponents in one actor: the low deck (fair-weather cumulus you can fly through), a middle deck (4–6 km), a thin high deck (8–11 km), and a separate storm deck deep enough for a cumulonimbus tower to climb — a taller low deck alone would turn the fair-weather sky into a wall of cloud, at roughly three times the frame cost. The ground shape, radius and star belong to the low deck; the actor copies them down to the other three on construction, because a planet and its air are one thing, not four disagreeing components.',
	properties: [
		{
			name: 'Cloud Component',
			type: 'UWelkinCloudComponent',
			default: '—',
			description: 'The low deck. Carries the ground (sphere/plane) and the atmosphere for the whole actor.',
		},
		{
			name: 'Mid Cloud Component',
			type: 'UWelkinCloudComponent',
			default: '—',
			description: 'The middle deck, 4–6 km up.',
		},
		{
			name: 'High Cloud Component',
			type: 'UWelkinCloudComponent',
			default: '—',
			description: 'Thin high cloud, 8–11 km up.',
		},
		{
			name: 'Storm Cloud Component',
			type: 'UWelkinCloudComponent',
			default: '—',
			description: 'A sparse deck deep enough for cumulonimbus towers and anvils to grow in.',
		},
	],
};

export const cloudComponent: ReferenceSection = {
	id: 'cloud-component',
	title: 'UWelkinCloudComponent — the core dials',
	subtitle: "The most-used properties on each deck. Advanced tuning knobs live under the component's Advanced categories in the Details panel.",
	intro:
		"A UWelkinCloudComponent is a scene component: several can coexist, and each one's march runs where scene depth is already correct. Ground shape defaults to Sphere for a reason — a Plane component dropped in front of the camera puts a deck in the sky straight away, while a Sphere component six thousand kilometres in radius, placed anywhere but its own centre, would otherwise put the camera underground.",
	properties: [
		{
			name: 'Shape',
			type: 'enum (Sphere · Plane)',
			default: 'Sphere',
			description:
				"Sphere: the component's location is the centre of a planet of Ground Radius (km). Plane: the component's location is a point on flat ground, +Z is up. Not two code paths — one height-and-up answer, read two ways.",
		},
		{
			name: 'Ground Radius (km)',
			type: 'float',
			default: '6,371 km (Earth)',
			description: 'Planet radius. Sphere shape only.',
		},
		{
			name: 'Terrain',
			type: 'bool',
			default: 'false',
			description: 'Draws the ground itself as a surface, not merely as the place rays stop.',
		},
		{
			name: 'Planet Type',
			type: 'enum (Earth-like · Desert · Mars · Moon · Ice Moon · Titan · Volcanic · Ocean)',
			default: 'Earth-like',
			description: 'Sets the ground reflectances, sea level and snow line together.',
		},
		{
			name: 'Land Fraction',
			type: 'float 0–1',
			default: '0 (take the planet type\'s value)',
			description:
				'How much of the surface is land, as a fraction — not a height. The height field is turned into the matching threshold internally, so asking for 0.29 (Earth) gives 0.29, rather than a raw threshold that has no direct relation to land area.',
		},
		{
			name: 'Layer Bottom / Top (km)',
			type: 'float, float',
			default: '1.5 km / 10.5 km',
			description:
				'Cloud layer altitude above the ground, as absolute lengths (never a fraction of the radius — a fraction would give a small planet a layer a few metres thick). The low deck reaches nearly to the tropopause so a storm column has room to climb.',
		},
		{
			name: 'Cloud Type',
			type: 'enum (Stratus · Cumulus · Cumulonimbus · Nimbostratus)',
			default: 'Cumulus',
			description:
				'A vertical profile, nothing else — a deck, a fair-weather cumulus and a thunderhead are the same field of coverage; what differs is how far each column is allowed to fill and what shape the top takes.',
		},
		{
			name: 'Coverage',
			type: 'float 0–1',
			default: '0.32',
			description:
				'Cloud amount. Measured against reference photographs rather than chosen by eye — coverage compounds across stacked decks as 1 − (1 − a)(1 − b)(1 − c), so each deck sits well below the figure the whole sky should show.',
		},
		{
			name: 'Storm Amount',
			type: 'float 0–1',
			default: '0',
			description:
				'How much of the deck is allowed to build a full-height tower. Zero leaves a plain deck; towers need a layer deep enough to hold them.',
		},
		{
			name: 'Lightning',
			type: 'float (brightness, 0 = off)',
			default: '1.0',
			description:
				"A light source inside the cloud rather than a drawn bolt — lights the surrounding cloud from within, dark at every cell face. Only reaches the shader for a Nimbostratus or Cumulonimbus deck, or a deck growing storm towers; a fair-weather deck can't flash regardless of this value.",
		},
		{
			name: 'Weather Map Amount / Cyclone Amount / Band Amount',
			type: 'float',
			default: '0.75 / 0 / 0',
			description:
				'How strongly coverage follows the shared weather field, how strongly cyclones form within it, and (for gas giants) how strongly coverage is banded by latitude. Zero band amount is a terrestrial world; above zero, pale cloudy zones alternate with clearer belts.',
		},
		{
			name: 'Drift (km/hour)',
			type: 'float',
			default: '45',
			description: 'How fast the weather field itself moves.',
		},
		{
			name: 'Atmosphere / Atmosphere Type',
			type: 'bool, enum (15 types incl. None)',
			default: 'true / Earth-like',
			description:
				"Draws air around this ground; several components can each draw their own, so a scene can hold as many atmospheres as it needs. Earth-like, Ocean World, Desert World, Ice World, Volcanic, Mars, Venus, Titan, Jupiter, Saturn, Uranus, Neptune, Hot Jupiter, Thin, or None (vacuum).",
		},
		{
			name: 'Override Atmosphere',
			type: 'bool + FWelkinAtmosphereParams',
			default: 'false',
			description:
				'Off: the type decides every coefficient. On: every Rayleigh/Mie/absorption value below becomes directly editable, pre-filled from whichever type was last selected as a starting point rather than a blank one.',
		},
		{
			name: 'Clouds',
			type: 'bool',
			default: 'true',
			description: 'Draws this deck\'s cloud layer. Off leaves a bare atmosphere.',
		},
		{
			name: 'Use Scene Sun Light',
			type: 'bool',
			default: 'true',
			description:
				"Takes sun direction and colour from the level's first directional light. Turn off (or leave no directional light in the level) to use Sun Direction / Sun Colour / Sun Illuminance directly.",
		},
		{
			name: 'Sun Illuminance (lux)',
			type: 'float',
			default: '128,000 lux',
			description: "A real physical unit, not a strength slider — 128,000 lux is a Sun-like star at one astronomical unit.",
		},
		{
			name: 'Paint Amount',
			type: 'float 0–1',
			default: '1.0',
			description:
				'How strongly a hand-painted coverage map (see Paint Coverage below) moves the Coverage dial locally, without changing the cloud shapes or edges themselves.',
		},
	],
};

export const atmosphereParams: ReferenceSection = {
	id: 'atmosphere-params',
	title: 'FWelkinAtmosphereParams — manual atmosphere override',
	subtitle: 'Editable once Override Atmosphere is switched on. Every coefficient is per kilometre.',
	intro:
		'One rule decides every number here: the colour of a sky is a tug of war between what scatters and what absorbs. Rayleigh always votes blue, so a sky that isn\'t blue is one where something is eating the other end of the spectrum — Titan is orange because tholin haze eats blue, Uranus is cyan because methane eats red, not because either was tinted by hand.',
	properties: [
		{
			name: 'Height (km)',
			type: 'float',
			default: '100 km',
			description: 'Thickness of the modelled atmosphere above the ground.',
		},
		{
			name: 'Rayleigh Scattering / Scale Height (km)',
			type: 'FVector3f, float',
			default: '(5.8, 13.6, 33.1)×10⁻³ · 8 km',
			description: "Molecular scattering at the ground and the height it falls off over — this is a gas, so the scale height applies to the whole column.",
		},
		{
			name: 'Mie Scattering / Absorption / Scale Height (km) / Anisotropy',
			type: 'float, FVector3f, float, float',
			default: '0.030 · 4.4×10⁻³ · 1.2 km · 0.72',
			description:
				'Haze and dust. Scattering is close to grey; absorption is not — that is where a butterscotch or orange sky comes from. Aerosols settle, so the scale height is short, unlike a gas mixed through the whole column.',
		},
		{
			name: 'Uniform Absorption',
			type: 'FVector3f',
			default: '0',
			description:
				"A gas mixed evenly through the whole column, absorbing with no height profile — the methane that makes Uranus cyan at every altitude, not only at one tuned height.",
		},
		{
			name: 'Layered Absorption / Centre (km) / Width (km)',
			type: 'FVector3f, float, float',
			default: '(0.65, 1.88, 0.09)×10⁻³ · 25 km · 15 km',
			description:
				'An ozone-shaped absorber: a tent centred somewhere above the ground. This is what puts the blue-grey band between an orange horizon and a blue zenith at sunset.',
		},
		{
			name: 'Ground Albedo',
			type: 'FVector3f',
			default: '(0.16, 0.20, 0.32)',
			description:
				'What the ground sends back up into the air. Not decoration — looking down at a planet, most of what the air scatters toward the eye arrived from below, not straight from the star. A gas giant has no surface, so this stands for its deep cloud deck.',
		},
		{
			name: 'Shadow Softness (km)',
			type: 'float',
			default: '45 km',
			description:
				"How far the planet's own shadow takes to close. A length, never a fraction of the radius — a percentage of Earth's radius would be wider than the whole atmosphere and swallow the twilight, because the star isn't a point and the air doesn't end at a line.",
		},
	],
};

export const paintFunctions = [
	{
		signature: 'PaintCoverage(WorldLocation, RadiusKm, Strength, bErase, ViewLocation)',
		description:
			"Pushes coverage toward cloud (or clear sky, if Erase) around WorldLocation by Strength at the centre, falling smoothly to nothing at RadiusKm along the ground. Stored on a 2,048×1,024 equirectangular map — about 20 km per texel at the equator, sized for weather systems rather than single clouds.",
	},
	{
		signature: 'ClearCoveragePaint()',
		description: 'Forgets everything painted on this deck.',
	},
	{
		signature: 'AddStormPin(WorldLocation) / RemoveNearestStormPin(WorldLocation)',
		description: 'Pins a thunderhead at a world location (keeps the latest four), or removes the nearest pin.',
	},
];

export const limitations: string[] = [
	"No planetary rings. There's no ring geometry, analytic or otherwise, anywhere in the plugin.",
	'No eclipse or shadow-casting between bodies. A planet does not currently cast a shadow onto another planet, a moon, or its rings (which don\'t exist either).',
	"Multiplayer / replication has not been built or tested. There is no replication code in the plugin; treat it as single-process until it's actually verified.",
	'The engine\'s own Volumetric Cloud and Sky Atmosphere components are not used and are not required — but they are also not disabled for you if a level already has them switched on.',
	'Currently in beta (as marked in the plugin descriptor) while a visual issue is being fixed ahead of the Fab listing going live.',
];
