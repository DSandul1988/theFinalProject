import useActiveList from "@/app/hooks/useActiveList";
import { act, renderHook } from "@testing-library/react-hooks";
// Adjust the import path as needed

describe("useActiveList hook", () => {
  it("should add a member to the list", () => {
    const { result } = renderHook(() => useActiveList());

    act(() => {
      result.current.add("member1");
    });

    expect(result.current.members).toContain("member1");
  });

  it("should remove a member from the list", () => {
    const { result } = renderHook(() => useActiveList());

    // First, add a member to ensure there's something to remove
    act(() => {
      result.current.add("member1");
    });

    // Then, remove the member
    act(() => {
      result.current.remove("member1");
    });

    expect(result.current.members).not.toContain("member1");
  });

  it("should set members list", () => {
    const { result } = renderHook(() => useActiveList());
    const newMembers = ["member1", "member2"];

    act(() => {
      result.current.set(newMembers);
    });

    expect(result.current.members).toEqual(newMembers);
  });
});
