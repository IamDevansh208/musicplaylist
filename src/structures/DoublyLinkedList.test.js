// Run with: npm test   (plain Node, no framework)
import assert from "node:assert/strict";
import DoublyLinkedList from "./DoublyLinkedList.js";

const s = (id) => ({ id, title: id });
const ids = (l) => l.toArray().map((x) => x.id).join(",");

// Verifies head/tail/size and that prev/next pointers agree in both directions.
function check(l) {
  const forward = [];
  let n = l.head, last = null;
  while (n) { assert.equal(n.prev, last); forward.push(n.song.id); last = n; n = n.next; }
  assert.equal(l.tail, last);
  assert.equal(l.size, forward.length);
  const backward = [];
  n = l.tail;
  while (n) { backward.push(n.song.id); n = n.prev; }
  assert.deepEqual(backward.reverse(), forward);
  if (l.size === 0) { assert.equal(l.head, null); assert.equal(l.tail, null); }
}
const make = (...x) => { const l = new DoublyLinkedList(); x.forEach((i) => l.insertAtEnd(s(i))); return l; };
let count = 0;
const test = (name, fn) => { fn(); count++; console.log("  ok -", name); };

test("empty list", () => { const l = new DoublyLinkedList(); check(l); assert.deepEqual(l.toArray(), []); });
test("insert first song", () => { const l = make("a"); check(l); assert.equal(l.head, l.tail); });
test("insert multiple (end + beginning)", () => { const l = make("a", "b"); l.insertAtBeginning(s("z")); check(l); assert.equal(ids(l), "z,a,b"); });
test("delete first", () => { const l = make("a", "b", "c"); l.removeById("a"); check(l); assert.equal(ids(l), "b,c"); });
test("delete last", () => { const l = make("a", "b", "c"); l.removeById("c"); check(l); assert.equal(ids(l), "a,b"); });
test("delete middle", () => { const l = make("a", "b", "c"); l.removeById("b"); check(l); assert.equal(ids(l), "a,c"); });
test("delete only song", () => { const l = make("a"); l.removeById("a"); check(l); assert.equal(l.size, 0); });
test("move first down", () => { const l = make("a", "b", "c"); assert.ok(l.move("a", "down")); check(l); assert.equal(ids(l), "b,a,c"); });
test("move last up", () => { const l = make("a", "b", "c"); assert.ok(l.move("c", "up")); check(l); assert.equal(ids(l), "a,c,b"); });
test("move middle both ways", () => {
  const l = make("a", "b", "c", "d");
  l.move("b", "up"); check(l); assert.equal(ids(l), "b,a,c,d");
  l.move("c", "down"); check(l); assert.equal(ids(l), "b,a,d,c");
  l.move("a", "down"); check(l); assert.equal(ids(l), "b,d,a,c");
});
test("move at the edges fails safely", () => {
  const l = make("a", "b"); assert.equal(l.move("a", "up"), false); assert.equal(l.move("b", "down"), false); check(l);
});
test("navigate forward/backward", () => {
  const l = make("a", "b", "c");
  assert.equal(l.getNext("a").id, "b"); assert.equal(l.getPrevious("c").id, "b");
});
test("ends have no next/prev (hook wraps)", () => {
  const l = make("a", "b", "c");
  assert.equal(l.getNext("c"), null); assert.equal(l.getPrevious("a"), null);
  assert.equal(l.getFirst().id, "a"); assert.equal(l.getLast().id, "c");
});
test("invalid id", () => {
  const l = make("a");
  assert.equal(l.findById("x"), null); assert.equal(l.removeById("x"), null);
  assert.equal(l.move("x", "up"), false); assert.equal(l.getNext("x"), null); check(l);
});
test("empty playlist operations are safe", () => {
  const l = new DoublyLinkedList();
  assert.equal(l.removeById("a"), null); assert.equal(l.move("a", "down"), false);
  assert.equal(l.getFirst(), null); assert.equal(l.getLast(), null);
});
test("clear", () => { const l = make("a", "b"); l.clear(); check(l); });
console.log(`\nAll ${count} tests passed.`);
