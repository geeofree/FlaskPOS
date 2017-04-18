import $ from "jquery"
import search from "../misc/searchQuery"

export default function productSearch() {
  const $parent = $('.products')
  search($parent, '.code', '.name', '.category')
}
