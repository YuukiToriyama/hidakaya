import { JSDOM } from "jsdom";
import { Menu } from "./Model/Menu";
import { Shop } from "./Model/Shop";

/**
 * メニュー一覧ページからメニューをスクレイピングする
 * @param url メニューページのURL
 * @returns カテゴリ名とメニューの一覧
 */
export const fetchMenu = async (url: string) => {
	let menuList: Menu[] = [];
	const jsdom = await JSDOM.fromURL(url);
	const article = jsdom.window.document.getElementsByClassName("art01")[0];
	const title = (
		article.getElementsByClassName("tit03")[0] as HTMLHeadingElement
	).innerHTML;
	const ul = article.getElementsByClassName("box01")[0];
	for (let i = 0; i < ul.childElementCount; i++) {
		const li = ul.children.item(i);
		const href = li.getElementsByTagName("a")[0].href;
		const thumbnail = li.getElementsByTagName("img")[0].src;
		const dd = li.getElementsByTagName("dd")[0];
		const name = dd.getElementsByTagName("span")[0].innerHTML;
		const price = dd.getElementsByTagName("span")[1].innerHTML;
		menuList.push({
			name: name,
			price: parseInt(price),
			href: href,
			thumbnail: thumbnail,
		});
	}
	return {
		category: title,
		menu: menuList,
	};
};

/**
 * 店舗の一覧を取得
 * @returns 店舗一覧
 */
export const fetchShopList = async () => {
	const shopList: {
		name: string;
		href: string;
		id: number;
	}[] = [];
	const jsdom = await JSDOM.fromURL(
		"https://hidakaya.hiday.co.jp/hits/ja/shop/99/list.html"
	);
	const ul = jsdom.window.document.getElementsByClassName("ac_body")[0];
	for (let i = 0; i < ul.childElementCount; i++) {
		const li = ul.children[i];
		const a = li.getElementsByTagName("a")[0];
		const name = a.innerHTML;
		const href = a.href;
		const id = href.match(/(\d+).html$/)[1];
		shopList.push({
			name: a.innerHTML,
			href: a.href,
			id: parseInt(id),
		});
	}
	return shopList;
};

/**
 * 店舗IDから店舗詳細情報を取得
 * @param shopId 店舗ID
 * @returns 店舗詳細情報
 */
export const fetchShopInfo = async (shopId: number): Promise<Shop> => {
	const shop: Shop = {
		id: shopId,
		name: "",
		address: "",
		tel: "",
		open: "",
		close: "",
		lastOrder: "",
		url: `https://hidakaya.hiday.co.jp/hits/ja/shop/99/detail/${shopId}.html`,
		note: "",
	};
	const jsdom = await JSDOM.fromURL(shop.url);
	// 店舗名を取得
	shop.name = jsdom.window.document.getElementsByClassName("name")[0].innerHTML;
	// 店舗詳細を取得
	const div = jsdom.window.document.getElementsByClassName("status")[0];
	const tbody = div.getElementsByTagName("tbody")[0];
	for (let i = 0; i < tbody.childElementCount; i++) {
		const cells = (tbody.children[i] as HTMLTableRowElement).cells;
		const columnName = cells[0].innerHTML.trim();
		const columnData = cells[1].innerHTML.trim();
		if (columnName.includes("所在地")) {
			shop.address = columnData;
		} else if (columnName.includes("TEL")) {
			shop.tel = columnData;
		} else if (columnName.includes("開店時間")) {
			shop.open = columnData;
		} else if (columnName.includes("閉店時間")) {
			shop.close = columnData;
		} else if (columnName.includes("ラストオーダー")) {
			shop.lastOrder = columnData;
		} else if (columnName.includes("備考")) {
			shop.note = columnData;
		}
	}
	return shop;
};
