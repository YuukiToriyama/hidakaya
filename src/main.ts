import { CategoryDAO } from './Database/CategoryDAO.ts'
import { DAO } from './Database/DAO.ts'
import { MenuDAO } from './Database/MenuDAO.ts'
import { ShopDAO } from './Database/ShopDAO.ts'
import { fetchMenuList, fetchShopInfo, fetchShopList } from './fetch.ts'
import { Menu } from './Model/Menu.ts'

const writeJSONFile = async (fileName: string, object: unknown) => {
	try {
		const json = JSON.stringify(object, null, '\t')
		const byteLength = new TextEncoder().encode(json).length
		await Deno.writeTextFile(fileName, json)
		console.log(`${fileName} was created (${byteLength} byte).`)
	} catch (error) {
		console.error(`Failed to write JSON file ${fileName}:`, error)
		throw error
	}
}

(async () => {
	// ディレクトリを作成
	await Deno.mkdir('./output/menu', { recursive: true })
	await Deno.mkdir('./output/shop', { recursive: true })
	await Deno.mkdir('./output/sqlite', { recursive: true })
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
	menuDAO.createTable()
	menuDAO.insert(menuList)
	// 4. hidakaya.dbにcategoryテーブルを作成
	const categoryDAO = new CategoryDAO(connection)
	categoryDAO.createTable()

	// 店舗一覧を取得
	// 1. 店舗一覧JSONを作成
	// 2. 各店舗の情報を持ったJSONを作成
	// 3. hidakaya.dbにshopテーブルを作成
	const shopList = await fetchShopList()
	const shopDAO = new ShopDAO(connection)
	shopDAO.createTable()
	await writeJSONFile('./output/shop/all.json', shopList)
	const taskList = shopList.map((shop) =>
		(async () => {
			const fileName = `./output/shop/${shop.id}.json`
			const shopInfo = await fetchShopInfo(shop.id)
			await writeJSONFile(fileName, shopInfo)
			shopDAO.insert(shopInfo)
		})()
	)
	await Promise.all(taskList)

	connection.close()
})()
