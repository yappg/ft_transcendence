"use client";
import { User } from "@/context/GlobalContext";
import { Avatar } from "./Avatar";
import { ProfileInfo } from "./ProfileInfo";
import { InfoTitle } from "./InfoTitle";
import { Separator } from "../ui/separator";
import { AddButton } from "./AddButton";
import { PendingButton } from "./PendingButton";
import { BlockButton } from "./BlockButton";
import { EditProfile } from "./EditProfile";
import { InviteSentButton } from "./InviteSentButton";
import { UnBlockButton } from "./UnBlockButton";
import { useEffect, useState } from "react";
const UserInfo = ({
  userProfile,
  state,
}: {
  userProfile: User;
  state: string;
}) => {
  const [thisState, setThisState] = useState(state);

  useEffect(() => {
    setThisState(state);
  }, [state]);
  const renderContent = () => {
    switch (thisState) {
      case "none":
        return (
          <AddButton
            name={userProfile?.display_name}
            setThisState={setThisState}
          />
        );
      case "received_invite":
        return (
          <PendingButton
            name={userProfile?.display_name}
            setThisState={setThisState}
          />
        );
      case "friend":
        return (
          <BlockButton
            name={userProfile?.display_name}
            setThisState={setThisState}
          />
        );
      case "sent_invite":
        return (
          <InviteSentButton
            name={userProfile?.display_name}
            setThisState={setThisState}
          />
        );
      case "self":
        return <EditProfile />;
      case "blocked":
        return (
          <UnBlockButton
            name={userProfile?.display_name}
            setThisState={setThisState}
          />
        );
      case "blocked_by_user":
        return <div>blocked by user</div>;
    }
  };
  return (
    <div className="absolute z-50 flex size-full flex-col items-center justify-between px-6 py-4 lg:flex-row 2xl:px-10">
      <div className="flex h-fit w-full flex-col items-center justify-start gap-12 lg:h-full lg:w-fit lg:flex-row lg:items-end lg:justify-start">
        <div className="flex h-full w-1/2 items-end justify-center">
          <Avatar url={`http://localhost:8080${userProfile?.avatar}`} />
        </div>
        <ProfileInfo
          display_name={userProfile?.display_name}
          username={userProfile?.username}
          level={userProfile?.level}
        />
      </div>
      <div className="flex size-full flex-col items-end justify-end gap-0 lg:h-full lg:w-fit lg:gap-10 lg:pr-6">
        <div className="flex h-[60px] w-full flex-row items-center justify-center gap-0 lg:h-full lg:flex-col lg:items-end lg:justify-end">
          <InfoTitle title={"Wins: "} value={userProfile?.games_won} />
          <Separator className="block lg:hidden" orientation="vertical" />
          <InfoTitle title={"Losses: "} value={userProfile?.games_loss} />
          <Separator className="block lg:hidden" orientation="vertical" />
          <InfoTitle title={"Winrate: "} value={userProfile?.win_ratio} />
        </div>
        <div className="flex size-full h-[100px] w-full items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
