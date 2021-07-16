import { atom, selector } from "recoil";

export const userProfileData = atom({
  key: "userProfileData",
  default: undefined,
});

export const userWalletCredit = selector({
  key: "userWalletCredit",
  get: ({ get }) => {
    const profileData = get(userProfileData);
    if (profileData) {
      return profileData?.credit;
    }
    return undefined;
  },
});

export const initialNameOfUser = selector({
  key: "initialNameOfUser",
  get: ({ get }) => {
    const profileData = get(userProfileData);
    if (profileData) {
      const fullName = profileData?.full_name?.split(" ");
      return fullName.shift().charAt(0) + fullName.pop().charAt(0);
    }
    return undefined;
  },
});
