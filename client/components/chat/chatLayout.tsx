import Sidebar from "../sidebar/sidebar";
import ChatSection from "./chatSection";

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