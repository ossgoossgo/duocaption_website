import { useState, createContext, useContext } from "react";
import type { SentenceCard } from "@shared/card-types";
import { Home } from "./pages/Home";
import { ShowList } from "./pages/ShowList";
import { CardList } from "./pages/CardList";
import { Review } from "./pages/Review";
import { RandomReview } from "./pages/RandomReview";
import { Search } from "./pages/Search";
import { SessionDone } from "./pages/SessionDone";
import { Stats } from "./pages/Stats";
import { Empty } from "./pages/Empty";
import { useCards } from "./hooks/useCards";
import { palette, PaletteContext } from "./theme";
import "./global.css";

export type Route = "home" | "shows" | "cards" | "review" | "random" | "search" | "done" | "empty" | "stats" | "help" | "legal";

interface CardsContextType {
  cards: SentenceCard[];
  loading: boolean;
  reload: () => Promise<void>;
  updateCard: (card: SentenceCard) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
}

export const CardsContext = createContext<CardsContextType>({
  cards: [],
  loading: true,
  reload: async () => {},
  updateCard: async () => {},
  deleteCard: async () => {},
});

export const useCardsContext = () => useContext(CardsContext);

// 記住目前選的是哪部劇
interface NavState {
  selectedShow?: string;
}

export function App() {
  const [route, setRoute] = useState<Route>("home");
  const [navState, setNavState] = useState<NavState>({});
  const cardsData = useCards();
  const P = palette;

  const navigate = (r: Route, show?: string) => {
    if (show !== undefined) setNavState(prev => ({ ...prev, selectedShow: show }));
    setRoute(r);
  };

  const isEmpty = !cardsData.loading && cardsData.cards.length === 0;

  const renderPage = () => {
    if (cardsData.loading) {
      return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: P.textMute }}>載入中…</div>;
    }

    switch (route) {
      case "home": return isEmpty ? <Empty onNavigate={navigate} /> : <Home onNavigate={navigate} />;
      case "shows": return <ShowList onNavigate={navigate} />;
      case "cards": return <CardList onNavigate={navigate} selectedShow={navState.selectedShow} />;
      case "review": return <Review onNavigate={navigate} selectedShow={navState.selectedShow} />;
      case "random": return <RandomReview onNavigate={navigate} />;
      case "search": return <Search onNavigate={navigate} />;
      case "stats": return <Stats onNavigate={navigate} />;
      case "done": return <SessionDone onNavigate={navigate} />;
      case "empty": return <Empty onNavigate={navigate} />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <PaletteContext.Provider value={P}>
      <CardsContext.Provider value={cardsData}>
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
          {renderPage()}
        </div>
      </CardsContext.Provider>
    </PaletteContext.Provider>
  );
}
