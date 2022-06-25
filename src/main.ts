import * as fs from "fs/promises";
import { fetchMenu, fetchShopInfo, fetchShopList } from "./fetch";
import { Menu } from "./Model/Menu";

(async () => {
	// ディレクトリを作成
	await fs.mkdir("./output/menu", { recursive: true });
	await fs.mkdir("./output/shop", { recursive: true });

	// メニュー一覧を取得
	let menuList: Menu[] = [];
	for (let i = 1; i <= 8; i++) {
		const url = `https://hidakaya.hiday.co.jp/hits/ja/menu/2/list/${i}.html`;
		const response = await fetchMenu(url);
		const fileName = `./output/menu/${i}.json`;
		await fs.writeFile(fileName, JSON.stringify(response, null, "\t"));
		console.log(`${fileName} was created.`);
		menuList = menuList.concat(response.menu);
	}
	await fs.writeFile(
		"./output/menu/all.json",
		JSON.stringify(menuList, null, "\t")
	);
	console.log(`./output/menu/all.json was created.`);

	// 店舗一覧を取得
	let shopList = await fetchShopList();
	await fs.writeFile(
		"./output/shop/all.json",
		JSON.stringify(shopList, null, "\t")
	);
	console.log("./output/shop/all.json was created.");
	for (let shop of shopList) {
		const shopInfo = await fetchShopInfo(shop.id);
		const fileName = `./output/shop/${shop.id}.json`;
		await fs.writeFile(fileName, JSON.stringify(shopInfo, null, "\t"));
		console.log(`${fileName} was created`);
	}
})();
