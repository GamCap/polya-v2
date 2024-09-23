"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./components/ui/Button";
import { useQueries } from "./hooks/useData";

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleCreateNewQuery = () => {
    router.push("/queries");
  };

  const {data: queries, isLoading} = useQueries();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full grow flex flex-col gap-2">
       { isLoading ? (
          <div className="w-full h-full items-center justify-center text-center flex scrollbar">Loading...</div>
        ) : (

            queries?.map((query) => (
              <Button key={query.id} onClick={() => router.push(`/queries/${query.id}/${query.visualizations?.[0]?.id}`)} variant="subtle" size="small">
                {query.name}
              </Button>
            ))
          
        )
      }
      </div>  
      
      <Button variant="subtle" onClick={handleCreateNewQuery}>
        Create New Query
      </Button>
    </div>
  );
};

export default HomePage;
