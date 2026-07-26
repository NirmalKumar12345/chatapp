import ChatHeader from "./chatHeader";
import MessageInput from "./messageInput";
import MessageList from "./messageList";
import Sidebar from "./sidebar";

export default function ChatLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 border-r">
        <Sidebar />
      </aside>

      {/* Chat Area */}
      <main className="flex flex-1 flex-col">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto">
          <MessageList />
        </div>

        <MessageInput />
      </main>
    </div>
  );
}