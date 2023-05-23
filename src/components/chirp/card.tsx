export const ChirpCard: React.FC = () => {
  return (
    <div className="flex gap-4">
      <div>
        <div className="h-12 w-12 rounded-full bg-gray-400" />
      </div>
      <div>
        <div className="flex gap-1">
          <p>DisplayName</p>
          <p className="text-muted-foreground">@username</p>
        </div>

        <p>
          Content asdasdjaslkdjasl alksdjlaksdjasldkaslkdkja sdjkasl djlkasdlas
        </p>
      </div>
    </div>
  );
};
