import productSelect from "./productSelect"
import clearCart from "./clearCart"
import tenderItems from "./tenderCart"

export default function checkout() {
  productSelect()
  tenderItems()
  clearCart()
}
