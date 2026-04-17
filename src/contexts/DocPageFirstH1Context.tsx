import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';

const DocPageFirstH1Context = createContext<(() => boolean) | undefined>(
  undefined,
);

type ProviderProps = {
  docKey: string;
  /** When the doc title is rendered synthetically (no `#` in MDX), skip copy on first MDX `h1`. */
  skipMdxH1Copy: boolean;
  children: React.ReactNode;
};

export function DocPageFirstH1Provider({
  docKey,
  skipMdxH1Copy,
  children,
}: ProviderProps): React.ReactElement {
  const consumedRef = useRef(false);

  useLayoutEffect(() => {
    consumedRef.current = false;
  }, [docKey, skipMdxH1Copy]);

  const claimFirstMdxH1 = useCallback(() => {
    if (skipMdxH1Copy) {
      return false;
    }
    if (consumedRef.current) {
      return false;
    }
    consumedRef.current = true;
    return true;
  }, [skipMdxH1Copy]);

  return (
    <DocPageFirstH1Context.Provider value={claimFirstMdxH1}>
      {children}
    </DocPageFirstH1Context.Provider>
  );
}

/** Returns a function that is `true` only for the first MDX `h1` on the page (when enabled). */
export function useDocPageFirstH1Claim(): () => boolean {
  const fn = useContext(DocPageFirstH1Context);
  return fn ?? (() => false);
}
