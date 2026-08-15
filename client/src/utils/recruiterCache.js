const RECRUITER_CACHE_KEY = 'insiderjobs-recruiter-console-cache'

const getCacheKey = (companyToken) => `${RECRUITER_CACHE_KEY}:${companyToken || 'guest'}`

export const readRecruiterCache = (companyToken) => {
  if (!companyToken) return null

  try {
    const raw = localStorage.getItem(getCacheKey(companyToken))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const writeRecruiterCache = (companyToken, patch) => {
  if (!companyToken) return

  try {
    const previous = readRecruiterCache(companyToken) || {}
    localStorage.setItem(
      getCacheKey(companyToken),
      JSON.stringify({
        ...previous,
        ...patch,
        cachedAt: Date.now()
      })
    )
  } catch {
    // Cache is only a performance layer.
  }
}
