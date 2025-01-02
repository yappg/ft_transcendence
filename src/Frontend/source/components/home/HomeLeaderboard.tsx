import { useUser } from "@/context/GlobalContext"

export const HomeLeaderboard = () => {
    const {PlayerLeaderBoard} = useUser();
  return (
    <div>
        {PlayerLeaderBoard?.map((leaderboard) => (
            <div key={leaderboard.id}>
                <h1>{leaderboard.display_name}</h1>
            </div>
        ))}
    </div>
  )
}