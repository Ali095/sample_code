/**
 * Generates a random hexa color string.
 *
 * Note: It will generate color without hash(#) like for blue color it will generate "1317EB" instead of "#1317EB"
 * @returns Hexa color string
 */
export const generateHexColor = (): string => {
	let hexColor = "";
	for (let i = 0; i < 6; i++) {
		hexColor += Math.floor(Math.random() * 16).toString(16).toUpperCase();
	}
	return hexColor;
};
