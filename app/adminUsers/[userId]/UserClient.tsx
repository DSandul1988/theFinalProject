"use client";

import Container from "@/app/Components/Container";

import UserHead from "@/app/Components/adminUsers/UserHead";
import UserInfo from "@/app/Components/adminUsers/UserInfo";
import { SafeUser } from "@/app/types";

interface UserClientProps {
  user: SafeUser;
}

const UserClient: React.FC<UserClientProps> = ({ user }) => {
  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <UserHead user={user} />
          <div
            className="grid grid-cols-1
          md:grid-cols-7
          md:gap-10
          mt-6"
          >
            <UserInfo user={user} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserClient;
