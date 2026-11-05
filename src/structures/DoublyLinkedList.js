// Doubly Linked List: head <-> Song 1 <-> Song 2 <-> ... <-> tail
class Node {
  constructor(song) {
    this.song = song; // song data
    this.prev = null; // previous node
    this.next = null; // next node
  }
}

export default class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // O(1)
  insertAtEnd(song) {
    const node = new Node(song);
    if (this.tail === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
    return true;
  }

  // O(1)
  insertAtBeginning(song) {
    const node = new Node(song);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this.size++;
    return true;
  }

  // O(n) - returns the node or null
  findById(id) {
    let current = this.head;
    while (current !== null) {
      if (current.song.id === id) return current;
      current = current.next;
    }
    return null;
  }

  // O(n) search + O(1) unlink. Returns the removed song or null.
  removeById(id) {
    const node = this.findById(id);
    if (node === null) return null;

    if (node.prev !== null) node.prev.next = node.next;
    else this.head = node.next; // removing the first node

    if (node.next !== null) node.next.prev = node.prev;
    else this.tail = node.prev; // removing the last node

    node.prev = null;
    node.next = null;
    this.size--;
    return node.song;
  }

  // direction: "up" (toward head) or "down" (toward tail). Returns true on success.
  move(id, direction) {
    const node = this.findById(id);
    if (node === null) return false;
    if (direction === "up") return this._swapWithPrevious(node);
    if (direction === "down") return node.next !== null && this._swapWithPrevious(node.next);
    return false;
  }

  // Swaps `node` with the node before it by rewiring pointers (O(1)).
  // Before: before <-> prevNode <-> node <-> after
  // After:  before <-> node <-> prevNode <-> after
  _swapWithPrevious(node) {
    const prevNode = node.prev;
    if (prevNode === null) return false;
    const before = prevNode.prev;
    const after = node.next;

    node.prev = before;
    node.next = prevNode;
    prevNode.prev = node;
    prevNode.next = after;

    if (before !== null) before.next = node;
    else this.head = node;
    if (after !== null) after.prev = prevNode;
    else this.tail = prevNode;
    return true;
  }

  // Returns song or null (no wrapping here; the hook wraps).
  getNext(id) {
    const node = this.findById(id);
    return node && node.next ? node.next.song : null;
  }

  getPrevious(id) {
    const node = this.findById(id);
    return node && node.prev ? node.prev.song : null;
  }

  getFirst() {
    return this.head ? this.head.song : null;
  }

  getLast() {
    return this.tail ? this.tail.song : null;
  }

  // O(n) snapshot for React rendering only
  toArray() {
    const result = [];
    let current = this.head;
    while (current !== null) {
      result[result.length] = current.song;
      current = current.next;
    }
    return result;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}
