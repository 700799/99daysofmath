import { useEffect, useState } from 'react';
import {
  getDomainSummary,
  getUnitProblems,
  getUnitsForDomain,
} from '../data/problems';
import type { Domain, DomainSummary, Problem } from '../types/problem';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useDomainSummary(): AsyncState<DomainSummary[]> {
  const [state, setState] = useState<AsyncState<DomainSummary[]>>({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    let cancelled = false;
    getDomainSummary()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}

export function useUnitsForDomain(domain: Domain): AsyncState<number[]> {
  const [state, setState] = useState<AsyncState<number[]>>({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    getUnitsForDomain(domain)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });
    return () => {
      cancelled = true;
    };
  }, [domain]);
  return state;
}

export function useUnitProblems(
  domain: Domain,
  unit: number,
): AsyncState<Problem[]> {
  const [state, setState] = useState<AsyncState<Problem[]>>({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    getUnitProblems(domain, unit)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });
    return () => {
      cancelled = true;
    };
  }, [domain, unit]);
  return state;
}
