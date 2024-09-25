"use client";
import React from "react";
import { Button } from "./components/ui/Button";
import { useQueriesList } from "./hooks/supabase/useQueriesList";
import Link from "next/link";

const HomePage: React.FC = () => {

  const {data: queries, isLoading} = useQueriesList();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full grow flex flex-col gap-2">
       { isLoading ? (
          <div className="w-full h-full items-center justify-center text-center flex scrollbar">Loading...</div>
        ) : (

            queries?.map((query) => (
              <Button key={query.id}  variant="subtle" size="small">
                <Link href={`/queries/${query.id}/${query.firstVisualizationId}`}>
                {query.name}
                </Link>
              </Button>
            ))
          
        )
      }
      </div>  
      
      <Button variant="subtle">
        <Link href="/queries">Create New Query</Link>
      </Button>
    </div>
  );
};

export default HomePage;
