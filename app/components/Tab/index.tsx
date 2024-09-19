import { useState } from "react";
import { Icon, IconName } from "../ui/Icon";

interface Tab {
  label: string;
  iconName?: IconName;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-row gap-2 h-screen w-full text-title-14-17-medium">
      <div className="w-1/4 bg-white dark:bg-black rounded-md p-4 h-fit">
        <div className="flex flex-col gap-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`cursor-pointer p-2 flex flex-row gap-2 items-center justify-start rounded-md ${
                index === activeTab
                  ? "bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10 text-green-primary dark:text-green-primary-dark"
                  : "bg-transparent text-black dark:text-white hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.iconName && <Icon name={tab.iconName} />}
              <p>{tab.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="w-3/4 bg-white dark:bg-black rounded-md p-4 max-h-fit">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
