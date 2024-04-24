import Container from "../Container";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import LoginMenue from "./LoginMenue";
import { User } from "@prisma/client";
import { SafeUser } from "@/app/types";
import Categories from "./Categories";
interface NavigationProps {
  currentUser?: SafeUser | null;
}
export const NavigationBar: React.FC<NavigationProps> = ({ currentUser }) => {
  console.log({ currentUser });
  return (
    <div className="fixed w-full bg-white custom-gradient z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div
            className="flex
            flex-row
            items-center
            justify-between
            gap-3
            md:gap-0"
          >
            <Logo />

            <SearchBar />
            <LoginMenue currentUser={currentUser} />
          </div>
        </Container>
      </div>{" "}
      {!currentUser?.isManager && <Categories />}
    </div>
  );
};

export default NavigationBar;
