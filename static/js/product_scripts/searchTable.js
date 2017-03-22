import $ from "jquery"
import search from "../misc/searchQuery"

export default function tableSearch() {
  const $parent = $('.data-wrapper tbody')
  search($parent, '.data-sku', '.data-name', '.data-type')
}
