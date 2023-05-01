import * as fs from 'fs/promises'
import { CategoryDAO } from './Database/CategoryDAO'
import { DAO } from './Database/DAO'
import { MenuDAO } from './Database/MenuDAO'
import { ShopDAO } from './Database/ShopDAO'
import { fetchMenuList, fetchShopInfo, fetchShopList } from './fetch'
import { Menu } from './Model/Menu';

(async () => {
	// ディレクトリを作成
	await fs.mkdir('./output/menu', { recursive: true })
	await fs.mkdir('./output/shop', { recursive: true })
	await fs.mkdir('./output/sqlite', { recursive: true })
	// データベースへアクセス
	const connection = new DAO('./output/sqlite/hidakaya.db').connection

	// メニュー一覧を取得
	// 1. カテゴリごとにJSONを作成
	// 2. 全メニューを収録したJSONを作成
	let menuList: Menu[] = []
	for (let i = 1; i <= 8; i++) {
		const url = `https://hidakaya.hiday.co.jp/hits/ja/menu/2/list/${i}.html`
		const response = await fetchMenuList(url)
		const fileName = `./output/menu/${i}.json`
		await writeJSONFile(fileName, response)

		menuList = menuList.concat(response)
	}
	await writeJSONFile('./output/menu/all.json', menuList)
	// 3. hidakaya.dbにmenuテーブルを作成
	const menuDAO = new MenuDAO(connection)
	await menuDAO.createTable()
	await menuDAO.insert(menuList)
	await menuDAO.close()
	// 4. hidakaya.dbにcategoryテーブルを作成
	const categoryDAO = new CategoryDAO(connection)
	await categoryDAO.createTable()
	await categoryDAO.close()

	// 店舗一覧を取得
	// 1. 店舗一覧JSONを作成
	// 2. 各店舗の情報を持ったJSONを作成
	// 3. hidakaya.dbにshopテーブルを作成
	const shopList = await fetchShopList()
	const shopDAO = new ShopDAO(connection)
	await shopDAO.createTable()
	await writeJSONFile('./output/shop/all.json', shopList)
	const taskList = shopList.map(shop => (async () => {
		const fileName = `./output/shop/${shop.id}.json`
		const shopInfo = await fetchShopInfo(shop.id)
		await writeJSONFile(fileName, shopInfo)
		await shopDAO.insert(shopInfo)
	})())
	await Promise.all(taskList)
	await shopDAO.close()

	connection.close()
})()

const writeJSONFile = async (fileName: string, object: unknown) => {
	const json = JSON.stringify(object, null, '\t')
	const byteLength = Buffer.byteLength(json)
	await fs.writeFile(fileName, json)
	console.log(`${fileName} was created (${byteLength} byte).`)
}