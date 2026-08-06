import { useState, useCallback, useEffect, useRef } from 'react'

interface UseAsyncDataResult<T> {
  data: T | null
  loading: boolean
  error: boolean
  reload: () => Promise<void>
}

export function useAsyncData<T>(fetcher: () => Promise<T>): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const result = await fetcherRef.current()
      setData(result)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { data, loading, error, reload: load }
}