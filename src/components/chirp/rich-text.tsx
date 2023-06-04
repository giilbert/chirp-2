import Link from "next/link";

export const ChirpRichText: React.FC<{ body: string }> = ({ body }) => {
  return (
    <p className="break-all">
      {body.split(" ").map((v, i) =>
        v.startsWith("http") ? (
          <Link
            href={v}
            key={i}
            className="text-purple-500 hover:underline"
            target="_blank"
          >
            {v + " "}
          </Link>
        ) : v.startsWith("@") ? (
          <Link
            href={`/${v.slice(1)}`}
            key={i}
            className="text-purple-500 hover:underline"
          >
            {v + " "}
          </Link>
        ) : v.startsWith("#") ? (
          <Link
            href={`/search?q=${v.slice(1)}`}
            key={i}
            className="text-purple-500 hover:underline"
          >
            {v + " "}
          </Link>
        ) : (
          v + " "
        )
      )}
    </p>
  );
};
