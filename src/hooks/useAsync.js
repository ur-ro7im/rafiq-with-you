import { useEffect, useState } from "react";

export function useAsync(load, deps) {
  const [state, setState] = useState({ status: "loading", data: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: "loading", data: null });
    load(ctrl.signal)
      .then((data) => {
        // console.log(data);
        if (!ctrl.signal.aborted) setState({ status: "ready", data });
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ status: "error", data: null });
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
