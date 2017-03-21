import $ from "jquery"
import search from "../misc/searchQuery"

export default function tableSearch() {
  const $wrapper = $('.data-wrapper tbody')
  search(tableDataEL, $wrapper)
}

function tableDataEL(data) {
  // Table ROW
  const $row = $(document.createElement('tr'))
  $row.attr('class', 'tbl-data')

  // Product ID
  const $data_id = $(document.createElement('td'))
  const id_val = document.createTextNode(data.invID)
  $data_id.attr('class', 'short invID')
  $data_id.attr('style', 'display:none;')
  $data_id.append(id_val)

  // Product Code
  const $data_code = $(document.createElement('td'))
  const code_val = document.createTextNode(data.prod_code)
  $data_code.attr('class', 'short data-sku')
  $data_code.append(code_val)

  // Product Name
  const $data_name = $(document.createElement('td'))
  const name_val = document.createTextNode(data.prod_name)
  $data_name.attr('class', 'long data-name')
  $data_name.append(name_val)

  // Product Type
  const $data_type = $(document.createElement('td'))
  const type_val = document.createTextNode(data.prod_type)
  $data_type.attr('class', 'short data-type')
  $data_type.append(type_val)

  // Product Stock
  const $stock_wrapper = $(document.createElement('td'))
  $stock_wrapper.attr('class', 'short')

  const $data_stock = $(document.createElement('span'))
  const stock_val = document.createTextNode(data.prod_stock)
  $data_stock.attr('class', 'data-stock')
  $data_stock.append(stock_val)

  const $data_max_stock = $(document.createElement('span'))
  const max_stock_val = document.createTextNode(data.prod_max_stock)
  $data_max_stock.attr('class', 'data-max-stock')
  $data_max_stock.append(max_stock_val)

  const slash = document.createTextNode('/')

  $stock_wrapper.append($data_stock, slash, $data_max_stock)

  // Product Price
  const $data_price = $(document.createElement('td'))
  const price_val = document.createTextNode("₱" + data.prod_price)
  $data_price.attr('class', 'short data-price')
  $data_price.append(price_val)

  // APPEND DATA
  $row.append($data_id, $data_code, $data_name, $data_type, $stock_wrapper, $data_price)

  return $row
}
