import $ from "jquery"
import { numInputValidation } from "../misc/misc"


export default function restockNumInputEvent() {
  const $restock_inputs = $('.restock-modal .stock-input')

  numInputValidation($restock_inputs, maxInput)
}

function maxInput(self, event) {
  const val = Number(self.val())

  // Item-stock input logic handler
  if(self.hasClass('sel-item-stock')) {
    checkStockInput(self)
    return
  }

  // All-Stock input logic handler
  if(self.hasClass('all-stock')) {
    const val = self.val()
    const $item_stock = $('.sel-item-stock')
    const max = 999

    if(val > max) {
      self.val(max)
    }

    // Fill Item Stock Inputs
    $item_stock.each((_, stock_input) => {
      const $input = $(stock_input)
      $input.val(self.val())
      checkStockInput($input)
    })
    return
  }
}


function checkStockInput($input) {
  const val = Number($input.val())
  const $parent = $input.parent()
  const $max_stock = Number($parent.find('.sel-item-max').text())
  const $curr_stock = Number($parent.find('.sel-item-instock').text())
  const newStockVal = val + $curr_stock

  if(newStockVal > $max_stock) {
    $input.val($max_stock - $curr_stock)
  }
}
