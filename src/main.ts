import * as fs from "fs/promises";
import { fetchMenu, fetchShopInfo, fetchShopList } from "./fetch";
import { Menu } from "./Model/Menu";

(async () => {
	// ディレクトリを作成
	await fs.mkdir("./output/menu", { recursive: true });
	await fs.mkdir("./output/shop", { recursive: true });

	// メニュー一覧を取得
	// 1. カテゴリごとにJSONを作成
	// 2. 全メニューを収録したJSONを作成
	let menuList: Menu[] = [];
	for (let i = 1; i <= 8; i++) {
		const url = `https://hidakaya.hiday.co.jp/hits/ja/menu/2/list/${i}.html`;
		const response = await fetchMenu(url);
		const fileName = `./output/menu/${i}.json`;
		await writeJSONFile(fileName, response);

		menuList = menuList.concat(response.menu);
	}
	await writeJSONFile("./output/menu/all.json", menuList);

	// 店舗一覧を取得
	// 1. 店舗一覧JSONを作成
	// 2. 各店舗の情報を持ったJSONを作成
	let shopList = await fetchShopList();
	await writeJSONFile("./output/shop/all.json", shopList);
	const taskList = shopList.map(shop => (async () => {
		const fileName = `./output/shop/${shop.id}.json`;
		const shopInfo = await fetchShopInfo(shop.id);
		await writeJSONFile(fileName, shopInfo);
	})());
	await Promise.all(taskList);
})();

const writeJSONFile = async (fileName: string, object: Object) => {
	const json = JSON.stringify(object, null, "\t");
	const byteLength = Buffer.byteLength(json);
	await fs.writeFile(fileName, json)
	console.log(`${fileName} was created (${byteLength} byte).`)
}