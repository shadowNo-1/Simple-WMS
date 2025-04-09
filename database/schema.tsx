// 这是一个示例数据库架构，使用Prisma ORM

import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

// 数据库模型定义在prisma/schema.prisma文件中
/*
// 产品表
model Product {
  id            Int             @id @default(autoincrement())
  sku           String          @unique
  name          String
  description   String?
  category      String
  price         Decimal?        @db.Decimal(10, 2)
  cost          Decimal?        @db.Decimal(10, 2)
  minQuantity   Int             @default(0)
  barcode       String?
  weight        String?
  dimensions    String?
  supplier      String?
  imageUrl      String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  
  // 关联
  inventoryItems InventoryItem[]
  transactions   TransactionItem[]
}

// 仓库表
model Warehouse {
  id            Int             @id @default(autoincrement())
  name          String
  location      String
  description   String?
  manager       String?
  contact       String?
  status        String          @default("active")
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  
  // 关联
  inventoryItems InventoryItem[]
}

// 库存项目表（产品在特定仓库的库存）
model InventoryItem {
  id            Int             @id @default(autoincrement())
  productId     Int
  warehouseId   Int
  location      String          // 库位
  quantity      Int             @default(0)
  status        String          @default("normal")
  
  // 关联
  product       Product         @relation(fields: [productId], references: [id])
  warehouse     Warehouse       @relation(fields: [warehouseId], references: [id])
  
  // 复合唯一索引确保每个产品在每个仓库的每个库位只有一条记录
  @@unique([productId, warehouseId, location])
}

// 交易表（入库/出库记录）
model Transaction {
  id            Int             @id @default(autoincrement())
  type          String          // "in" 或 "out"
  reference     String?         // 参考号
  source        String?         // 来源/去向
  notes         String?
  documentId    String          @unique // 单据编号
  createdBy     Int?            // 操作人ID
  createdAt     DateTime        @default(now())
  
  // 关联
  items         TransactionItem[]
  user          User?           @relation(fields: [createdBy], references: [id])
}

// 交易项目表（每笔交易中的产品）
model TransactionItem {
  id            Int             @id @default(autoincrement())
  transactionId Int
  productId     Int
  quantity      Int
  location      String          // 库位
  productionDate DateTime?
  expiryDate    DateTime?
  
  // 关联
  transaction   Transaction     @relation(fields: [transactionId], references: [id])
  product       Product         @relation(fields: [productId], references: [id])
}

// 用户表
model User {
  id            Int             @id @default(autoincrement())
  username      String          @unique
  password      String          // 存储哈希后的密码
  name          String?
  email         String?         @unique
  role          String          @default("user") // admin, manager, user等
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  
  // 关联
  transactions  Transaction[]
}

// 库存盘点表
model InventoryCheck {
  id            Int             @id @default(autoincrement())
  name          String
  type          String          // full, partial, cycle
  status        String          @default("pending") // pending, in-progress, completed
  createdBy     Int?
  createdAt     DateTime        @default(now())
  completedAt   DateTime?
  
  // 关联
  items         CheckItem[]
  user          User?           @relation(fields: [createdBy], references: [id])
}

// 盘点项目表
model CheckItem {
  id                Int             @id @default(autoincrement())
  checkId           Int
  productId         Int
  location          String
  expectedQuantity  Int
  actualQuantity    Int
  discrepancy       Int
  notes             String?
  
  // 关联
  check             InventoryCheck  @relation(fields: [checkId], references: [id])
  product           Product         @relation(fields: [productId], references: [id])
}
*/

