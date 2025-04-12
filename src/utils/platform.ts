/**
 * Platform のスタイル情報を取得する
 */
export function getPlatformStyle(platform: string): {
	backgroundColor: string;
	textColor: string;
	darkBackgroundColor: string;
	darkTextColor: string;
} {
	// プラットフォームごとに色を設定
	switch (platform) {
		case "Zenn":
		case "Zenn Scraps":
			return {
				backgroundColor: "#edf2f7", // light blue-gray
				textColor: "#3b82f6", // blue-500
				darkBackgroundColor: "#1e293b", // dark blue-gray
				darkTextColor: "#60a5fa", // blue-400
			};
		case "Qiita":
			return {
				backgroundColor: "#e6f0ff", // light green-blue
				textColor: "#55c500", // qiita green
				darkBackgroundColor: "#0d3321", // dark green
				darkTextColor: "#55c500", // qiita green
			};
		case "note":
			return {
				backgroundColor: "#f3f4f6", // light gray
				textColor: "#41c9b4", // note teal
				darkBackgroundColor: "#1f2937", // dark gray
				darkTextColor: "#41c9b4", // note teal
			};
		case "Findy":
			return {
				backgroundColor: "#ffedd5", // light orange
				textColor: "#ea580c", // orange-600
				darkBackgroundColor: "#431407", // dark orange
				darkTextColor: "#fdba74", // orange-300
			};
		case "Speaker Deck":
			return {
				backgroundColor: "#ecfdf5", // light green
				textColor: "#10b981", // emerald-500
				darkBackgroundColor: "#064e3b", // dark emerald
				darkTextColor: "#6ee7b7", // emerald-300
			};
		case "YouTube":
			return {
				backgroundColor: "#fee2e2", // light red
				textColor: "#ef4444", // red-500
				darkBackgroundColor: "#450a0a", // dark red
				darkTextColor: "#fca5a5", // red-300
			};
		default:
			return {
				backgroundColor: "#f3f4f6", // light gray
				textColor: "#6b7280", // gray-500
				darkBackgroundColor: "#374151", // dark gray
				darkTextColor: "#9ca3af", // gray-400
			};
	}
}
