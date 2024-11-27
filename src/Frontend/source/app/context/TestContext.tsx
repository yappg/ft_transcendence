import { useContext, createContext } from 'react';

interface TestContextProps {
  value: string;
  setValue: (value: string) => void;
}

export const TestContext = createContext({} as TestContextProps);
