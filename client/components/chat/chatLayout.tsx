import ChatSection from "./chatSection";
import Sidebar from "./sidebar";

export default function ChatLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 border-r">
        <Sidebar />
      </aside>

      {/* Chat Area */}
      <div className="flex-1">
        <ChatSection />
      </div>
    </div>
  );
}