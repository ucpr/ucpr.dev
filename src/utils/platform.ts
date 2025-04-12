/**
 * Platform のスタイル情報を取得する
 */
export function getPlatformStyle(platform: string): {
	borderColor: string;
	textColor: string;
	darkBorderColor: string;
	darkTextColor: string;
} {
	// プラットフォームごとに色を設定
	switch (platform) {
		case "Zenn":
		case "Zenn Scraps":
			return {
				borderColor: "#3b82f6", // blue-500
				textColor: "#3b82f6", // blue-500
				darkBorderColor: "#60a5fa", // blue-400
				darkTextColor: "#60a5fa", // blue-400
			};
		case "Qiita":
			return {
				borderColor: "#55c500", // qiita green
				textColor: "#55c500", // qiita green
				darkBorderColor: "#55c500", // qiita green
				darkTextColor: "#55c500", // qiita green
			};
		case "note":
			return {
				borderColor: "#41c9b4", // note teal
				textColor: "#41c9b4", // note teal
				darkBorderColor: "#41c9b4", // note teal
				darkTextColor: "#41c9b4", // note teal
			};
        case "Findy Tools":
		case "Findy":
			return {
				borderColor: "#ea580c", // orange-600
				textColor: "#ea580c", // orange-600
				darkBorderColor: "#fdba74", // orange-300
				darkTextColor: "#fdba74", // orange-300
			};
		case "Speaker Deck":
			return {
				borderColor: "#10b981", // emerald-500
				textColor: "#10b981", // emerald-500
				darkBorderColor: "#6ee7b7", // emerald-300
				darkTextColor: "#6ee7b7", // emerald-300
			};
		case "YouTube":
			return {
				borderColor: "#ef4444", // red-500
				textColor: "#ef4444", // red-500
				darkBorderColor: "#fca5a5", // red-300
				darkTextColor: "#fca5a5", // red-300
			};
		default:
			return {
				borderColor: "#6b7280", // gray-500
				textColor: "#6b7280", // gray-500
				darkBorderColor: "#9ca3af", // gray-400
				darkTextColor: "#9ca3af", // gray-400
			};
	}
}
