/** Monotonic IDs — Date.now() alone can collide for user + bot messages in one turn. */
let nextId = 2;

export function createChatMessageId(): number {
  return nextId++;
}
