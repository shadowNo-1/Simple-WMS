"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// 定义支持的语言
export type Language = "zh-CN" | "en-US" | "ja-JP"

// 定义语言上下文类型
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 翻译文本
const translations = {
  "zh-CN": {
    // 通用
    "app.name": "SimpleWMS",
    "app.copyright": "版权所有",

    // 导航
    "nav.dashboard": "仪表盘",
    "nav.inventory": "库存管理",
    "nav.transactions": "出入库操作",
    "nav.codes": "条码/二维码",
    "nav.check": "库存盘点",
    "nav.settings": "系统设置",

    // 用户菜单
    "user.profile": "个人中心",
    "user.settings": "系统设置",
    "user.language": "语言",
    "user.logout": "退出登录",

    // 仓库
    "warehouse.select": "选择仓库",
    "warehouse.manage": "管理仓库",

    // 首页
    "home.title": "简易仓库管理系统",
    "home.description": "高效管理您的仓库库存，轻松处理出入库操作，支持条形码和二维码扫描。",
    "home.get.started": "开始使用",
    "home.features.title": "主要功能",
    "home.features.subtitle": "我们的系统提供您所需的所有基本仓库管理功能",
    "home.feature.inventory.title": "库存管理",
    "home.feature.inventory.desc": "查看和管理您的库存，包括库存水平、产品详情和库存位置。",
    "home.feature.barcode.title": "条码/二维码",
    "home.feature.barcode.desc": "生成和扫描条形码或二维码，简化出入库流程。",
    "home.feature.check.title": "库存盘点",
    "home.feature.check.desc": "进行库存盘点并生成详细报告，确保库存准确性。",
    "home.terms": "条款",
    "home.privacy": "隐私政策",
    "home.login": "登录",

    // 入库页面
    "inventory.in.title": "入库操作",
    "inventory.in.subtitle": "添加产品到库存",
    "inventory.in.info": "入库信息",
    "inventory.in.info.desc": "填写入库的基本信息",
    "inventory.in.reference": "参考号",
    "inventory.in.reference.placeholder": "输入采购单号或其他参考号",
    "inventory.in.source": "来源",
    "inventory.in.source.purchase": "采购",
    "inventory.in.source.return": "退货",
    "inventory.in.source.transfer": "调拨",
    "inventory.in.source.other": "其他",
    "inventory.in.notes": "备注",
    "inventory.in.notes.placeholder": "输入备注信息（可选）",
    "inventory.in.add.product": "添加产品",
    "inventory.in.add.product.desc": "选择要入库的产品和数量",
    "inventory.in.product": "产品",
    "inventory.in.quantity": "数量",
    "inventory.in.add": "添加",
    "inventory.in.scan": "扫码添加",
    "inventory.in.scan.guide": "将条码/二维码对准框内",
    "inventory.in.scan.result": "已扫描",
    "inventory.in.product.list": "入库产品列表",
    "inventory.in.product.list.desc": "已添加的产品列表",
    "inventory.in.product.empty": "尚未添加产品",
    "inventory.in.cancel": "取消",
    "inventory.in.complete": "完成入库",
    "inventory.in.success": "入库操作已完成",
    "inventory.in.production.date": "生产日期",
    "inventory.in.expiry.date": "有效期",
    "inventory.in.document": "入库单",
    "inventory.in.print": "打印入库单",
    "inventory.in.export": "导出入库单",

    // 出库页面
    "inventory.out.title": "出库操作",
    "inventory.out.subtitle": "从库存中移除产品",
    "inventory.out.info": "出库信息",
    "inventory.out.info.desc": "填写出库的基本信息",
    "inventory.out.reference": "参考号",
    "inventory.out.reference.placeholder": "输入销售单号或其他参考号",
    "inventory.out.destination": "去向",
    "inventory.out.destination.sale": "销售",
    "inventory.out.destination.return": "退货",
    "inventory.out.destination.transfer": "调拨",
    "inventory.out.destination.other": "其他",
    "inventory.out.notes": "备注",
    "inventory.out.notes.placeholder": "输入备注信息（可选）",
    "inventory.out.add.product": "添加产品",
    "inventory.out.add.product.desc": "选择要出库的产品和数量",
    "inventory.out.product": "产品",
    "inventory.out.quantity": "数量",
    "inventory.out.add": "添加",
    "inventory.out.scan": "扫码添加",
    "inventory.out.scan.guide": "将条码/二维码对准框内",
    "inventory.out.scan.result": "已扫描",
    "inventory.out.product.list": "出库产品列表",
    "inventory.out.product.list.desc": "已添加的产品列表",
    "inventory.out.product.empty": "尚未添加产品",
    "inventory.out.cancel": "取消",
    "inventory.out.complete": "完成出库",
    "inventory.out.success": "出库操作已完成",
    "inventory.out.available": "可用库存",
    "inventory.out.exceed": "超出可用库存！",
    "inventory.out.current.stock": "当前库存为",
    "inventory.out.document": "出库单",
    "inventory.out.print": "打印出库单",
    "inventory.out.export": "导出出库单",

    // 表格列
    "table.sku": "SKU",
    "table.name": "产品名称",
    "table.quantity": "数量",
    "table.location": "库位",
    "table.available": "可用库存",
    "table.actions": "操作",
    "table.production.date": "生产日期",
    "table.expiry.date": "有效期",
    "table.status": "状态",

    // 按钮
    "button.save": "保存",
    "button.cancel": "取消",
    "button.add": "添加",
    "button.edit": "编辑",
    "button.delete": "删除",
    "button.back": "返回",
    "button.print": "打印",
    "button.export": "导出",
    "button.close": "关闭",

    // 状态
    "status.normal": "正常",
    "status.expiring.soon": "即将过期",
    "status.expired": "已过期",

    // 提示
    "alert.scan.error": "扫描错误",
    "alert.try": "您可以尝试：",
    "alert.check.camera": "检查浏览器相机权限设置",
    "alert.manual.input": "使用手动输入方式添加产品",
    "alert.use.supported.browser": "使用支持相机访问的浏览器",
  },
  "en-US": {
    // General
    "app.name": "SimpleWMS",
    "app.copyright": "All Rights Reserved",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.inventory": "Inventory",
    "nav.transactions": "Transactions",
    "nav.codes": "Barcodes/QR Codes",
    "nav.check": "Inventory Check",
    "nav.settings": "Settings",

    // User Menu
    "user.profile": "Profile",
    "user.settings": "Settings",
    "user.language": "Language",
    "user.logout": "Logout",

    // Warehouse
    "warehouse.select": "Select Warehouse",
    "warehouse.manage": "Manage Warehouses",

    // Homepage
    "home.title": "Simple Warehouse Management System",
    "home.description":
      "Efficiently manage your warehouse inventory, easily handle inbound and outbound operations, with barcode and QR code scanning support.",
    "home.get.started": "Get Started",
    "home.features.title": "Key Features",
    "home.features.subtitle": "Our system provides all the essential warehouse management functions you need",
    "home.feature.inventory.title": "Inventory Management",
    "home.feature.inventory.desc":
      "View and manage your inventory, including stock levels, product details, and storage locations.",
    "home.feature.barcode.title": "Barcodes/QR Codes",
    "home.feature.barcode.desc": "Generate and scan barcodes or QR codes to simplify inbound and outbound processes.",
    "home.feature.check.title": "Inventory Check",
    "home.feature.check.desc": "Conduct inventory checks and generate detailed reports to ensure inventory accuracy.",
    "home.terms": "Terms",
    "home.privacy": "Privacy Policy",
    "home.login": "Login",

    // Inventory In
    "inventory.in.title": "Stock In",
    "inventory.in.subtitle": "Add products to inventory",
    "inventory.in.info": "Stock In Information",
    "inventory.in.info.desc": "Fill in the basic information for stock in",
    "inventory.in.reference": "Reference",
    "inventory.in.reference.placeholder": "Enter purchase order or other reference",
    "inventory.in.source": "Source",
    "inventory.in.source.purchase": "Purchase",
    "inventory.in.source.return": "Return",
    "inventory.in.source.transfer": "Transfer",
    "inventory.in.source.other": "Other",
    "inventory.in.notes": "Notes",
    "inventory.in.notes.placeholder": "Enter notes (optional)",
    "inventory.in.add.product": "Add Product",
    "inventory.in.add.product.desc": "Select products to add to inventory",
    "inventory.in.product": "Product",
    "inventory.in.quantity": "Quantity",
    "inventory.in.add": "Add",
    "inventory.in.scan": "Scan to Add",
    "inventory.in.scan.guide": "Align barcode/QR code within the frame",
    "inventory.in.scan.result": "Scanned",
    "inventory.in.product.list": "Stock In Product List",
    "inventory.in.product.list.desc": "Products added to the list",
    "inventory.in.product.empty": "No products added yet",
    "inventory.in.cancel": "Cancel",
    "inventory.in.complete": "Complete Stock In",
    "inventory.in.success": "Stock in operation completed",
    "inventory.in.production.date": "Production Date",
    "inventory.in.expiry.date": "Expiry Date",
    "inventory.in.document": "Stock In Document",
    "inventory.in.print": "Print Document",
    "inventory.in.export": "Export Document",

    // Inventory Out
    "inventory.out.title": "Stock Out",
    "inventory.out.subtitle": "Remove products from inventory",
    "inventory.out.info": "Stock Out Information",
    "inventory.out.info.desc": "Fill in the basic information for stock out",
    "inventory.out.reference": "Reference",
    "inventory.out.reference.placeholder": "Enter sales order or other reference",
    "inventory.out.destination": "Destination",
    "inventory.out.destination.sale": "Sale",
    "inventory.out.destination.return": "Return",
    "inventory.out.destination.transfer": "Transfer",
    "inventory.out.destination.other": "Other",
    "inventory.out.notes": "Notes",
    "inventory.out.notes.placeholder": "Enter notes (optional)",
    "inventory.out.add.product": "Add Product",
    "inventory.out.add.product.desc": "Select products to remove from inventory",
    "inventory.out.product": "Product",
    "inventory.out.quantity": "Quantity",
    "inventory.out.add": "Add",
    "inventory.out.scan": "Scan to Add",
    "inventory.out.scan.guide": "Align barcode/QR code within the frame",
    "inventory.out.scan.result": "Scanned",
    "inventory.out.product.list": "Stock Out Product List",
    "inventory.out.product.list.desc": "Products added to the list",
    "inventory.out.product.empty": "No products added yet",
    "inventory.out.cancel": "Cancel",
    "inventory.out.complete": "Complete Stock Out",
    "inventory.out.success": "Stock out operation completed",
    "inventory.out.available": "Available Stock",
    "inventory.out.exceed": "Exceeds available stock!",
    "inventory.out.current.stock": "Current stock is",
    "inventory.out.document": "Stock Out Document",
    "inventory.out.print": "Print Document",
    "inventory.out.export": "Export Document",

    // Table Columns
    "table.sku": "SKU",
    "table.name": "Product Name",
    "table.quantity": "Quantity",
    "table.location": "Location",
    "table.available": "Available Stock",
    "table.actions": "Actions",
    "table.production.date": "Production Date",
    "table.expiry.date": "Expiry Date",
    "table.status": "Status",

    // Buttons
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.add": "Add",
    "button.edit": "Edit",
    "button.delete": "Delete",
    "button.back": "Back",
    "button.print": "Print",
    "button.export": "Export",
    "button.close": "Close",

    // Status
    "status.normal": "Normal",
    "status.expiring.soon": "Expiring Soon",
    "status.expired": "Expired",

    // Alerts
    "alert.scan.error": "Scan Error",
    "alert.try": "You can try:",
    "alert.check.camera": "Check browser camera permissions",
    "alert.manual.input": "Use manual input to add products",
    "alert.use.supported.browser": "Use a browser that supports camera access",
  },
  "ja-JP": {
    // 一般
    "app.name": "SimpleWMS",
    "app.copyright": "全著作権所有",

    // ナビゲーション
    "nav.dashboard": "ダッシュボード",
    "nav.inventory": "在庫管理",
    "nav.transactions": "入出庫操作",
    "nav.codes": "バーコード/QRコード",
    "nav.check": "在庫確認",
    "nav.settings": "設定",

    // ユーザーメニュー
    "user.profile": "プロフィール",
    "user.settings": "設定",
    "user.language": "言語",
    "user.logout": "ログアウト",

    // 倉庫
    "warehouse.select": "倉庫を選択",
    "warehouse.manage": "倉庫管理",

    // ホームページ
    "home.title": "シンプル倉庫管理システム",
    "home.description":
      "倉庫の在庫を効率的に管理し、入出庫操作を簡単に処理し、バーコードとQRコードのスキャンをサポートします。",
    "home.get.started": "始める",
    "home.features.title": "主な機能",
    "home.features.subtitle": "当システムは必要な基本的な倉庫管理機能をすべて提供します",
    "home.feature.inventory.title": "在庫管理",
    "home.feature.inventory.desc": "在庫レベル、製品詳細、保管場所など、在庫を表示および管理します。",
    "home.feature.barcode.title": "バーコード/QRコード",
    "home.feature.barcode.desc": "バーコードまたはQRコードを生成およびスキャンして、入出庫プロセスを簡素化します。",
    "home.feature.check.title": "在庫確認",
    "home.feature.check.desc": "在庫確認を実施し、詳細なレポートを生成して在庫の正確性を確保します。",
    "home.terms": "利用規約",
    "home.privacy": "プライバシーポリシー",
    "home.login": "ログイン",

    // 入庫ページ
    "inventory.in.title": "入庫操作",
    "inventory.in.subtitle": "製品を在庫に追加",
    "inventory.in.info": "入庫情報",
    "inventory.in.info.desc": "入庫の基本情報を入力",
    "inventory.in.reference": "参照番号",
    "inventory.in.reference.placeholder": "発注書番号または他の参照を入力",
    "inventory.in.source": "入庫元",
    "inventory.in.source.purchase": "購入",
    "inventory.in.source.return": "返品",
    "inventory.in.source.transfer": "転送",
    "inventory.in.source.other": "その他",
    "inventory.in.notes": "備考",
    "inventory.in.notes.placeholder": "備考を入力（任意）",
    "inventory.in.add.product": "製品追加",
    "inventory.in.add.product.desc": "入庫する製品を選択",
    "inventory.in.product": "製品",
    "inventory.in.quantity": "数量",
    "inventory.in.add": "追加",
    "inventory.in.scan": "スキャンして追加",
    "inventory.in.scan.guide": "バーコード/QRコードをフレーム内に合わせてください",
    "inventory.in.scan.result": "スキャン済み",
    "inventory.in.product.list": "入庫製品リスト",
    "inventory.in.product.list.desc": "追加された製品リスト",
    "inventory.in.product.empty": "まだ製品が追加されていません",
    "inventory.in.cancel": "キャンセル",
    "inventory.in.complete": "入庫完了",
    "inventory.in.success": "入庫操作が完了しました",
    "inventory.in.production.date": "製造日",
    "inventory.in.expiry.date": "有効期限",
    "inventory.in.document": "入庫伝票",
    "inventory.in.print": "伝票印刷",
    "inventory.in.export": "伝票エクスポート",

    // 出庫ページ
    "inventory.out.title": "出庫操作",
    "inventory.out.subtitle": "在庫から製品を削除",
    "inventory.out.info": "出庫情報",
    "inventory.out.info.desc": "出庫の基本情報を入力",
    "inventory.out.reference": "参照番号",
    "inventory.out.reference.placeholder": "販売注文番号または他の参照を入力",
    "inventory.out.destination": "出庫先",
    "inventory.out.destination.sale": "販売",
    "inventory.out.destination.return": "返品",
    "inventory.out.destination.transfer": "転送",
    "inventory.out.destination.other": "その他",
    "inventory.out.notes": "備考",
    "inventory.out.notes.placeholder": "備考を入力（任意）",
    "inventory.out.add.product": "製品追加",
    "inventory.out.add.product.desc": "出庫する製品を選択",
    "inventory.out.product": "製品",
    "inventory.out.quantity": "数量",
    "inventory.out.add": "追加",
    "inventory.out.scan": "スキャンして追加",
    "inventory.out.scan.guide": "バーコード/QRコードをフレーム内に合わせてください",
    "inventory.out.scan.result": "スキャン済み",
    "inventory.out.product.list": "出庫製品リスト",
    "inventory.out.product.list.desc": "追加された製品リスト",
    "inventory.out.product.empty": "まだ製品が追加されていません",
    "inventory.out.cancel": "キャンセル",
    "inventory.out.complete": "出庫完了",
    "inventory.out.success": "出庫操作が完了しました",
    "inventory.out.available": "利用可能在庫",
    "inventory.out.exceed": "利用可能在庫を超えています！",
    "inventory.out.current.stock": "現在の在庫は",
    "inventory.out.document": "出庫伝票",
    "inventory.out.print": "伝票印刷",
    "inventory.out.export": "伝票エクスポート",

    // テーブル列
    "table.sku": "SKU",
    "table.name": "製品名",
    "table.quantity": "数量",
    "table.location": "保管場所",
    "table.available": "利用可能在庫",
    "table.actions": "操作",
    "table.production.date": "製造日",
    "table.expiry.date": "有効期限",
    "table.status": "状態",

    // ボタン
    "button.save": "保存",
    "button.cancel": "キャンセル",
    "button.add": "追加",
    "button.edit": "編集",
    "button.delete": "削除",
    "button.back": "戻る",
    "button.print": "印刷",
    "button.export": "エクスポート",
    "button.close": "閉じる",

    // 状態
    "status.normal": "正常",
    "status.expiring.soon": "まもなく期限切れ",
    "status.expired": "期限切れ",

    // アラート
    "alert.scan.error": "スキャンエラー",
    "alert.try": "次を試してください：",
    "alert.check.camera": "ブラウザのカメラ権限設定を確認",
    "alert.manual.input": "手動入力で製品を追加",
    "alert.use.supported.browser": "カメラアクセスをサポートするブラウザを使用",
  },
}

// 语言提供者组件
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从本地存储获取语言设置，默认为中文
  const [language, setLanguage] = useState<Language>("zh-CN")

  // 初始化时从本地存储加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["zh-CN", "en-US", "ja-JP"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // 更改语言并保存到本地存储
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  // 翻译函数
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// 使用语言上下文的钩子
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

