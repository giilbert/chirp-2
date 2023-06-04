import { useRouter } from "next/router";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <form
      className="flex w-full gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (query === "") return;
        router.push(`/search?q=${encodeURIComponent(query)}`).catch(() => 0);
      }}
    >
      <Input
        className="w-full"
        defaultValue={router.query.q as string}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <Button variant="secondary">Search</Button>
    </form>
  );
};
