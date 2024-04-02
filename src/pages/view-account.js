import React from "react";
import { useMatch } from "react-router";

import DashboardWrapper from "../components/dashboard-wrapper";
import UserProfileView from "../components/accounts/user-profile-view";

const ViewAccounts = () => {
  const match = useMatch();
  const { slug } = match.params;

  return (
    <>
      <DashboardWrapper>
        <UserProfileView slug={slug} />
      </DashboardWrapper>
    </>
  );
};

export default ViewAccounts;
