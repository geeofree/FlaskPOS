import $ from 'jquery'

export default function createItem(item_name, price, qty, total) {
  const items = $('.items')
  const item_data = [[item_name, "long prod_name"], [price,"short"], [qty,"short"], [total,"short"]]

  const item = document.createElement('div')
  item.setAttribute("class", "purchased-item")

  item_data
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

  items.append(item)
}
