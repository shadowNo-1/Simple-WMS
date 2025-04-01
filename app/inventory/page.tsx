"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data - in a real app you would fetch this from an API
const mockProducts = [
  {
    id: "1",
    code: "P001",
    name: "笔记本电脑",
    category: "电子产品",
    quantity: 25,
  },
  {
    id: "2",
    code: "P002",
    name: "办公桌",
    category: "家具",
    quantity: 10,
  },
  {
    id: "3",
    code: "P003",
    name: "打印机",
    category: "办公设备",
    quantity: 5,
  },
  {
    id: "4",
    code: "P004",
    name: "手机",
    category: "电子产品",
    quantity: 50,
  },
  {
    id: "5",
    code: "P005",
    name: "键盘",
    category: "电子产品",
    quantity: 30,
  },
]

export default function InventoryPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState(mockProducts)

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDelete = (id: string) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t("inventoryList")}</CardTitle>
            <Button>
              <Icons.inventory className="mr-2 h-4 w-4" />
              {t("newProduct")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between pb-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("productCode")}</TableHead>
                  <TableHead>{t("productName")}</TableHead>
                  <TableHead>{t("category")}</TableHead>
                  <TableHead className="text-right">{t("quantity")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Icons.settings className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>{t("editProduct")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("generateBarcode")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("stockIn")}</DropdownMenuItem>
                            <DropdownMenuItem>{t("stockOut")}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                              {t("deleteProduct")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

