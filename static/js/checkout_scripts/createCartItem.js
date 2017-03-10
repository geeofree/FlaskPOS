import $ from 'jquery'

export default function createItem(itemID, itemName, itemPrice, qty, total) {
  const $items = $('.items')

  if(uniqueItem(itemID)) {
    const item = newItem(itemID, itemName, itemPrice, qty, total)
    $items.append(item)
  }
  else {
    updateItem(itemID, qty)
  }

  updateProductStock(itemID, qty)
  calcTotalPurchases($items)
}


function uniqueItem(purchasingID) {
  const $purchased = $('.purchased-item')

  for(let i = 0, len = $purchased.length; i < len; i++) {
    const $purchasedID = $($purchased[i]).find('.id').text()

    if($purchasedID == purchasingID) {
      return false
    }
  }

  return true
}


function updateItem(id, newQty) {
  const item = $('#' + id)
  const itemPrice = item.find('.item-price').text()
  const itemTotal = item.find('.item-total')
  const itemQty   = item.find('.item-qty')


  const price    = Number(itemPrice.match(/\d+/)[0])
  const oldQty   = Number(itemQty.text())
  itemQty.text(oldQty + newQty)

  const qty = Number(itemQty.text())

  itemTotal.text("₱" + qty * price)
}


function updateProductStock(id, qty) {
  const $product      = $("#no" + id)
  let   $productStock = $product.find(".stock")

  const stock   = Number($productStock.text())
  const diff    = stock - qty

  if(diff == 0) {
    $product.removeClass('in-stock')
  }

  $productStock.text(diff)
}


function calcTotalPurchases($items) {
  const purchases = $items.find('.purchased-item')
  const subQtyEL  = $('#sub-qty')
  const subTtlEL  = $('#sub-total')
  let   subQTY    = 0
  let   subTOTAL  = 0


  purchases.each((_, data) => {
    const $data  = $(data)
    const $qty   = Number($data.find('.item-qty').text())
    var   $total = $data.find('.item-total').text()
    $total = Number($total.match(/\d+/)[0])

    subQTY += $qty
    subTOTAL += $total
  })

  subQtyEL.text(subQTY)
  subTtlEL.text("₱" + subTOTAL)
}




function newItem(itemID, itemName, itemPrice, qty, total) {
  const itemData = [[itemID, "id"], [itemName, "long prod_name"],
                    [itemPrice,"short item-price"], [qty,"short item-qty"], [total,"short item-total"]]

  const item = document.createElement('div')
  item.setAttribute("class", "purchased-item")
  item.setAttribute("id", itemID)

  itemData
  .map(data => {
    const value = data[0]
    const span_class = data[1]

    const span = document.createElement('span')
    const span_val = document.createTextNode(value)

    span.setAttribute("class", span_class)
    $(span).append(span_val)

    return span
  })
  .forEach(span => {
    $(item).append(span)
  })

  return item
}
