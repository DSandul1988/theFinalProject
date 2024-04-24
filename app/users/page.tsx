import EmptyState from "../Components/EmptyState";

const UserPage = () => {
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState title="Select a chat" subtitle="Or start a conversation" />
    </div>
  );
};

export default UserPage;
