declare module "tournament-bracket" {
  import { FC } from "react";

  interface Team {
    name: string;
  }

  interface Seed {
    id: number;
    teams: Team[];
    winner: string;
  }

  interface Round {
    title: string;
    seeds: Seed[];
  }

  interface BracketProps {
    rounds: Round[];
  }

  const Bracket: FC<BracketProps>;
  export default Bracket;
}
