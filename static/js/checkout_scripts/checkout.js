import productSelect from "./productSelect"
import clearCart from "./clearCart"
import tenderItems from "./tenderCart"
import productSearch from "./productSearch"


export default function checkout() {
  productSearch()
  productSelect()
  tenderItems()
  clearCart()
}
