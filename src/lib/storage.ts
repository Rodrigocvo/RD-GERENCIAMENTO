import { BetData } from '../components/Dashboard';

const STORAGE_KEY = 'rd_gerenciamento_data';
const BANKROLL_KEY = 'rd_gerenciamento_bankroll';

export const storage = {
  saveBets: (bets: BetData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bets));
  },
  
  getBets: (): BetData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveBankroll: (value: number) => {
    localStorage.setItem(BANKROLL_KEY, value.toString());
  },

  getBankroll: (): number => {
    const value = localStorage.getItem(BANKROLL_KEY);
    return value ? parseFloat(value) : 10000;
  }
};
