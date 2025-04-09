"use client"

import type React from "react"
import { useRef } from "react"
import { jsPDF } from "jspdf"
// 使用 require 导入 jspdf-autotable 以确保它正确扩展 jsPDF 原型
import "jspdf-autotable"
import { format } from "date-fns"
import { useLanguage } from "./language-context"

// 扩展jsPDF类型以包含autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface Item {
  sku: string
  name: string
  quantity: number
  location: string
  productionDate?: string
  expiryDate?: string
  status?: string
  available?: number
}

interface DocumentData {
  documentId: string
  reference: string
  source: string
  notes: string
  items: Item[]
  type: "in" | "out"
}

// 尝试生成PDF，如果失败则返回null
export const generatePDF = (data: DocumentData): string | null => {
  try {
    // 创建新的PDF文档
    const doc = new jsPDF()

    // 添加标题
    const title = data.type === "in" ? "入库单" : "出库单"
    doc.setFontSize(20)
    doc.text(title, 105, 15, { align: "center" })

    // 添加单据编号
    doc.setFontSize(12)
    doc.text(`单据编号: ${data.documentId}`, 14, 25)

    // 添加基本信息
    doc.setFontSize(10)
    doc.text(`${data.type === "in" ? "来源" : "去向"}: ${data.source}`, 14, 35)
    doc.text(`参考号: ${data.reference || "-"}`, 14, 40)
    doc.text(`备注: ${data.notes || "-"}`, 14, 45)
    doc.text(`日期: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`, 14, 50)

    // 添加表格
    const tableColumn =
      data.type === "in"
        ? ["SKU", "产品名称", "数量", "库位", "生产日期", "有效期"]
        : ["SKU", "产品名称", "数量", "库位"]

    const tableRows = data.items.map((item) => {
      if (data.type === "in") {
        return [
          item.sku,
          item.name,
          item.quantity.toString(),
          item.location,
          item.productionDate || "-",
          item.expiryDate || "-",
        ]
      } else {
        return [item.sku, item.name, item.quantity.toString(), item.location]
      }
    })

    // 使用 autoTable 前检查它是否可用
    if (typeof doc.autoTable === "function") {
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 66, 66] },
      })
    } else {
      throw new Error("autoTable 函数不可用")
    }

    // 添加页脚
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`第 ${i} 页，共 ${pageCount} 页`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
        align: "center",
      })
      doc.text(
        `SimpleWMS - 生成时间: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 5,
        { align: "center" },
      )
    }

    // 返回PDF的数据URL
    return doc.output("dataurlstring")
  } catch (error) {
    console.error("PDF生成错误:", error)
    return null
  }
}

interface PDFViewerProps {
  data: DocumentData
  onClose: () => void
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ data, onClose }) => {
  const { t } = useLanguage()
  const pdfUrl = generatePDF(data)

  // 如果PDF生成失败，使用HTML渲染
  if (!pdfUrl) {
    return <HTMLDocumentViewer data={data} onClose={onClose} />
  }

  const handlePrint = () => {
    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    iframe.src = pdfUrl
    document.body.appendChild(iframe)
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `${data.documentId}.pdf`
    link.click()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          title={data.type === "in" ? t("inventory.in.document") : t("inventory.out.document")}
        />
      </div>
      <div className="flex justify-between p-4 border-t">
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>
          {t("button.close")}
        </button>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleDownload}>
            {data.type === "in" ? t("inventory.in.export") : t("inventory.out.export")}
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handlePrint}>
            {data.type === "in" ? t("inventory.in.print") : t("inventory.out.print")}
          </button>
        </div>
      </div>
    </div>
  )
}

// 备用HTML文档查看器组件
const HTMLDocumentViewer: React.FC<PDFViewerProps> = ({ data, onClose }) => {
  const { t } = useLanguage()
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>${data.type === "in" ? "入库单" : "出库单"} - ${data.documentId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { margin-bottom: 20px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const handleExport = () => {
    const content = printRef.current
    if (!content) return

    const htmlContent = `
      <html>
        <head>
          <title>${data.type === "in" ? "入库单" : "出库单"} - ${data.documentId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { margin-bottom: 20px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${data.documentId}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <div ref={printRef} className="bg-white p-4">
          <div className="header">
            <h1 className="text-2xl font-bold text-center mb-2">{data.type === "in" ? "入库单" : "出库单"}</h1>
            <p className="text-center text-gray-500 mb-4">{data.documentId}</p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p>
                  <strong>{data.type === "in" ? "来源" : "去向"}:</strong> {data.source}
                </p>
                <p>
                  <strong>参考号:</strong> {data.reference || "-"}
                </p>
              </div>
              <div>
                <p>
                  <strong>备注:</strong> {data.notes || "-"}
                </p>
                <p>
                  <strong>日期:</strong> {format(new Date(), "yyyy-MM-dd HH:mm:ss")}
                </p>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">SKU</th>
                <th className="border p-2">产品名称</th>
                <th className="border p-2">数量</th>
                <th className="border p-2">库位</th>
                {data.type === "in" && (
                  <>
                    <th className="border p-2">生产日期</th>
                    <th className="border p-2">有效期</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.sku}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">{item.location}</td>
                  {data.type === "in" && (
                    <>
                      <td className="border p-2">{item.productionDate || "-"}</td>
                      <td className="border p-2">{item.expiryDate || "-"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="footer">
            <p>SimpleWMS - 生成时间: {format(new Date(), "yyyy-MM-dd HH:mm:ss")}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 border-t">
        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={onClose}>
          {t("button.close")}
        </button>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleExport}>
            {data.type === "in" ? t("inventory.in.export") : t("inventory.out.export")}
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handlePrint}>
            {data.type === "in" ? t("inventory.in.print") : t("inventory.out.print")}
          </button>
        </div>
      </div>
    </div>
  )
}

