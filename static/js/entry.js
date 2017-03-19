import { highlightMagnet } from "./misc/misc"
import homepage from "./homepage"
import checkout from "./checkout_scripts/checkout"
import product from "./product_scripts/product"
import users from "./user_scripts/user"
import logs from "./log_scripts/logs"


(function() {
  // MISC
  highlightMagnet()

  // MAIN
  homepage()
  checkout()
  product()
  logs()
  users()
})()
