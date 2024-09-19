import type { Meta, StoryObj } from "@storybook/react";
import Tabs from "@/components/Tab";
import ProfileForm from "@/components/Profile";
import AccountForm from "@/components/Account";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  decorators: [
    (Story) => (
      <div className=" rounded-md p-4 flex items-center justify-center w-full h-fit">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const WithLeftIcon: Story = {
  args: {
    tabs: [
      {
        label: "Account",
        iconName: "Search",
        content: (
          <AccountForm
            initialValues={{
              email: "gamcap@gamcap.labs",
              password: "",
            }}
            onSave={function (data: any): void {
              console.log(data);
            }}
            onDelete={function (): void {
              console.log("Delete account");
            }}
          />
        ),
      },
      {
        label: "Profile",
        iconName: "Search",
        content: (
          <ProfileForm
            initialValues={{
              userImage: "",
              username: "",
              twitter: "",
              telegram: "",
              discord: "",
              bio: "",
            }}
            onSave={function (data: any): void {
              console.log(data);
            }}
          />
        ),
      },
      {
        label: "Tab 3",
        iconName: "Search",
        content: "Tab 3 content",
      },
    ],
  },
};
