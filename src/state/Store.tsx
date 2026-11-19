import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { repository } from "../services/repository";
import type { AppState, Lang } from "../domain/types";
import { initialState } from "../domain/engine";
type Change = (fn: (s: AppState) => AppState) => Promise<void>;
const Context = createContext<{
  state: AppState;
  ready: boolean;
  error?: string;
  change: Change;
}>({
  state: initialState(),
  ready: false,
  change: async () => {
    throw new Error("STORE");
  },
});
export function Store({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState),
    [ready, setReady] = useState(false),
    [error, setError] = useState<string>();
  const current = useRef(state),
    queue = useRef(Promise.resolve());
  useEffect(() => {
    repository
      .load()
      .then((s) => {
        current.current = s;
        setState(s);
        setReady(true);
      })
      .catch((e) => setError(String(e)));
  }, []);
  const change: Change = useCallback((fn) => {
    const operation = queue.current
      .catch(() => {})
      .then(async () => {
        const next = fn(current.current);
        await repository.save(next);
        current.current = next;
        setState(next);
      });
    queue.current = operation;
    return operation;
  }, []);
  return (
    <Context.Provider value={{ state, ready, error, change }}>
      {children}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
export const useLang = (): Lang => useStore().state.settings.lang;
