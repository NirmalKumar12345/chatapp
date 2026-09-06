
import ConversationList from "./conversationList";
import LogoutButton from "./logoutButton";
import SearchBar from "./searchbar";
import SidebarHeader from "./sidebarHeader";


export default function Sidebar() {
  return (
    <aside className="flex h-full flex-col">
      <SidebarHeader />

      <div className="p-4">
        <SearchBar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConversationList />
      </div>

      <div className="border-t px-4 py-3">
        <LogoutButton />
      </div>
    </aside>
  );
}