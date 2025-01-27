# Game Federation Relay (with Yukon + Mastodon Implementation)

This project outlines a simple framework for federated gaming and demonstrates its implementation using the Club Penguin clone Yukon ([wizguin/yukon](https://github.com/wizguin/yukon)) and Mastodon. The idea can also be framed as using an MMO chat game as a front-end client for social media platforms like Mastodon.

## Project Overview
This framework could be extended to handle various simple multi-user server setups for games or chats, but the current implementation specifically targets a case like Yukon. In Yukon, players exist in pre-defined rooms with distinct visual assets. Players can interact by moving via point-and-click, sending short messages, and performing actions like dancing or throwing snowballs.

In Yukon:
1. **Client-Side UX Processing:** Most user experience (UX) processing occurs on the client-side ([yukon](https://github.com/wizguin/yukon)).
2. **Server-Side Multi-User Handling:** Multi-user logic happens on the server-side ([yukon-server](https://github.com/wizguin/yukon-server)).

Player interactions are encoded as simple messages that the client renders. These messages naturally align with the character limits of microblogging platforms like Mastodon.

## Current Yukon Workflow
Here’s how Yukon currently works:
1. **Player Action:** On Player X's machine, the player performs an action (e.g., moving, chatting) → The action sends a message to the server.
2. **Server Processing:** The server processes Player X’s message → It relays the message to other users on the server (e.g., Player NotX).
3. **Client Rendering:** Other players’ machines receive the relayed message → Their client renders the action (e.g., Player X moves or chats).

---

## Proposed Federated Workflow
This project explores a federated alternative:
1. **Player to Messaging Service:** On Player `@X@serverY`'s machine, the player performs an action → A message is sent to an external messaging service (e.g., Mastodon), associated with the user/server account.
2. **Message Relay:** Followers or listeners (e.g., `@serverZ` on Mastodon) consume the message → They relay it to all logged-in users on their server.
3. **Client Rendering:** All logged-in users on `serverZ` render the messages as in-game actions.

---

## Benefits and Capabilities
This setup introduces several new possibilities:
- **Decentralized Gameplay:** Players can engage in Yukon without a central server. Each user could theoretically run their own local server without exposing it publicly.
- **Integration with Social Media:** In-game messages become part of social media. For example:
  - The game account might post: `"@user1@domain.name said 'Hello World' in the plaza."`
  - This message links to the user’s actual social media account.
- **Cross-Game Compatibility:** Servers don’t need to run the same game or theme. As long as they share a communication protocol (e.g., for player locations or sprites), different games can interact seamlessly.
- **Enhanced Engagement:** Social media users outside the game can influence in-game experiences. For example:
  - Non-players could spoof in-game messages or affect in-game UX as if they were participants.

---

## Extended Possibilities
Using the game as a front-end for social media could open further opportunities:
- **Threaded Conversations:** Messages occurring near each other in time or location could appear as threaded conversations in social media clients.
- **Live Streams:** Special in-game rooms could display live streams of microblogs, creating dynamic, interactive spaces.

By combining gaming and federated social media, this framework fosters a unique, decentralized, and interactive online experience.

## Code details
Abstracted into FederationService, GameServerEventEmitter, GameServerEventListener. FederationService both listens for Federated messages from other federated game servers (e.g. listening for toots from following server accounts for an associated Mastodon account), and sends federated messages (e.g. by posting a toot for an associated Mastodon account).  Not included in this repository is any connecting game; we assume GameServer exists elsewhere. GameServerEventListener listens for messages from GameServer and provides a callback for FederationService to hook into. GameServerEventEmitter can emit GameServer events to GameServer, and provides a callback for FederationService to hook into. 

### Requirements
Mastodon account
Mastodon account secret key
(Highly recommended) Server admin approval to do this - might get spammy
Running local instances of yukon and yukon-server forks

More documentation coming soon...
