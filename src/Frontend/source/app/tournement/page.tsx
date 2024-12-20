import React from 'react';
import Bracket from 'tournament-bracket';

// import TournamentTree from './TournamentTree';

// declare module 'tournament-bracket' {
//   import { FC } from 'react';

//   interface Team {
//     name: string;
//   }

//   interface Seed {
//     id: number;
//     teams: Team[];
//     winner: string;
//   }

//   interface Round {
//     title: string;
//     seeds: Seed[];
//   }

//   interface BracketProps {
//     rounds: Round[];
//   }

//   const Bracket: FC<BracketProps>;
//   export default Bracket;
// }

// const TournamentTree = ({ matches }: { matches: any }) => {
//   return (
//     <div>
//       <BracketTree rounds={matches} />
//     </div>
//   );
// };

const App = () => {
  const matches = [
    {
      title: 'Semi Finals',
      seeds: [
        {
          id: 1,
          teams: [{ name: 'Player 1' }, { name: 'Player 2' }],
          winner: 'Player 1',
        },
        {
          id: 2,
          teams: [{ name: 'Player 3' }, { name: 'Player 4' }],
          winner: 'Player 3',
        },
      ],
    },
    {
      title: 'Final',
      seeds: [
        {
          id: 3,
          teams: [{ name: 'Player 1' }, { name: 'Player 3' }],
          winner: 'Player 1',
        },
      ],
    },
  ];
  // console.log(bracket);

  return (
    <div>
      <h1>Tournament Bracket</h1>
      <Bracket rounds={matches} />
    </div>
  );
};

export default App;
