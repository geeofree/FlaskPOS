import $ from "jquery"
import search from "../misc/searchQuery"

export default function productSearch() {
  const $wrapper = $('.products')
  const $search = $('.search-input')
  const $scope  = $('.search-scope')

  $scope.off("change")
  $search.off("keyup")

  search(productDataEL, $wrapper)
}

function productDataEL(data) {
  const stock_status = data.prod_stock ? "in-stock" : ""

  // Item wrapper
  const $product = $(document.createElement('div'))
  $product.attr({ id: `no${data.invID}`, class: `product ${stock_status}` })

  // Item ID
  const itemID = $(document.createElement('span'))
  const id_val = document.createTextNode(data.invID)
  itemID.attr('class', 'item id')
  itemID.append(id_val)

  // Item Wrapper Attribute
  const default_attr = {class:'item-description'}
  const name_attr = {id:'item-name', class:'item-description'}

  // ITEM DATA
  const item_code = itemDescCreator(data.prod_code, "SKU", default_attr, 'code')
  const item_name = itemDescCreator(data.prod_name, "Product Name", name_attr, 'name')
  const item_type = itemDescCreator(data.prod_type, "Category", default_attr, 'category')
  const item_stock = itemDescCreator(data.prod_stock, "Stock", default_attr, 'stock')
  const item_price = itemDescCreator(`₱${data.prod_price}`, "Price", default_attr, 'price')

  $product.append(itemID, item_code, item_name, item_type, item_stock, item_price)
  return $product
}

function itemDescCreator(data_val, data_desc, wrapper_attr, data_attr) {
  // Item Wrapper
  const $prod_wrapper = $(document.createElement('div'))
  $prod_wrapper.attr(wrapper_attr)

  // Item Data
  const $item_data = $(document.createElement('span'))
  const item_val  = document.createTextNode(data_val)
  $item_data.attr('class', data_attr)
  $item_data.append(item_val)

  // Item Description
  const $item_desc = $(document.createElement('p'))
  const desc_val = document.createTextNode(data_desc)
  $item_desc.append(desc_val)

  // Append to Wrapper
  $prod_wrapper.append($item_data, $item_desc)

  return $prod_wrapper
}
