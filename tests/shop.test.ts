import assert from "node:assert/strict";
import test from "node:test";
import { cartTotal, restoreCart, updateCart } from "../src/data/cart.ts";
import { price, products, searchProducts } from "../src/data/products.ts";

test("prices use South Asian grouping and Bengali numerals", () => {
  assert.equal(price(125000), "৳1,25,000");
  assert.equal(price(125000, "bn"), "৳১,২৫,০০০");
});
test("search matches trimmed case-insensitive names, Bengali and category", () => {
  assert.equal(searchProducts("  HEADPHONES ").length, 1);
  assert.equal(searchProducts("সিরাম")[0].id, "serum");
  assert.ok(
    searchProducts("", "Fashion").every((p) => p.category === "Fashion"),
  );
  assert.equal(searchProducts("not a real product").length, 0);
});
test("cart adds, increments, prices and removes quantities", () => {
  const first = updateCart([], "headphones", "", 1);
  const second = updateCart(first, "headphones", "", 1);
  assert.equal(first[0].quantity, 1);
  assert.equal(second[0].quantity, 2);
  assert.equal(cartTotal(second), products[0].price * 2);
  assert.deepEqual(updateCart(second, "headphones", "", -2), []);
});
test("variants are required and stock is shared across variants", () => {
  assert.deepEqual(updateCart([], "knitwear", "", 1), []);
  assert.deepEqual(updateCart([], "knitwear", "XXL", 1), []);
  const small = updateCart([], "knitwear", "S", 5);
  const medium = updateCart(small, "knitwear", "M", 5);
  assert.equal(
    medium.reduce((n, line) => n + line.quantity, 0),
    8,
  );
  assert.equal(medium[1].quantity, 3);
});
test("restored carts reject corrupted state and unknown products", () => {
  assert.deepEqual(restoreCart({ bad: true }), []);
  assert.deepEqual(
    restoreCart([
      null,
      {},
      { id: "unknown", variant: "", quantity: 1 },
      { id: "headphones", variant: "", quantity: -1 },
    ]),
    [],
  );
  const restored = restoreCart([
    { id: "headphones", variant: "", quantity: 999 },
  ]);
  assert.equal(restored[0].quantity, products[0].stock);
});
