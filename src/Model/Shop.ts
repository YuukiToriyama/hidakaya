export interface Shop {
	/** 店舗ID */
	id: number;
	/** 店舗名 */
	name: string;
	/** 店舗の所在地 */
	address: string;
	/** 店舗の電話番号 */
	tel: string;
	/** 開店時間 */
	open: string;
	/** 閉店時間 */
	close: string;
	/** ラストオーダー */
	lastOrder: string;
	/** 店舗URL */
	url: string;
	/** 備考 */
	note: string;
}
